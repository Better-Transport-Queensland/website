'use server'

import {
  toCardData,
  TOPICS_PAGE_SIZE,
  type TopicCardData,
} from '@/lib/discourse/card-data'
import { CACHED_CATEGORY_IDS } from '@/lib/discourse/categories'
import {
  getCategoryTopics,
  getTopicArticle,
} from '@/lib/discourse/topics.server'

// NOTE: a 'use server' module may only export async functions — exporting a
// constant from here silently strips every export. Shared values live in
// lib/discourse/card-data.ts.

/**
 * Return one page of listing cards.
 *
 * Reachable from the browser, so `categoryId` is validated against the
 * registry rather than trusted — this must never become a way to read an
 * arbitrary Discourse category. `offset`/`limit` are clamped for the same
 * reason.
 */
export async function loadTopicCards(
  categoryId: number,
  offset: number,
  limit: number = TOPICS_PAGE_SIZE,
): Promise<{ cards: TopicCardData[]; total: number }> {
  if (!CACHED_CATEGORY_IDS.includes(categoryId)) {
    return { cards: [], total: 0 }
  }

  const safeOffset = Number.isFinite(offset)
    ? Math.max(0, Math.trunc(offset))
    : 0
  const safeLimit = Number.isFinite(limit)
    ? Math.min(Math.max(1, Math.trunc(limit)), TOPICS_PAGE_SIZE)
    : TOPICS_PAGE_SIZE

  const topics = await getCategoryTopics(categoryId)
  const page = topics.slice(safeOffset, safeOffset + safeLimit)

  // Only the requested slice has its article read, so paging in more cards
  // never touches the other topics.
  const cards = await Promise.all(
    page.map(async (topic) =>
      toCardData(topic, await getTopicArticle(topic.id, categoryId)),
    ),
  )

  return { cards, total: topics.length }
}
