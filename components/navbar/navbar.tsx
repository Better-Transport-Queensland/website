'use client'

import { Link } from '@/components/core/link'
import { Logo } from '@/components/core/logo'
import { DesktopNavbar } from '@/components/navbar/desktop-navbar'
import {
  MobileNavbar,
  MobileNavbarMenu,
} from '@/components/navbar/mobile-navbar'
import { NextEvent } from '@/data/upcoming-event'
import { Disclosure } from '@headlessui/react'
import dynamic from 'next/dynamic'
import { useState } from 'react'

const Banner = dynamic(
  () => import('@/components/navbar/banner').then((mod) => mod.Banner),
  { ssr: true },
)

type NavbarProps = {
  filled?: true
}

export function Navbar({ filled }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Disclosure as="header" className="mt-2 py-8 sm:py-12 dark:text-white">
      <header className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="flex shrink-0 items-center py-3 md:shrink">
            <Link href="/" title="Home">
              <Logo className="h-9 text-white" filled={filled} />
            </Link>
          </div>
          {NextEvent && (
            <span className="hidden min-w-48 shrink-8 sm:inline lg:hidden xl:inline">
              <Banner
                filled={filled}
                text={NextEvent.bannerText}
                expiry={NextEvent.date}
                href={NextEvent.href}
              />
            </span>
          )}
        </div>
        <DesktopNavbar filled={filled} />
        <MobileNavbar
          filled={filled}
          isOpen={isOpen}
          onClickAction={() => setIsOpen((prev: boolean) => !prev)}
        />
      </header>
      <MobileNavbarMenu filled={filled} isOpen={isOpen} />
    </Disclosure>
  )
}
