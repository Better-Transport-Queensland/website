'use client'

import { motion, type Variants } from 'framer-motion'

/**
 * Scroll-triggered entrance animations.
 *
 * Children render on the server as normal; these wrappers only add the
 * motion on the client. Animations run once, the first time an element
 * scrolls into view. Wrap the page in <MotionProvider> so visitors who
 * prefer reduced motion get a plain fade with no movement.
 */

type Direction = 'up' | 'left' | 'right' | 'none'

const EASE = [0.21, 0.47, 0.32, 0.98] as const
const DISTANCE = 32

function hiddenFor(direction: Direction, scale?: number) {
  return {
    opacity: 0,
    x: direction === 'left' ? -DISTANCE : direction === 'right' ? DISTANCE : 0,
    y: direction === 'up' ? DISTANCE : 0,
    ...(scale ? { scale } : {}),
  }
}

const shown = { opacity: 1, x: 0, y: 0, scale: 1 }

/** Fade and slide a block in when it scrolls into view. */
export function Reveal({
  children,
  className,
  direction = 'up',
  delay = 0,
  scale,
}: {
  children: React.ReactNode
  className?: string
  /** Where the content slides in from. */
  direction?: Direction
  /** Seconds to wait after entering the viewport. */
  delay?: number
  /** Optional starting scale, e.g. 0.95 for a subtle zoom-in. */
  scale?: number
}) {
  return (
    <motion.div
      className={className}
      initial={hiddenFor(direction, scale)}
      whileInView={shown}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

const groupVariants: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}

const itemVariants: Variants = {
  hidden: hiddenFor('up'),
  shown: { ...shown, transition: { duration: 0.6, ease: EASE } },
}

/** A container whose <RevealItem> children animate in one after another. */
export function RevealGroup({
  children,
  className,
  as = 'div',
}: {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'ul'
}) {
  const Component = as === 'ul' ? motion.ul : motion.div
  return (
    <Component
      className={className}
      variants={groupVariants}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.15 }}
    >
      {children}
    </Component>
  )
}

export function RevealItem({
  children,
  className,
  as = 'div',
}: {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'li'
}) {
  const Component = as === 'li' ? motion.li : motion.div
  return (
    <Component className={className} variants={itemVariants}>
      {children}
    </Component>
  )
}
