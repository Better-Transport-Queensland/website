/**
 * Two-tier cache for Discourse content: in-memory map over on-disk JSON.
 *
 * Why this exists: the pages previously re-downloaded a whole category RSS feed
 * (~180 KB of post bodies) on every request. Here we read a small metadata-only
 * category index and fetch an individual topic only when that topic's first
 * post may have changed.
 *
 * Freshness model — the order matters:
 *   1. Webhook invalidation (app/api/discourse-webhook) is immediate and exact.
 *   2. The max-age backstop bounds staleness when a webhook is missed.
 *   3. The index fingerprint is an *early trigger* only. Discourse's `excerpt`
 *      is truncated to ~220 chars, so an edit deep in a long post changes none
 *      of the index fields — never treat a matching fingerprint as evidence of
 *      freshness. There is no cheaper probe available: Discourse sends no ETag
 *      or Last-Modified and `cache-control: no-cache, no-store`.
 *
 * Failures never poison the cache: a fetch error serves whatever stale record
 * exists and writes nothing, so a forum blip degrades to slightly-old content
 * instead of the 30 minutes of 404s the previous null-caching helper produced.
 */

import {
  categoryById,
  type DiscourseCategory,
} from '@/lib/discourse/categories'
import {
  DiscourseFetchError,
  fetchCategoryIndex,
  fetchTopic,
} from '@/lib/discourse/client'
import {
  fingerprintSummary,
  toTopicArticle,
  toTopicSummaries,
} from '@/lib/discourse/transform'
import {
  CACHE_SCHEMA_VERSION,
  type CategoryRecord,
  type TopicArticle,
  type TopicRecord,
  type TopicSummary,
} from '@/lib/discourse/types'
import { randomUUID } from 'crypto'
import { mkdir, readFile, rename, unlink, writeFile } from 'fs/promises'
import os from 'os'
import path from 'path'

/* ------------------------------------------------------------------ */
/*  Configuration                                                      */
/* ------------------------------------------------------------------ */

function envInt(name: string, fallback: number): number {
  const raw = process.env[name]
  if (!raw) return fallback
  const value = Number.parseInt(raw, 10)
  return Number.isFinite(value) && value > 0 ? value : fallback
}

/** How long a category index is trusted before refetching. */
const categoryTtlMs = () => envInt('DISCOURSE_CATEGORY_TTL_SECONDS', 60) * 1000
/** The freshness guarantee: refetch a topic body once it is this old. */
const topicMaxAgeMs = () =>
  envInt('DISCOURSE_TOPIC_MAX_AGE_SECONDS', 3600) * 1000
/** After a failed fetch, wait this long before trying again. */
const STALE_RETRY_MS = 30_000
/** Lifetime of a memory-only "this topic is gone" marker. */
const NEGATIVE_TTL_MS = 60_000
/** Safety cap on index pagination. */
const MAX_INDEX_PAGES = 5

function cacheRoot(): string {
  const configured = process.env.DISCOURSE_CACHE_DIR?.trim()
  const base =
    configured && configured.length > 0
      ? configured
      : path.join(os.tmpdir(), 'btq-discourse-cache')
  return path.join(base, `v${CACHE_SCHEMA_VERSION}`)
}

/* ------------------------------------------------------------------ */
/*  Disk tier                                                          */
/* ------------------------------------------------------------------ */

let diskEnabled = true
let diskProbe: Promise<void> | null = null
let warnedWriteFailure = false

/**
 * Probe the cache directory once per process. A read-only or missing directory
 * is not fatal — we log once and run memory-only. In the container image /app
 * is root-owned while the process runs as `node`, so this path is real.
 */
async function ensureDisk(): Promise<void> {
  if (!diskEnabled) return
  if (!diskProbe) {
    diskProbe = (async () => {
      const root = cacheRoot()
      try {
        await mkdir(path.join(root, 'categories'), { recursive: true })
        await mkdir(path.join(root, 'topics'), { recursive: true })
        const probe = path.join(root, `.probe-${process.pid}`)
        await writeFile(probe, 'ok')
        await unlink(probe)
      } catch (error) {
        diskEnabled = false
        const code = (error as NodeJS.ErrnoException)?.code ?? 'unknown'
        console.warn(
          `[discourse] cache dir not writable (${code}) at ${root} — running memory-only`,
        )
      }
    })()
  }
  await diskProbe
}

const categoryPath = (id: number) =>
  path.join(cacheRoot(), 'categories', `${id}.json`)
