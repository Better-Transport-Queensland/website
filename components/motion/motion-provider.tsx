'use client'

import { MotionConfig } from 'framer-motion'

/**
 * Honours the visitor's "reduce motion" OS setting for every motion component
 * inside it: transforms are skipped, so content still fades in but doesn't move.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
