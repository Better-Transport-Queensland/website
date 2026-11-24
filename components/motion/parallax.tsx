'use client'

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { useRef } from 'react'

/**
 * Drifts its children vertically as the element passes through the viewport,
 * so layers move at slightly different speeds while scrolling.
 *
 * `distance` is the total travel in pixels: the element starts `distance / 2`
 * below its resting position as it enters the bottom of the screen and ends
 * `distance / 2` above it as it leaves the top. Negative values reverse it.
 * Disabled for visitors who prefer reduced motion.
 */
export function Parallax({
  children,
  className,
  distance = 60,
}: {
  children: React.ReactNode
  className?: string
  distance?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const half = reduceMotion ? 0 : distance / 2
  const y = useTransform(scrollYProgress, [0, 1], [half, -half])

  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  )
}
