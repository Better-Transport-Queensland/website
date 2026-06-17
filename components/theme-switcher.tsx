'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const SUN_PATH =
  'M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z'
const MOON_PATH =
  'M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z'

export function ThemeSwitcher({ filled }: { filled?: true }) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <button
        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500"
        aria-label="Toggle theme"
      >
        <span className="h-5 w-5" />
      </button>
    )
  }

  const isDark = resolvedTheme === 'dark'

  const cycleTheme = () => {
    if (theme === 'system') {
      setTheme(isDark ? 'light' : 'dark')
    } else if (theme === 'dark') {
      setTheme('light')
    } else {
      setTheme('dark')
    }
  }

  return (
    <button
      onClick={cycleTheme}
      className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${filled ? 'nav-link-filled' : 'nav-link'}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      <span className="relative h-5 w-5">
        <AnimatePresence initial={false}>
          <motion.svg
            key={isDark ? 'sun' : 'moon'}
            className="absolute inset-0 h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={isDark ? SUN_PATH : MOON_PATH}
            />
          </motion.svg>
        </AnimatePresence>
      </span>
    </button>
  )
}
