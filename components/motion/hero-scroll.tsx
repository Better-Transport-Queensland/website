'use client'

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useRef } from 'react'

/**
 * Hero content that eases upward and fades slightly as the visitor starts
 * scrolling, plus a "scroll" cue that disappears once they do.
 */
export function HeroScroll({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 120])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.15])
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0])

  return (
    <div ref={ref} className="relative">
      <motion.div style={{ y, opacity }}>{children}</motion.div>

      <motion.div
        aria-hidden
        style={{ opacity: cueOpacity }}
        className="pointer-events-none absolute inset-x-0 bottom-8 hidden flex-col items-center gap-1 text-indigo-200/80 sm:flex md:bottom-12"
      >
        <span className="text-xs font-semibold tracking-widest uppercase">
          Scroll to explore
        </span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.span>
      </motion.div>
    </div>
  )
}