const topicPath = (id: number) => path.join(cacheRoot(), 'topics', `${id}.json`)

async function readRecord<T extends { schema: number }>(
  file: string,
): Promise<T | null> {
  // Read even when writes are disabled: a populated read-only dir still serves.
  try {
    const parsed = JSON.parse(await readFile(file, 'utf8')) as T
    return parsed?.schema === CACHE_SCHEMA_VERSION ? parsed : null
  } catch {
    return null
  }
}

/** Temp file + rename, so a reader never observes a half-written record. */
async function writeRecord(file: string, record: unknown): Promise<void> {
  await ensureDisk()
  if (!diskEnabled) return
  const tmp = `${file}.${process.pid}.${randomUUID()}.tmp`
  try {
    await writeFile(tmp, JSON.stringify(record))
    await rename(tmp, file)
  } catch (error) {
    if (!warnedWriteFailure) {
      warnedWriteFailure = true
      console.warn('[discourse] cache write failed (continuing):', error)
    }
    await unlink(tmp).catch(() => {})
  }
}

async function removeRecord(file: string): Promise<void> {
  await unlink(file).catch(() => {})
}

/* ------------------------------------------------------------------ */
/*  Memory tier                                                        */
/* ------------------------------------------------------------------ */

const categoryMemory = new Map<number, CategoryRecord>()
const topicMemory = new Map<number, TopicRecord>()
/** Topic ids known to be deleted/unlisted, with an expiry. Never persisted. */
const topicMissing = new Map<number, number>()
const inflight = new Map<string, Promise<unknown>>()

/**
 * Collapse concurrent misses onto one upstream request. Without this, a cold
 * container serving its first listing would fire N identical topic fetches.
 */
function withInflight<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const existing = inflight.get(key) as Promise<T> | undefined
  if (existing) return existing
  const promise = fn().finally(() => inflight.delete(key))
  inflight.set(key, promise)
  return promise
}

/** Freeze before handing out, so a caller cannot mutate the cached value. */
function freezeTopics(topics: TopicSummary[]): TopicSummary[] {
  topics.forEach((topic) => Object.freeze(topic))
  return Object.freeze(topics) as TopicSummary[]
}

/* ------------------------------------------------------------------ */
/*  Category index                                                     */
/* ------------------------------------------------------------------ */

async function fetchAllIndexPages(
  category: DiscourseCategory,
): Promise<TopicSummary[]> {
  const topics: TopicSummary[] = []
  for (let page = 0; page < MAX_INDEX_PAGES; page++) {
    const index = await fetchCategoryIndex(category, page)
    topics.push(...toTopicSummaries(index, category))
    if (!index.topic_list?.more_topics_url) return topics
    if (page === MAX_INDEX_PAGES - 1) {
      console.warn(
        `[discourse] category ${category.id} has more than ${MAX_INDEX_PAGES} pages of topics; list truncated`,
      )
    }
  }
  return topics
}

export async function getCategoryRecord(
  categoryId: number,
): Promise<CategoryRecord | null> {
  const category = categoryById(categoryId)
  if (!category) return null

  let record = categoryMemory.get(categoryId) ?? null
  if (!record) {
    await ensureDisk()
    record = await readRecord<CategoryRecord>(categoryPath(categoryId))
    if (record) categoryMemory.set(categoryId, record)
  }

  const fresh = record && Date.now() - record.fetchedAt < categoryTtlMs()
  if (fresh) return record

  return withInflight(`category:${categoryId}`, async () => {
    try {
      const topics = await fetchAllIndexPages(category)
      const next: CategoryRecord = {
        schema: CACHE_SCHEMA_VERSION,
        fetchedAt: Date.now(),
        categoryId,
        topics: freezeTopics(topics),
      }
      categoryMemory.set(categoryId, next)
      await writeRecord(categoryPath(categoryId), next)
      return next
    } catch (error) {
      if (!(error instanceof DiscourseFetchError)) throw error
      console.warn(
        `[discourse] category ${categoryId} index fetch failed; serving cached copy:`,
        error.message,
      )
      if (!record) return null
      // Back off without discarding the stale copy.
      const retried: CategoryRecord = {
        ...record,
        fetchedAt: Date.now() - categoryTtlMs() + STALE_RETRY_MS,
      }
      categoryMemory.set(categoryId, retried)
      return retried
    }
  })
}

export async function getCategoryTopics(
  categoryId: number,
): Promise<TopicSummary[]> {
  const record = await getCategoryRecord(categoryId)
  return record ? record.topics : []
}

