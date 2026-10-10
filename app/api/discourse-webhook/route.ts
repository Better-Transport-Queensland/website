/**
 * Discourse webhook receiver — invalidates the topic cache the moment content
 * changes, so edits appear immediately instead of waiting for the max-age
 * backstop in lib/discourse/cache.ts.
 *
 * Deliberately event-name agnostic. Discourse's event names vary by version,
 * and every case reduces to the same idempotent action: drop the cached entry
 * and let the next request re-resolve it (a destroyed topic 404s and renders
 * notFound(); a recovered one repopulates). So we branch on payload *state*,
 * never on the event name.
 */

import { CACHED_CATEGORY_IDS } from '@/lib/discourse/categories'
import {
  cacheStatus,
  invalidateCategory,
  invalidateTopic,
  isTopicKnown,
  rewarmAfterInvalidation,
} from '@/lib/discourse/topics.server'
import { discourseWebhookLimiter } from '@/lib/rate-limiter'
import { createHmac, timingSafeEqual } from 'crypto'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Last seen event ids, so Discourse's retries don't re-warm repeatedly. */
const seenEventIds: string[] = []
const SEEN_LIMIT = 256

function alreadyHandled(eventId: string | null): boolean {
  if (!eventId) return false
  if (seenEventIds.includes(eventId)) return true
  seenEventIds.push(eventId)
  if (seenEventIds.length > SEEN_LIMIT) seenEventIds.shift()
  return false
}

function getClientIp(request: NextRequest): string {
  const cfIp = request.headers.get('cf-connecting-ip')?.trim()
  if (cfIp) return cfIp
  const xff = request.headers.get('x-forwarded-for')
  if (xff) {
    const parts = xff
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean)
    if (parts.length > 0) return parts[parts.length - 1]
  }
  return request.headers.get('x-real-ip')?.trim() || 'unknown'
}

function signatureMatches(raw: string, header: string, secret: string) {
  const provided = header.startsWith('sha256=') ? header.slice(7) : null
  if (!provided) return false

  const expected = createHmac('sha256', secret).update(raw, 'utf8').digest()
  let providedBuf: Buffer
  try {
    providedBuf = Buffer.from(provided, 'hex')
  } catch {
    return false
  }
  // timingSafeEqual throws on length mismatch, so check length first.
  if (providedBuf.length !== expected.length) return false
  return timingSafeEqual(providedBuf, expected)
}

type WebhookBody = {
  ping?: unknown
  topic?: {
    id?: number
    category_id?: number
    deleted_at?: string | null
    visible?: boolean
  }
  post?: {
    id?: number
    topic_id?: number
    post_number?: number
    category_id?: number
    deleted_at?: string | null
  }
  topic_id?: number
}

export async function POST(request: NextRequest) {
  const secret = process.env.DISCOURSE_WEBHOOK_SECRET
  if (!secret) {
    // Never fall through to unverified processing.
    return NextResponse.json(
      { error: 'webhook not configured' },
      { status: 503 },
    )
  }

  const ip = getClientIp(request)
  if (!discourseWebhookLimiter.check(ip).allowed) {
    return NextResponse.json({ error: 'rate limited' }, { status: 429 })
  }
  discourseWebhookLimiter.increment(ip)

  // The HMAC covers the exact bytes Discourse sent, so the raw text must be
  // read before parsing — request.json() would consume the stream and
  // re-serialising could not reproduce those bytes.
  const raw = await request.text()

  const signature = request.headers.get('x-discourse-event-signature')
  if (!signature || !signatureMatches(raw, signature, secret)) {
    return NextResponse.json({ error: 'invalid signature' }, { status: 401 })
  }

  let body: WebhookBody
  try {
    body = JSON.parse(raw) as WebhookBody
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }

  const eventName = request.headers.get('x-discourse-event') ?? ''
  if (eventName === 'ping' || body.ping !== undefined) {
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  if (alreadyHandled(request.headers.get('x-discourse-event-id'))) {
    return NextResponse.json({ ok: true, duplicate: true }, { status: 202 })
  }

  const topicId = body.topic?.id ?? body.post?.topic_id ?? body.topic_id ?? null
  const categoryId = body.topic?.category_id ?? body.post?.category_id ?? null
  const postNumber = body.post?.post_number ?? null
  const isPostEvent = body.post !== undefined

  // Act only on content we actually cache. `isTopicKnown` also catches a topic
  // moved *out* of a watched category, and destroy events that arrive without
  // a usable category_id.
  const watched =
    (categoryId !== null && CACHED_CATEGORY_IDS.includes(categoryId)) ||
    (topicId !== null && isTopicKnown(topicId))
  if (!watched || topicId === null) {
    return NextResponse.json({ ok: true, ignored: true }, { status: 202 })
  }

  // We render the first post only, so a reply cannot change an article body.
  // It does change bumped_at, which reorders the listing, so the index is
  // still refreshed. A post event with no post_number is treated as unknown
  // rather than guessed at; that topic's own backstop covers it.
  const invalidateBody = !isPostEvent || postNumber === 1

  if (invalidateBody) await invalidateTopic(topicId)

  // Drop every watched index, not just the payload's category. A topic moved
  // between categories leaves the *old* listing stale, and destroy events can
  // arrive without a usable category_id — so there is no reliable way to know
  // which single index is affected. Indexes are small, metadata-only requests
  // with a 60s TTL anyway, so refetching all of them is cheaper than the
  // bookkeeping needed to narrow it down.
  await Promise.all(CACHED_CATEGORY_IDS.map((id) => invalidateCategory(id)))

  // Repopulate behind the response. Safe here because the deployment is a
  // long-lived `node server.js` process, not a serverless function that
  // freezes once the response is sent — do not move this to an edge runtime.
  void rewarmAfterInvalidation(topicId, CACHED_CATEGORY_IDS).catch(() => {
    /* already logged */
  })

  // Echo what was invalidated and which process did it. Discourse's webhook
  // event log shows this body, so a re-sent event doubles as a diagnostic:
  // a changing `pid` across deliveries means requests are spread over several
  // instances, and an invalidation only ever reaches the one that received it.
  return NextResponse.json(
    {
      ok: true,
      event: eventName || null,
      topicId,
      categoryId,
      postNumber,
      invalidatedBody: invalidateBody,
      invalidatedIndexes: CACHED_CATEGORY_IDS,
      cache: cacheStatus(),
    },
    { status: 202 },
  )
}

export async function GET() {
  // Explicit, so a Payload URL configured with the wrong method fails loudly.
  return NextResponse.json({ error: 'method not allowed' }, { status: 405 })
}
