import * as maplibregl from 'maplibre-gl'

/**
 * maplibre-gl 6 ships its web worker as a separate file (dist/maplibre-gl-worker.mjs)
 * rather than bundling it inline, and its built-in worker-URL resolution only works
 * when the library itself is served from an http(s) URL. Under a bundler
 * `import.meta.url` is not such a URL, so resolution yields an empty string and the
 * map fails at runtime with "Worker failed to load. Check that the worker URL is
 * correct." Point the library at the bundled worker asset explicitly.
 *
 * Import this module for its side effect before constructing a maplibregl.Map.
 */
const workerUrl = new URL(
  'maplibre-gl/dist/maplibre-gl-worker.mjs',
  import.meta.url,
)

maplibregl.setWorkerUrl(workerUrl.href)
