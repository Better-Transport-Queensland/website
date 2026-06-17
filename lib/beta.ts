import { notFound } from 'next/navigation'

/**
 * True when the site is built in beta mode.
 *
 * Set NEXT_PUBLIC_IS_BETA=true in your environment before running
 * `next build` (or `next dev`) to enable beta features.
 *
 * Because Next.js inlines NEXT_PUBLIC_* variables at build time, this value
 * is a compile-time constant — beta-only code is simply absent from
 * production bundles.
 */
export const IS_BETA = process.env.NEXT_PUBLIC_IS_BETA === 'true'

/**
 * Guard for beta-only pages. Call this at the top of a Server Component page.
 *
 * In production builds (IS_BETA = false) this triggers Next.js's notFound()
 * response, so the page is never accessible or indexed.
 *
 * @example
 * export default function MyBetaPage() {
 *   requireBeta()
 *   return <div>Beta content</div>
 * }
 */
export function requireBeta(): void {
  if (!IS_BETA) notFound()
}
