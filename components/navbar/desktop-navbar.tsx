'use client'

import { NavItems, isNavGroup } from '@/data/nav-links'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

function DropdownMenu({
  label,
  links,
  filled,
}: {
  label: string
  links: { href: string; label: string }[]
  filled: true | undefined
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex h-8 items-center gap-1 rounded-lg px-4 text-sm font-semibold whitespace-nowrap transition-all duration-200 ease-in-out ${filled ? 'nav-link-filled' : 'nav-link'}`}
      >
        {label}
        <ChevronDownIcon
          className={`size-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="nav-dropdown-panel absolute right-0 z-50 mt-2 min-w-48 overflow-hidden">
          {links.map(({ href, label: linkLabel }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="nav-dropdown-item block px-4 py-2.5 text-sm font-medium transition-colors"
            >
              {linkLabel}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export function DesktopNavbar({ filled }: { filled: true | undefined }) {
  return (
    <nav className="relative my-auto hidden items-center gap-1 lg:flex">
      {NavItems.map((item) =>
        isNavGroup(item) ? (
          <DropdownMenu
            key={item.label}
            label={item.label}
            links={item.links}
            filled={filled}
          />
        ) : (
          <Link
            href={item.href}
            className={`flex h-8 items-center rounded-lg px-4 text-sm font-semibold whitespace-nowrap transition-all duration-200 ease-in-out ${filled ? 'nav-link-filled' : 'nav-link'}`}
            key={item.href}
          >
            {item.label}
          </Link>
        ),
      )}
    </nav>
  )
}
