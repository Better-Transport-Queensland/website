/**
 * Raw HTTP access to the Discourse read API. No caching lives here.
 *
 * Failure semantics matter: these functions **throw** DiscourseFetchError when
 * the forum is unreachable or errors, and return null only when a topic is
 * genuinely gone (404/410). That distinction is what lets the cache layer serve
 * stale content during an outage instead of caching a null and turning a
 * transient blip into 30 minutes of 404s, as the old RSS helper did.
 */

import { getDiscourseConfig } from '@/lib/discourse-config.server'
import type { DiscourseCategory } from '@/lib/discourse/categories'
import type { RawCategoryIndex, RawTopic } from '@/lib/discourse/types'

const REQUEST_TIMEOUT_MS = 8000

export class DiscourseFetchError extends Error {
  constructor(
    readonly url: string,
    readonly status?: number,
    options?: { cause?: unknown },
  ) {
    super(
      status
        ? `Discourse request failed (${status}): ${url}`
        : `Discourse request failed: ${url}`,
      options,
    )
    this.name = 'DiscourseFetchError'
  }
}

export function discourseOrigin(): string {
  return `https://${getDiscourseConfig().host}`
}

/**
 * `cache: 'no-store'` keeps our own cache layer as the single source of
 * caching, matching the convention in helpers/translinkAlertsHelper.ts.
 * Discourse sends `cache-control: no-cache, no-store` and no ETag or
 * Last-Modified, so conditional requests are not available to us.
 */
async function getJson<T>(url: string): Promise<T | null> {
  let response: Response
  try {
    response = await fetch(url, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    })
  } catch (error) {
    throw new DiscourseFetchError(url, undefined, { cause: error })
  }

  // A deleted or unlisted topic is a real answer, not a failure.
  if (response.status === 404 || response.status === 410) return null
  if (!response.ok) throw new DiscourseFetchError(url, response.status)

  try {
    return (await response.json()) as T
  } catch (error) {
    throw new DiscourseFetchError(url, response.status, { cause: error })
  }
}

export async function fetchCategoryIndex(
  category: DiscourseCategory,
  page = 0,
): Promise<RawCategoryIndex> {
  const url = new URL(
    `/c/${category.path}/${category.id}.json`,
    discourseOrigin(),
  )
  if (page > 0) url.searchParams.set('page', String(page))

  const data = await getJson<RawCategoryIndex>(url.toString())
  // A category index should never 404; treat it as a failure so we serve stale.
  if (!data) throw new DiscourseFetchError(url.toString(), 404)
  return data
}

/**
 * Fetch one topic. Pass the slug from the index when known: Discourse 301s
 * `/t/-/<id>.json` to the canonical slug, so omitting it costs a redirect.
 */
export async function fetchTopic(
  topicId: number,
  slug?: string,
): Promise<RawTopic | null> {
  const url = new URL(
    `/t/${slug && slug.length > 0 ? slug : '-'}/${topicId}.json`,
    discourseOrigin(),
  )
  return getJson<RawTopic>(url.toString())
}
