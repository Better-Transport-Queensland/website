/**
 * The only Discourse module pages and components should import.
 *
 * Readers are wrapped in React's `cache()` so that a detail page's
 * generateMetadata and its component share a single lookup per request. That
 * alone removes the double fetch the previous RSS helper performed on every
 * cold article view.
 */

import {
  cacheStatus,
  invalidateCategory,
  invalidateTopic,
  isTopicKnown,
  getCategoryTopics as readCategoryTopics,
  getTopicArticle as readTopicArticle,
} from '@/lib/discourse/cache'
import {
  CACHED_CATEGORY_IDS,
  categoryById,
  categoryByTitle,
} from '@/lib/discourse/categories'
import type { TopicArticle, TopicSummary } from '@/lib/discourse/types'
import { cache } from 'react'

export { cacheStatus, invalidateCategory, invalidateTopic, isTopicKnown }
export type { TopicArticle, TopicSummary }

export const getCategoryTopics = cache(
  async (categoryId: number): Promise<TopicSummary[]> =>
    readCategoryTopics(categoryId),
)

export const getTopicArticle = cache(
  async (
    topicId: number,
    expectCategoryId?: number,
  ): Promise<TopicArticle | null> =>
    readTopicArticle(topicId, { expectCategoryId }),
)

/**
 * Resolve a category from the string shapes existing callers pass
 * ('Media Releases', 'Blog', 'announcements') and return its article.
 */
export async function getTopicArticleByCategoryTitle(
  topicId: number,
  categoryTitle: string,
): Promise<TopicArticle | null> {
  const category = categoryByTitle(categoryTitle)
  if (!category) return null
  return getTopicArticle(topicId, category.id)
}

/**
 * Repopulate after a webhook invalidation, so the refreshed copy is already on
 * disk before the next visitor arrives rather than making them wait for it.
 * Fire-and-forget: the webhook must answer Discourse immediately.
 */
export async function rewarmAfterInvalidation(
  topicId: number | null,
  categoryIds: readonly number[],
): Promise<void> {
  for (const categoryId of categoryIds) {
    try {
      const topics = await readCategoryTopics(categoryId)
      if (topicId !== null && topics.some((topic) => topic.id === topicId)) {
        await readTopicArticle(topicId, {
          expectCategoryId: categoryId,
          summary: topics.find((topic) => topic.id === topicId),
        })
      }
    } catch (error) {
      console.warn(
        `[discourse] rewarm of category ${categoryId} failed:`,
        error,
      )
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Startup prefetch                                                   */
/* ------------------------------------------------------------------ */

let prefetchStarted: Promise<void> | null = null

async function mapWithConcurrency<T>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<void>,
): Promise<void> {
  for (let i = 0; i < items.length; i += limit) {
    await Promise.all(items.slice(i, i + limit).map(fn))
  }
}

/**
 * Warm every watched category and its topics. Called (not awaited) from
 * instrumentation.ts so the first visitor after a deploy hits a warm cache. Already-fresh records are left alone, so a restart with a persisted
 * cache directory costs only the index requests.
 */
export function prefetchAll(opts?: { concurrency?: number }): Promise<void> {
  if (prefetchStarted) return prefetchStarted
  // Kept low: Discourse rate-limits bursts of topic reads with 503s.
  const concurrency = opts?.concurrency ?? 2

  prefetchStarted = (async () => {
    for (const categoryId of CACHED_CATEGORY_IDS) {
      const category = categoryById(categoryId)
      if (!category) continue
      try {
        const topics = await readCategoryTopics(categoryId)
        await mapWithConcurrency(topics, concurrency, async (topic) => {
          try {
            await readTopicArticle(topic.id, {
              expectCategoryId: categoryId,
              summary: topic,
            })
          } catch (error) {
            console.warn(
              `[discourse] prefetch of topic ${topic.id} failed:`,
              error,
            )
          }
        })
      } catch (error) {
        console.warn(
          `[discourse] prefetch of category ${categoryId} failed:`,
          error,
        )
      }
    }
  })()

  return prefetchStarted
}
