'use client'

import { Link } from '@/components/core/link'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { NavItems, isNavGroup } from '@/data/nav-links'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react'
import {
  Bars3Icon,
  ChevronDownIcon,
  XMarkIcon,
} from '@heroicons/react/16/solid'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

type MobileNavbarProps = {
  filled: true | undefined
  isOpen: boolean
  onClick: () => void
}

const iconVariants = {
  closed: { opacity: 1, rotate: 0, scale: 1 },
  open: { opacity: 0, rotate: -90, scale: 0.85 },
}

const xVariants = {
  closed: { opacity: 0, rotate: 90, scale: 0.85 },
  open: { opacity: 1, rotate: 0, scale: 1 },
}

/** Hamburger button that toggles the mobile navigation drawer. */
export function MobileNavbar({ filled, isOpen, onClick }: MobileNavbarProps) {
  const color = filled ? 'text-white' : 'text-heading'

  return (
    <motion.button
      className="relative flex size-12 items-center justify-center self-center rounded-lg hover:bg-black/5 lg:hidden dark:hover:bg-gray-50/10"
      aria-label="Toggle main menu"
      aria-expanded={isOpen}
      aria-controls="mobile-nav-drawer"
      aria-haspopup="dialog"
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
    >
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center"
        variants={iconVariants}
        initial={isOpen ? 'open' : 'closed'}
        animate={isOpen ? 'open' : 'closed'}
        transition={{ duration: 0.18, ease: 'easeOut' }}
      >
        <Bars3Icon className={`size-8 ${color}`} />
      </motion.span>

      <motion.span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center"
        variants={xVariants}
        initial={isOpen ? 'open' : 'closed'}
        animate={isOpen ? 'open' : 'closed'}
        transition={{ duration: 0.18, ease: 'easeOut' }}
      >
        <XMarkIcon className={`size-8 ${color}`} />
      </motion.span>
    </motion.button>
  )
}

/** True when href points at the page currently being viewed. */
function isActive(pathname: string, href: string) {
  if (href.startsWith('http')) return false
  return pathname === href
}

const linkClasses =
  'nav-link block rounded-lg px-3 py-2.5 text-base aria-[current=page]:bg-[var(--nav-hover-bg)] aria-[current=page]:font-semibold aria-[current=page]:text-[var(--nav-hover-text)]'

/**
 * Off-canvas mobile navigation drawer.
 *
 * Built on Headless UI's Dialog, which provides focus trapping, focus restore,
 * body scroll-lock, Escape-to-close and backdrop click-to-close out of the box.
 * Multi-link groups render as collapsible Disclosure accordions so the menu
 * stays scannable as more pages are added.
 */
export function MobileNavDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const pathname = usePathname()

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      id="mobile-nav-drawer"
      className="relative z-50 lg:hidden"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-out data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <DialogPanel
          transition
          className="absolute inset-y-0 right-0 flex w-[85%] max-w-sm flex-col rounded-l-2xl bg-[var(--surface-card-bg)] shadow-xl transition-transform duration-300 ease-out data-[closed]:translate-x-full"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-300 px-5 py-4 dark:border-gray-600">
            <span className="text-xs font-bold tracking-widest text-[var(--nav-section-text)] uppercase">
              Menu
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="nav-link flex size-10 items-center justify-center rounded-lg"
            >
              <XMarkIcon className="size-6" aria-hidden="true" />
            </button>
          </div>

          {/* Scrollable nav region */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <ul className="flex flex-col gap-1">
              {NavItems.map((item) =>
                isNavGroup(item) ? (
                  <li key={item.label}>
                    <Disclosure>
                      <DisclosureButton className="nav-link group flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-base font-semibold">
                        {item.label}
                        <ChevronDownIcon
                          className="size-5 transition-transform duration-200 group-data-[open]:rotate-180"
                          aria-hidden="true"
                        />
                      </DisclosureButton>
                      <DisclosurePanel
                        transition
                        className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-200 ease-out data-[closed]:grid-rows-[0fr]"
                      >
                        <div className="overflow-hidden">
                          <ul className="mt-1 mb-2 ml-3 flex flex-col gap-0.5 border-l border-[var(--surface-border)] pl-3">
                            {item.links.map((link) => (
                              <li key={link.href}>
                                <Link
                                  href={link.href}
                                  onClick={onClose}
                                  aria-current={
                                    isActive(pathname, link.href)
                                      ? 'page'
                                      : undefined
                                  }
                                  className={linkClasses}
                                >
                                  {link.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </DisclosurePanel>
                    </Disclosure>
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      aria-current={
                        isActive(pathname, item.href) ? 'page' : undefined
                      }
                      className={`${linkClasses} py-3 font-semibold`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-gray-300 px-5 py-4 dark:border-gray-600">
            <span className="text-sm font-medium text-[var(--nav-text)]">
              Theme
            </span>
            <ThemeSwitcher />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
