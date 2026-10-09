/**
 * Next only loads `instrumentation.ts`, so anything that must run at startup
 * has to be invoked from here.
 *
 * GTFS static data is not fetched on startup. Regenerate it on demand with
 * `npm run fetch-gtfs` (scripts/fetch-gtfs.mjs).
 */
export async function register() {
  // Edge runtime has no filesystem and no long-lived process to warm.
  if (process.env.NEXT_RUNTIME !== 'nodejs') return
  if (process.env.DISCOURSE_PREFETCH_ON_START === 'false') return

  // Deliberately not awaited: warming the Discourse cache must never block
  // boot. The first visitor after a deploy then hits a warm cache instead of
  // paying full forum latency.
  void import('./lib/discourse/topics.server')
    .then((topics) => topics.prefetchAll({ concurrency: 4 }))
    .then(() => console.log('[discourse] cache prefetched'))
    .catch((error) =>
      console.warn('[discourse] startup prefetch failed:', error),
    )
}
