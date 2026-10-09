/**
 * Raw Discourse JSON → app-facing shapes.
 *
 * The HTML extraction here is lifted verbatim (same regexes) from
 * components/topics/feed-snippets.tsx and components/topics/embedded-topic.tsx
 * so cards and OG images keep selecting exactly the same markup. The only
 * change is *when* it runs: once at cache-fill instead of on every render.
 */

import type { DiscourseCategory } from '@/lib/discourse/categories'
import { categoryById, isAboutCategoryTopic } from '@/lib/discourse/categories'
import { discourseOrigin } from '@/lib/discourse/client'
import type {
  RawCategoryIndex,
  RawTopic,
  TopicArticle,
  TopicSummary,
} from '@/lib/discourse/types'
import { createHash } from 'crypto'
import DOMPurify from 'isomorphic-dompurify'

/* ------------------------------------------------------------------ */
/*  HTML extraction (ported, behaviour-preserving)                     */
/* ------------------------------------------------------------------ */

/**
 * Extract the element carrying `data-wrap="<id>"`, as the card previously did
 * at render time. Same dynamically-built regex as the original.
 */
export function extractDataWrap(
  html: string,
  dataWrapId: string,
): string | null {
  const regex = new RegExp(
    `<([a-zA-Z0-9]+)([^>]*\\bdata-wrap\\s*=\\s*"${dataWrapId}"[^>]*)>((?:(?!<\\/\\1>)[\\s\\S])*)<\\/\\1>`,
    'i',
  )
  return html.match(regex)?.[0] ?? null
}

/** The original card's `sanitisation` callback: first <img> tag in a fragment. */
export function extractFirstImgTag(html: string): string | null {
  return html.match(/<img\b[^>]*>(.*?)<\/img>|<img\b[^>]*\/?>/)?.[0] ?? null
}

function imgSrc(imgTag: string): string | null {
  return imgTag.match(/\bsrc=["']([^"']+)["']/i)?.[1] ?? null
}

/**
 * First non-emoji image in the body, for OG images. Keeps the original's
 * looser `includes('emoji')` test so the same image is chosen as today.
 */
export function extractFirstImageUrl(html: string): string | null {
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi
  let match: RegExpExecArray | null
  while ((match = imgRegex.exec(html)) !== null) {
    const src = match[1]
    if (!src.includes('/images/emoji') && !src.includes('emoji')) return src
  }
  return null
}

/* ------------------------------------------------------------------ */
/*  Staleness fingerprint                                              */
/* ------------------------------------------------------------------ */

/**
 * Hash of the index fields Discourse derives from a topic's first post.
 *
 * IMPORTANT: a changed fingerprint *triggers* a refetch, but an unchanged one
 * proves nothing — `excerpt` is truncated to ~220 characters, so an edit
 * further down a long post leaves all three fields identical. Freshness is
 * guaranteed by the max-age backstop and the webhook, never by this value.
 */
export function fingerprintSummary(topic: {
  title: string
  excerpt: string | null
  indexImageUrl: string | null
}): string {
  return createHash('sha1')
    .update(
      [topic.title, topic.excerpt ?? '', topic.indexImageUrl ?? ''].join(
        '\u0000',
      ),
    )
    .digest('hex')
}

/* ------------------------------------------------------------------ */
/*  Index → TopicSummary[]                                             */
/* ------------------------------------------------------------------ */

function articleHref(
  category: DiscourseCategory,
  slug: string,
  id: number,
): string {
  // Matches the old string-replace on the RSS <link>: `/<route>/<slug>/<id>`.
  return `/${category.route ?? category.slug}/${slug}/${id}`
}

function forumUrl(slug: string, id: number): string {
  return `${discourseOrigin()}/t/${slug}/${id}`
}

export function toTopicSummaries(
  index: RawCategoryIndex,
  category: DiscourseCategory,
): TopicSummary[] {
  const usersById = new Map(
    (index.users ?? []).map((user) => [user.id, user.username]),
  )

  return (index.topic_list?.topics ?? [])
    .filter((topic) => topic.visible !== false && topic.archived !== true)
    .filter((topic) => !isAboutCategoryTopic(topic))
    .map((topic) => {
      const posterId =
        topic.posters?.find((poster) => poster.primary)?.user_id ??
        topic.posters?.[0]?.user_id
      return {
        id: topic.id,
        slug: topic.slug,
        title: topic.title,
        createdAt: topic.created_at,
        bumpedAt: topic.bumped_at,
        postsCount: topic.posts_count,
        excerpt: topic.excerpt ?? null,
        indexImageUrl: topic.image_url ?? null,
        author:
          posterId !== undefined ? (usersById.get(posterId) ?? null) : null,
        categoryId: topic.category_id,
        tags: topic.tags ?? [],
        pinned: topic.pinned === true,
        href: articleHref(category, topic.slug, topic.id),
        forumUrl: forumUrl(topic.slug, topic.id),
      }
    })
}

/* ------------------------------------------------------------------ */
/*  Topic → TopicArticle                                              */
/* ------------------------------------------------------------------ */

export function toTopicArticle(topic: RawTopic): TopicArticle | null {
  // post_stream.posts[0] is the original post. (The old RSS feed listed the OP
  // last, hence `items.at(length - 1)` in the helper this replaces.)
  const post = topic.post_stream?.posts?.[0]
  if (!post || typeof post.cooked !== 'string') return null

  const category = categoryById(topic.category_id)
  const route = category?.route ?? category?.slug ?? 'releases'

  // Sanitise once here for the *derived* fragments only. cookedHtml is stored
  // verbatim because embedded-topic.tsx sanitises it itself at render time.
  const sanitised = DOMPurify.sanitize(post.cooked)
  const summaryWrap = extractDataWrap(sanitised, 'summary')
  const summaryImageWrap = extractDataWrap(sanitised, 'summary-image')
  const summaryImageHtml = summaryImageWrap
    ? extractFirstImgTag(summaryImageWrap)
    : null

  return {
    id: topic.id,
    slug: topic.slug,
    title: topic.title,
    categoryId: topic.category_id,
    tags: topic.tags ?? [],
    author: topic.details?.created_by?.username ?? post.username ?? null,
    createdAt: post.created_at,
    postUpdatedAt: post.updated_at,
    postVersion: post.version,
    cookedHtml: post.cooked,
    summaryHtml: summaryWrap,
    summaryImageHtml,
    summaryImageUrl: summaryImageHtml ? imgSrc(summaryImageHtml) : null,
    heroImageUrl: extractFirstImageUrl(post.cooked),
    href: `/${route}/${topic.slug}/${topic.id}`,
    forumUrl: forumUrl(topic.slug, topic.id),
  }
}
