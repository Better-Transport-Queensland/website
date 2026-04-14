'use client'

import { Link } from '@/components/core/link'
import { NavItems, isNavGroup } from '@/data/nav-links'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/16/solid'
import { AnimatePresence, motion } from 'framer-motion'

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

export function MobileNavbar({ filled, isOpen, onClick }: MobileNavbarProps) {
  const color = filled ? 'text-white' : 'text-heading'

  return (
    <motion.button
      className="relative flex size-12 items-center justify-center self-center rounded-lg hover:bg-black/5 lg:hidden dark:hover:bg-gray-50/10"
      aria-label="Toggle main menu"
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
    >
      <motion.span
        className="absolute inset-0 flex items-center justify-center"
        variants={iconVariants}
        initial={isOpen ? 'open' : 'closed'}
        animate={isOpen ? 'open' : 'closed'}
        transition={{ duration: 0.18, ease: 'easeOut' }}
      >
        <Bars3Icon className={`size-8 ${color}`} />
      </motion.span>

      <motion.span
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

// Flatten NavItems into a list of links with optional group headers
function getFlatNavItems() {
  const items:
    | { type: 'link'; href: string; label: string }[]
    | { type: 'header'; label: string }[] = []
  const flat: (
    | { type: 'link'; href: string; label: string }
    | { type: 'header'; label: string }
  )[] = []

  for (const item of NavItems) {
    if (isNavGroup(item)) {
      flat.push({ type: 'header', label: item.label })
      for (const link of item.links) {
        flat.push({ type: 'link', ...link })
      }
    } else {
      flat.push({ type: 'link', ...item })
    }
  }
  return flat
}

function Seperator({ filled }: { filled: true | undefined }) {
  return (
    <div
      className={`h-px bg-linear-to-r from-transparent via-gray-300 to-transparent ${!filled ? 'dark:via-gray-700' : ''}`}
    />
  )
}

export function MobileNavbarMenu({
  filled,
  isOpen,
}: {
  filled: true | undefined
  isOpen: boolean
}) {
  const flatItems = getFlatNavItems()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mobile-menu"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.8, 0.5, 1] }}
          className={`overflow-hidden lg:hidden ${filled ? 'text-on-brand' : 'nav-mobile-content'}`}
        >
          <div className="relative flex flex-col py-4 text-center">
            <Seperator filled={filled} />

            {flatItems.map((item, i) =>
              item.type === 'header' ? (
                <motion.div
                  key={`header-${item.label}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1 }}
                  transition={{
                    duration: 0.1,
                    ease: 'easeOut',
                    delay: i * (0.2 / flatItems.length),
                  }}
                  className="relative"
                >
                  <p
                    className={`text-s pt-4 pb-1 font-bold tracking-widest uppercase ${filled ? 'nav-section-label-filled' : 'nav-section-label'}`}
                  >
                    {item.label}
                  </p>
                  <Seperator filled={filled} />
                </motion.div>
              ) : (
                <motion.div
                  key={`mobile-menu-${item.href}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1 }}
                  transition={{
                    duration: 0.1,
                    ease: 'easeOut',
                    delay: i * (0.2 / flatItems.length),
                  }}
                  className="relative"
                >
                  <Link href={item.href} className="text-base font-medium">
                    <p className="py-3 text-xl">{item.label}</p>
                  </Link>

                  <Seperator filled={filled} />
                </motion.div>
              ),
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
