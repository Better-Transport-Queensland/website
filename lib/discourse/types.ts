/**
 * Types for the Discourse `.json` read path and its two-tier cache.
 *
 * Raw* types describe only the fields we actually consume from Discourse's
 * responses. The app-facing types (TopicSummary, TopicArticle) are what pages
 * and components see, so render code never touches raw API shapes.
 */

/* ------------------------------------------------------------------ */
/*  Raw Discourse responses                                            */
/* ------------------------------------------------------------------ */

export type RawCategoryTopic = {
  id: number
  slug: string
  title: string
  created_at: string
  bumped_at: string
  last_posted_at: string | null
  posts_count: number
  reply_count?: number
  excerpt?: string | null
  image_url?: string | null
  tags?: string[]
  pinned?: boolean
  visible?: boolean
  archived?: boolean
  archetype?: string
  category_id: number
  posters?: { user_id: number; primary?: boolean }[]
}

export type RawCategoryIndex = {
  users?: { id: number; username: string }[]
  topic_list?: {
    per_page?: number
    more_topics_url?: string | null
    topics?: RawCategoryTopic[]
  }
}

export type RawPost = {
  id: number
  post_number: number
  cooked: string
  created_at: string
  updated_at: string
  version: number
  username?: string
}

export type RawTopic = {
  id: number
  slug: string
  title: string
  created_at: string
  bumped_at?: string
  posts_count: number
  category_id: number
  tags?: string[]
  post_stream?: { posts?: RawPost[] }
  details?: { created_by?: { username?: string } }
}

/* ------------------------------------------------------------------ */
/*  App-facing shapes                                                  */
/* ------------------------------------------------------------------ */

/** One row of a category listing. Derived from the index alone — no body. */
export type TopicSummary = {
  id: number
  slug: string
  title: string
  createdAt: string
  bumpedAt: string
  postsCount: number
  /**
   * Discourse-generated excerpt of the first post, truncated to ~220 chars.
   * Used as a card fallback and as one input to the staleness fingerprint.
   */
  excerpt: string | null
  /** Index-level image, a fallback for the card when no summary-image exists. */
  indexImageUrl: string | null
  author: string | null
  categoryId: number
  tags: string[]
  pinned: boolean
  /** Site-relative article href, e.g. `/releases/<slug>/<id>`. */
  href: string
  /** Canonical forum URL, e.g. `https://<host>/t/<slug>/<id>`. */
  forumUrl: string
}

/** A single topic's first post, ready to render. */
export type TopicArticle = {
  id: number
  slug: string
  title: string
  categoryId: number
  tags: string[]
  author: string | null
  /** First post's creation time — what the page displays. */
  createdAt: string
  /** First post's last edit time and revision, for diagnostics. */
  postUpdatedAt: string
  postVersion: number
  /** `post_stream.posts[0].cooked`, verbatim. Sanitised at render time. */
  cookedHtml: string
  /** Extracted `data-wrap="summary"` fragment, sanitised at cache-fill. */
  summaryHtml: string | null
  /**
   * The first `<img>` *tag* inside `data-wrap="summary-image"`, kept verbatim
   * so the card renders Discourse's own attributes (alt, srcset, width,
   * height) exactly as it does today rather than a reconstructed element.
   */
  summaryImageHtml: string | null
  /** The src of the above, for fallback decisions. */
  summaryImageUrl: string | null
  /** First non-emoji `<img src>` anywhere in the body, for OG images. */
  heroImageUrl: string | null
  href: string
  forumUrl: string
}

/* ------------------------------------------------------------------ */
/*  Cache records                                                      */
/* ------------------------------------------------------------------ */

/**
 * Bump this when any derivation above changes. The value is a path segment in
 * the cache directory, so bumping it orphans every stale file at once and no
 * migration code is ever needed.
 */
export const CACHE_SCHEMA_VERSION = 1

export type TopicRecord = {
  schema: number
  /** When this body was fetched. Drives the max-age backstop. */
  fetchedAt: number
  /**
   * Hash of the first-post-derived index fields (title/excerpt/image_url).
   * A mismatch *triggers* a refetch; a match proves nothing. See cache.ts.
   */
  fingerprint: string
  /** Kept for diagnostics only — deliberately not part of staleness. */
  bumpedAt: string
  postsCount: number
  article: TopicArticle
}

export type CategoryRecord = {
  schema: number
  fetchedAt: number
  categoryId: number
  topics: TopicSummary[]
}
