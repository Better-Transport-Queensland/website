import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypeScript from 'eslint-config-next/typescript'

/**
 * Flat config. eslint-config-next 16 ships flat configs directly, so they are
 * spread in rather than loaded through @eslint/eslintrc's FlatCompat, which
 * could not consume them (it threw "Converting circular structure to JSON").
 *
 * Run with `npm run lint` — `next lint` was removed in Next 16.
 */
const eslintConfig = [
  {
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'public/gtfs-*.json',
      'public/proposed-routes.json',
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypeScript,
]

export default eslintConfig
