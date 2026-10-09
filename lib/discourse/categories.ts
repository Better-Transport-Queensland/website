/**
 * Registry of the Discourse categories this site reads from.
 *
 * The old RSS-based helper gated topics by comparing the feed's `<category>`
 * element to a caller-supplied name. The `.json` API exposes `category_id`
 * only, so the gate is now id-based and this registry is the single place that
 * maps between ids, slugs, display titles and site routes.
 */

export type DiscourseCategory = {
  /** Discourse category id, as it appears in `category_id`. */
  id: number
  /** Discourse slug for the category itself, e.g. 'media-releases'. */
  slug: string
  /** Path used to build the index URL: `/c/<path>/<id>.json`. */
  path: string
  /** Display title, matching the `categoryTitle` prop passed by existing pages. */
  title: string
  /** Site route segment used to build article hrefs, or null if not listed. */
  route: string | null
}

export const DISCOURSE_CATEGORIES: readonly DiscourseCategory[] = [
  {
    id: 11,
    slug: 'media-releases',
    path: 'media/media-releases',
    title: 'Media Releases',
    route: 'releases',
  },
  {
    id: 57,
    slug: 'blog',
    path: 'media/blog',
    title: 'Blog',
    route: 'blog',
  },
  {
    // Used by /agm, which renders a single hardcoded topic rather than a list.
    id: 8,
    slug: 'announcements',
    path: 'announcements',
    title: 'Announcements',
    route: null,
  },
]

export const CACHED_CATEGORY_IDS: readonly number[] = DISCOURSE_CATEGORIES.map(
  (category) => category.id,
)

export function categoryById(id: number): DiscourseCategory | undefined {
  return DISCOURSE_CATEGORIES.find((category) => category.id === id)
}

/**
 * Resolve a category from whatever string a caller happens to hold.
 *
 * Existing callers are inconsistent: the detail routes pass the display title
 * ('Media Releases', 'Blog') while app/agm/page.tsx passes the slug
 * ('announcements'). Match on title, slug and route so all of them keep
 * working without changes.
 */
export function categoryByTitle(title: string): DiscourseCategory | undefined {
  const needle = title.trim().toLowerCase()
  return DISCOURSE_CATEGORIES.find(
    (category) =>
      category.title.toLowerCase() === needle ||
      category.slug.toLowerCase() === needle ||
      category.route?.toLowerCase() === needle,
  )
}

/**
 * Auto-generated "About the <x> category" topics are definitional boilerplate
 * that the RSS feeds excluded but the `.json` index includes. The slug pattern
 * is the primary test; the explicit ids are a documented backstop.
 */
const ABOUT_TOPIC_SLUG = /^about-the-.+-category$/
const ABOUT_TOPIC_IDS = new Set([20, 281])

export function isAboutCategoryTopic(topic: {
  id: number
  slug: string
}): boolean {
  return ABOUT_TOPIC_SLUG.test(topic.slug) || ABOUT_TOPIC_IDS.has(topic.id)
}
