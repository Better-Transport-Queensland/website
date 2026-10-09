export type PolicyPlatformEdition = {
  /** Slug used in the archive URL, e.g. '2025' -> /policy-platform/2025 */
  slug: string
  /** Short edition label used in headings and buttons, e.g. '2025' or '2026-27' */
  label: string
  /** Hero and homepage heading, e.g. 'The 2025 Policy Platform' */
  title: string
  /** Link to the published PDF */
  pdfUrl: string
  /** Human-readable file size shown next to the download button */
  pdfSize: string
  /** Cover image in /public, used on the homepage feature and archive cards */
  coverImage: string
  /** Lead paragraph for the hero, homepage feature, and metadata description */
  lead: string
}

/**
 * Policy platform editions, newest first. The first entry is treated as the
 * current edition and is what /policy-platform and the homepage feature show;
 * every other entry is reachable at /policy-platform/<slug>.
 *
 * To publish the 2026-27 platform, add its entry to the top of this list.
 */
export const policyPlatformEditions: PolicyPlatformEdition[] = [
  {
    slug: '2025',
    label: '2025',
    title: 'The 2025 Policy Platform',
    pdfUrl:
      'https://forum.bettertransportqueensland.org/uploads/short-url/gq4IxO4BzgDkkXwibIuwLt6Y8aU.pdf',
    pdfSize: 'PDF · 2.4 MB',
    coverImage: '/2025_policy_platform.webp',
    lead: 'Our strategic vision for a safer, more accessible, and better-integrated transport system across Queensland, grounded in evidence and shaped by community input.',
  },
]

/** The edition currently on display at /policy-platform. */
export const currentPolicyPlatform: PolicyPlatformEdition =
  policyPlatformEditions[0]

/** Superseded editions, newest first. Empty until a newer edition is added. */
export const pastPolicyPlatforms: PolicyPlatformEdition[] =
  policyPlatformEditions.slice(1)

export function getPolicyPlatform(
  slug: string,
): PolicyPlatformEdition | undefined {
  return policyPlatformEditions.find((edition) => edition.slug === slug)
}
