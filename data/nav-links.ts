import { IS_BETA } from '@/lib/beta'

type NavLink = {
  href: string
  label: string
  /** When true, this link is excluded from production builds. */
  beta?: true
}

type NavGroup = {
  label: string
  links: NavLink[]
  /** When true, the entire group is excluded from production builds. */
  beta?: true
}

export type NavItem = NavLink | NavGroup

export function isNavGroup(item: NavItem): item is NavGroup {
  return 'links' in item
}

const allNavItems: NavItem[] = [
  { href: 'https://forum.bettertransportqueensland.org', label: 'Forum' },
  { href: '/member', label: 'Membership' },
  { href: '/policy-platform', label: 'Policy Platform' },
  { href: '/contact', label: 'Contact' },
  {
    label: 'Explore',
    beta: true,
    links: [
      { href: '/why-public-transport', label: 'Why Public Transport?' },
      { href: '/history', label: 'QLD Transport History' },
      { href: '/fleet', label: 'Rolling Stock & Fleet' },
      { href: '/accessibility', label: 'Accessibility Tracker' },
      { href: '/map', label: 'Transport Map' },
    ],
  },
  {
    label: 'Services',
    beta: true,
    links: [
      { href: '/live-trains', label: 'Live Train Positions' },
      { href: '/service-alerts', label: 'Service Alerts' },
    ],
  },
  {
    label: 'News',
    links: [
      { href: '/releases', label: 'Media Releases' },
      { href: '/blog', label: 'Blog' },
    ],
  },
]

/**
 * Strips beta-flagged items (and beta-flagged links within groups) when not
 * running in beta mode. Empty groups are also removed.
 */
function filterBetaItems(items: NavItem[]): NavItem[] {
  if (IS_BETA) return items

  const filtered = items
    .filter((item) => !item.beta)
    .map((item) => {
      if (!isNavGroup(item)) return item
      return { ...item, links: item.links.filter((link) => !link.beta) }
    })
    .filter((item) => !isNavGroup(item) || item.links.length > 0)

  return filtered
}

export const NavItems: NavItem[] = filterBetaItems(allNavItems)
