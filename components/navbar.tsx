'use client'

import { Link } from '@/components/link'
import { Logo } from '@/components/logo'
import { Disclosure } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/16/solid'
import { Bars3Icon } from '@heroicons/react/24/solid'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

const links = [
  { href: 'https://forum.bettertransportqueensland.org', label: 'Forum' },
  { href: '/member', label: 'Membership' },
  { href: '/releases', label: 'Media Releases' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

function DesktopNav({ filled }: { filled: true | undefined }) {
  return (
    <nav className="relative my-auto hidden lg:flex">
      {links.map(({ href, label }) => (
        <Link
          href={href}
          className={`flex h-[2rem] items-center px-4 text-base font-medium whitespace-nowrap transition duration-200 ease-in-out ${filled ? 'bg-indigo-500 text-white data-[hover]:bg-indigo-600' : 'bg-indigo-300/35 text-black data-[hover]:bg-indigo-500/35'} mr-1 rounded-xl`}
          key={href}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}

function MobileNavButton({
  filled,
  onClick,
}: {
  filled: true | undefined
  onClick: () => void
}) {
  return (
    <motion.button
      className="flex size-12 items-center justify-center self-center rounded-lg data-[hover]:bg-black/5 lg:hidden"
      aria-label="Toggle main menu"
      onClick={onClick}
      whileTap={{ scale: 0.9 }} // Bounce effect: grows larger
      animate={{ scale: 1 }} // Returns to normal size
      transition={{
        type: 'spring', // Natural bounce effect
        stiffness: 500,
        damping: 20,
      }}
    >
      {/* Hamburger icon */}
      <Bars3Icon className={`size-8 ${!filled ? 'text-black' : ''}`} />
    </motion.button>
  )
}

function MobileNav({
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
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }} // Close animation
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={`overflow-hidden lg:hidden ${
            !filled ? 'text-black' : 'text-gray-200'
          }`}
        >
          <div className="relative flex flex-col py-4 text-center">
            {/* Adjusted line above the first item */}

            {links.map(({ href, label }, linkIndex) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1 }}
                transition={{
                  duration: 0.2,
                  ease: 'easeInOut',
                  delay: linkIndex * (0.3 / links.length),
                }}
                key={href}
                className="relative"
              >
                {linkIndex == 0 && (
                  <div className="absolute inset-x-0 top-0 translate-y-1/2">
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  </div>
                )}
                <Link href={href} className="text-base font-medium">
                  <p className="py-3 text-xl">{label}</p> {/* Text padding */}
                </Link>
                {/* Add the fading horizontal line */}
                <div
                  className={`absolute inset-x-0 bottom-0 translate-y-1/2 ${
                    linkIndex === links.length - 1 ? 'mt-4' : ''
                  }`}
                >
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Navbar({
  banner,
  filled,
}: {
  banner?: { text: string; href: string; expiry?: Date }
  filled?: true
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Disclosure as="header" className="mt-2 py-8 sm:py-12 dark:text-white">
      <header className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center py-3">
            <Link href="/" title="Home">
              <Logo className="h-9 text-white" filled={filled} />
            </Link>
          </div>
          {banner &&
            (banner.expiry ? Date.now() < banner.expiry.getTime() : true) && (
              <Link
                href={banner.href}
                className="lg:text-md flex items-center gap-1 rounded-2xl bg-indigo-500 py-0.5 pr-3 pl-4 text-xs/5 font-medium text-white transition duration-200 ease-out data-[hover]:bg-indigo-600 md:text-sm/6"
              >
                {banner.text}
                <ChevronRightIcon className="size-4" />
              </Link>
            )}
        </div>
        <DesktopNav filled={filled} />
        <MobileNavButton
          filled={filled}
          onClick={() => setIsOpen((prev: boolean) => !prev)}
        />
      </header>
      <MobileNav filled={filled} isOpen={isOpen} />
    </Disclosure>
  )
}
