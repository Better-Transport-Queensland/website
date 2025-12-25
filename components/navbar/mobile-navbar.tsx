'use client'

import { Link } from '@/components/core/link'
import { NavLinks } from '@/data/nav-links'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/16/solid'
import { AnimatePresence, motion } from 'framer-motion'

type MobileNavbarProps = {
  filled: true | undefined
  isOpen: boolean
  onClickAction: () => void
}

const iconVariants = {
  closed: { opacity: 1, rotate: 0, scale: 1 },
  open: { opacity: 0, rotate: -90, scale: 0.85 },
}

const xVariants = {
  closed: { opacity: 0, rotate: 90, scale: 0.85 },
  open: { opacity: 1, rotate: 0, scale: 1 },
}

export function MobileNavbar({
  filled,
  isOpen,
  onClickAction,
}: MobileNavbarProps) {
  const color = !filled ? 'text-black' : ''

  return (
    <motion.button
      className="relative flex size-12 items-center justify-center self-center rounded-lg hover:bg-black/5 lg:hidden"
      aria-label="Toggle main menu"
      onClick={onClickAction}
      whileTap={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
    >
      {/* Stack both icons in the same spot; animate visibility */}
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

export function MobileNavbarMenu({
  filled,
  isOpen,
}: {
  filled: true | undefined
  isOpen: boolean
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mobile-menu"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }} // Close animation
          transition={{ duration: 0.3, ease: [0.25, 0.8, 0.5, 1] }}
          className={`overflow-hidden lg:hidden ${
            !filled ? 'text-black' : 'text-gray-200'
          }`}
        >
          <div className="relative flex flex-col py-4 text-center">
            {/* Adjusted line above the first item */}

            {NavLinks.map(({ href, label }, linkIndex) => (
              <motion.div
                key={`mobile-menu-${href}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1 }}
                transition={{
                  duration: 0.1,
                  ease: 'easeOut',
                  delay: linkIndex * (0.2 / NavLinks.length),
                }}
                className="relative"
              >
                {linkIndex == 0 && (
                  <div className="absolute inset-x-0 top-0 translate-y-1/2">
                    <div className="h-px bg-linear-to-r from-transparent via-gray-300 to-transparent" />
                  </div>
                )}
                <Link href={href} className="text-base font-medium">
                  <p className="py-3 text-xl">{label}</p> {/* Text padding */}
                </Link>
                {/* Add the fading horizontal line */}
                <div
                  className={`absolute inset-x-0 bottom-0 translate-y-1/2 ${
                    linkIndex === NavLinks.length - 1 ? 'mt-4' : ''
                  }`}
                >
                  <div className="h-px bg-linear-to-r from-transparent via-gray-300 to-transparent" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
