/**
 * The serialisable view model behind a listing card.
 *
 * Kept free of server-only imports and of the full cooked post body: a card
 * needs only the already-extracted summary fragments, so paging in more cards
 * never ships whole article bodies to the browser.
 */

import type { TopicArticle, TopicSummary } from '@/lib/discourse/types'

/** Listing page size, and the cap on how many cards one request may return. */
export const TOPICS_PAGE_SIZE = 10

export type TopicCardData = {
  id: number
  href: string
  title: string
  author: string | null
  createdAt: string
  /** Pre-extracted `data-wrap="summary"` fragment, already sanitised. */
  summaryHtml: string | null
  /** Pre-extracted `<img>` tag from `data-wrap="summary-image"`. */
  summaryImageHtml: string | null
  /** Fallbacks when a topic carries no summary wrap. */
  excerpt: string | null
  indexImageUrl: string | null
}

export function toCardData(
  summary: TopicSummary,
  article: TopicArticle | null,
): TopicCardData {
  return {
    id: summary.id,
    href: summary.href,
    title: summary.title,
    author: summary.author,
    createdAt: summary.createdAt,
    summaryHtml: article?.summaryHtml ?? null,
    summaryImageHtml: article?.summaryImageHtml ?? null,
    excerpt: summary.excerpt,
    indexImageUrl: summary.indexImageUrl,
  }
}
