type NavLink = {
  href: string
  label: string
}

type NavGroup = {
  label: string
  links: NavLink[]
}

export type NavItem = NavLink | NavGroup

export function isNavGroup(item: NavItem): item is NavGroup {
  return 'links' in item
}

export const NavItems: NavItem[] = [
  { href: 'https://forum.bettertransportqueensland.org', label: 'Forum' },
  {
    label: 'About',
    links: [
      { href: '/member', label: 'Membership' },
      { href: '/policy-platform', label: 'Policy Platform' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    label: 'Explore',
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