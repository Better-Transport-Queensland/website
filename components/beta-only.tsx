import { IS_BETA } from '@/lib/beta'

/**
 * Renders its children only in beta builds; renders nothing in production.
 *
 * Use this to wrap UI elements (banners, buttons, sections) that should
 * appear during beta testing but never ship to production.
 *
 * @example
 * <BetaOnly>
 *   <ExperimentalWidget />
 * </BetaOnly>
 */
export function BetaOnly({ children }: { children: React.ReactNode }) {
  if (!IS_BETA) return null
  return <>{children}</>
}