/* ------------------------------------------------------------------ */
/*  Topic bodies                                                       */
/* ------------------------------------------------------------------ */

function isStale(record: TopicRecord, summary?: TopicSummary): boolean {
  // (1) The guarantee: age alone forces a refetch.
  if (Date.now() - record.fetchedAt > topicMaxAgeMs()) return true
  // (2) Early trigger only. A match here must never be read as "fresh".
  if (summary && record.fingerprint !== fingerprintSummary(summary)) return true
  return false
}

async function loadTopicRecord(
  topicId: number,
  summary?: TopicSummary,
): Promise<TopicRecord | null> {
  const missingUntil = topicMissing.get(topicId)
  if (missingUntil !== undefined) {
    if (missingUntil > Date.now()) return null
    topicMissing.delete(topicId)
  }

  let record = topicMemory.get(topicId) ?? null
  if (!record) {
    await ensureDisk()
    record = await readRecord<TopicRecord>(topicPath(topicId))
    if (record) topicMemory.set(topicId, record)
  }

  if (record && !isStale(record, summary)) return record

  return withInflight(`topic:${topicId}`, async () => {
    try {
      const raw = await fetchTopic(topicId, summary?.slug)
      if (!raw) {
        // Genuinely gone: drop the record and remember briefly, so a crawler on
        // a dead URL does not generate one upstream request per hit.
        topicMemory.delete(topicId)
        topicMissing.set(topicId, Date.now() + NEGATIVE_TTL_MS)
        await removeRecord(topicPath(topicId))
        return null
      }

      const article = toTopicArticle(raw)
      if (!article) return record

      const next: TopicRecord = {
        schema: CACHE_SCHEMA_VERSION,
        fetchedAt: Date.now(),
        fingerprint: fingerprintSummary(
          summary ?? {
            title: raw.title,
            excerpt: null,
            indexImageUrl: null,
          },
        ),
        bumpedAt: raw.bumped_at ?? article.createdAt,
        postsCount: raw.posts_count,
        article: Object.freeze(article),
      }
      topicMemory.set(topicId, next)
      await writeRecord(topicPath(topicId), next)
      return next
    } catch (error) {
      if (!(error instanceof DiscourseFetchError)) throw error
      console.warn(
        `[discourse] topic ${topicId} fetch failed; serving cached copy:`,
        error.message,
      )
      if (!record) return null
      const retried: TopicRecord = {
        ...record,
        fetchedAt: Date.now() - topicMaxAgeMs() + STALE_RETRY_MS,
      }
      topicMemory.set(topicId, retried)
      return retried
    }
  })
}

export async function getTopicArticle(
  topicId: number,
  opts?: { expectCategoryId?: number; summary?: TopicSummary },
): Promise<TopicArticle | null> {
  let summary = opts?.summary
  if (!summary && opts?.expectCategoryId !== undefined) {
    // Pick up the slug and fingerprint from the index when it is already cached.
    const record = categoryMemory.get(opts.expectCategoryId)
    summary = record?.topics.find((topic) => topic.id === topicId)
  }

  const record = await loadTopicRecord(topicId, summary)
  if (!record) return null

  // Gate *after* a successful read, so an outage serves stale content rather
  // than a spurious 404 — same notFound() semantics as the old name-based gate.
  if (
    opts?.expectCategoryId !== undefined &&
    record.article.categoryId !== opts.expectCategoryId
  ) {
    return null
  }
  return record.article
}

/* ------------------------------------------------------------------ */
/*  Invalidation (used by the webhook)                                 */
/* ------------------------------------------------------------------ */

export async function invalidateTopic(topicId: number): Promise<void> {
  topicMemory.delete(topicId)
  topicMissing.delete(topicId)
  await ensureDisk()
  await removeRecord(topicPath(topicId))
}

export async function invalidateCategory(categoryId: number): Promise<void> {
  categoryMemory.delete(categoryId)
  await ensureDisk()
  await removeRecord(categoryPath(categoryId))
}

/** Topic ids currently held in memory or known-missing. Used for webhook filtering. */
export function isTopicKnown(topicId: number): boolean {
  return topicMemory.has(topicId) || topicMissing.has(topicId)
}

/* ------------------------------------------------------------------ */
/*  Diagnostics                                                        */
/* ------------------------------------------------------------------ */

export function cacheStatus() {
  return {
    root: cacheRoot(),
    diskEnabled,
    categories: categoryMemory.size,
    topics: topicMemory.size,
  }
}
