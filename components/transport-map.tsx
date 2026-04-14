'use client'

import {
  LAYER_COLORS,
  LAYER_CSS_COLORS,
  LAYER_ID_MAP,
  LAYER_LABELS,
  type LayerKey,
  staticRoutes,
} from '@/data/transport-routes'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useTheme } from 'next-themes'
import { useCallback, useEffect, useRef, useState } from 'react'

const LIGHT_STYLE =
  'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
const DARK_STYLE =
  'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'

const CURRENT_LAYERS: LayerKey[] = [
  'currentRail',
  'currentBus',
  'currentFerry',
  'currentTram',
  'currentRegionalRail',
  'currentFreight',
]

const PROPOSED_LAYERS: LayerKey[] = [
  'proposedRail',
  'proposedBus',
  'proposedFerry',
  'proposedRegionalRail',
  'highSpeedRail',
]

const SPECIAL_LAYERS: LayerKey[] = ['olympicFixes', 'problemAreas']

type LayerVisibility = Record<LayerKey, boolean>

const DEFAULT_VISIBILITY: LayerVisibility = {
  currentRail: true,
  currentBus: true,
  currentFerry: true,
  currentTram: true,
  currentRegionalRail: true,
  currentFreight: true,
  proposedRail: true,
  proposedBus: true,
  proposedFerry: true,
  proposedRegionalRail: true,
  olympicFixes: true,
  problemAreas: true,
  highSpeedRail: true,
}

function modeLabel(mode: string): string {
  const labels: Record<string, string> = {
    rail: 'Suburban Rail',
    bus: 'Bus Route',
    ferry: 'Ferry',
    tram: 'Light Rail / Tram',
    'regional-rail': 'Regional Passenger Rail',
    freight: 'Freight Corridor',
    'proposed-rail': 'Proposed Rail',
    'proposed-bus': 'Proposed Busway / BRT',
    'proposed-ferry': 'Proposed Ferry',
    'proposed-regional-rail': 'Proposed Regional Rail',
    'olympic-fix': 'Olympic Fix (2032)',
    'problem-area': 'Problem Area',
    'high-speed-rail': 'High Speed Rail',
  }
  return labels[mode] ?? mode
}

function severityColor(severity?: string): string {
  switch (severity) {
    case 'critical':
      return 'bg-red-600 text-white'
    case 'high':
      return 'bg-orange-500 text-white'
    case 'medium':
      return 'bg-yellow-500 text-gray-900'
    default:
      return 'bg-gray-400 text-white'
  }
}

export function TransportMap({
  className = '',
  showExpandButton = true,
}: {
  className?: string
  showExpandButton?: boolean
}) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { resolvedTheme } = useTheme()
  const themeRef = useRef(resolvedTheme)
  themeRef.current = resolvedTheme
  const gtfsDataRef = useRef<GeoJSON.FeatureCollection | null>(null)
  const proposedDataRef = useRef<GeoJSON.FeatureCollection | null>(null)
  const appliedStyleTheme = useRef<string | undefined>(undefined)
  const [selectedFeature, setSelectedFeature] = useState<{
    name: string
    description: string
    mode: string
    severity?: string
    category?: string
  } | null>(null)
  const [layers, setLayers] = useState<LayerVisibility>(DEFAULT_VISIBILITY)
  const [isLayerPanelOpen, setIsLayerPanelOpen] = useState(true)

  const openModal = useCallback(() => {
    setIsModalOpen(true)
    dialogRef.current?.showModal()
  }, [])

  // Sync isModalOpen when dialog closes (e.g. via Escape key)
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const handleClose = () => setIsModalOpen(false)
    dialog.addEventListener('close', handleClose)
    return () => dialog.removeEventListener('close', handleClose)
  }, [])

  const addLayers = useCallback(
    (
      map: maplibregl.Map,
      gtfsData: GeoJSON.FeatureCollection,
      proposedData: GeoJSON.FeatureCollection,
    ) => {
      // --- sources ---
      map.addSource('gtfs-routes', { type: 'geojson', data: gtfsData })
      map.addSource('static-routes', { type: 'geojson', data: staticRoutes })
      map.addSource('proposed-routes', { type: 'geojson', data: proposedData })

      // GTFS layers
      map.addLayer({
        id: 'current-rail',
        type: 'line',
        source: 'gtfs-routes',
        filter: ['==', ['get', 'mode'], 'rail'],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': LAYER_COLORS.rail,
          'line-width': ['interpolate', ['linear'], ['zoom'], 6, 1, 12, 3],
          'line-opacity': 0.85,
        },
      })

      map.addLayer({
        id: 'current-bus',
        type: 'line',
        source: 'gtfs-routes',
        filter: ['==', ['get', 'mode'], 'bus'],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': LAYER_COLORS.bus,
          'line-width': ['interpolate', ['linear'], ['zoom'], 8, 0.5, 14, 2.5],
          'line-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            8,
            0.4,
            13,
            0.75,
          ],
        },
      })

      map.addLayer({
        id: 'current-ferry',
        type: 'line',
        source: 'gtfs-routes',
        filter: ['==', ['get', 'mode'], 'ferry'],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': LAYER_COLORS.ferry,
          'line-width': ['interpolate', ['linear'], ['zoom'], 8, 1, 13, 3],
          'line-opacity': 0.85,
          'line-dasharray': [2, 2],
        },
      })

      map.addLayer({
        id: 'current-tram',
        type: 'line',
        source: 'gtfs-routes',
        filter: ['==', ['get', 'mode'], 'tram'],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': LAYER_COLORS.tram,
          'line-width': ['interpolate', ['linear'], ['zoom'], 8, 1.5, 13, 3.5],
          'line-opacity': 0.85,
        },
      })

      // ===== static current layers (regional-rail, freight) =====
      map.addLayer({
        id: 'current-regional-rail',
        type: 'line',
        source: 'static-routes',
        filter: ['==', ['get', 'mode'], 'regional-rail'],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': LAYER_COLORS['regional-rail'],
          'line-width': 2.5,
          'line-opacity': 0.75,
        },
      })

      map.addLayer({
        id: 'current-freight',
        type: 'line',
        source: 'static-routes',
        filter: ['==', ['get', 'mode'], 'freight'],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': LAYER_COLORS.freight,
          'line-width': 2,
          'line-opacity': 0.6,
          'line-dasharray': [6, 3],
        },
      })

      // Proposed
      map.addLayer({
        id: 'proposed-rail',
        type: 'line',
        source: 'proposed-routes',
        filter: ['==', ['get', 'mode'], 'proposed-rail'],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': LAYER_COLORS['proposed-rail'],
          'line-width': 4,
          'line-opacity': 0.85,
          'line-dasharray': [4, 3],
        },
      })

      map.addLayer({
        id: 'proposed-bus',
        type: 'line',
        source: 'proposed-routes',
        filter: ['==', ['get', 'mode'], 'proposed-bus'],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': LAYER_COLORS['proposed-bus'],
          'line-width': 4,
          'line-opacity': 0.85,
          'line-dasharray': [4, 3],
        },
      })

      map.addLayer({
        id: 'proposed-ferry',
        type: 'line',
        source: 'proposed-routes',
        filter: ['==', ['get', 'mode'], 'proposed-ferry'],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': LAYER_COLORS['proposed-ferry'],
          'line-width': 4,
          'line-opacity': 0.85,
          'line-dasharray': [4, 3],
        },
      })

      map.addLayer({
        id: 'proposed-regional-rail',
        type: 'line',
        source: 'proposed-routes',
        filter: ['==', ['get', 'mode'], 'proposed-regional-rail'],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': LAYER_COLORS['proposed-regional-rail'],
          'line-width': 3.5,
          'line-opacity': 0.8,
          'line-dasharray': [4, 3],
        },
      })

      // HS (Just for demo really)
      map.addLayer({
        id: 'high-speed-rail',
        type: 'line',
        source: 'proposed-routes',
        filter: ['==', ['get', 'mode'], 'high-speed-rail'],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': LAYER_COLORS['high-speed-rail'],
          'line-width': 5,
          'line-opacity': 0.9,
          'line-dasharray': [6, 2, 2, 2],
        },
      })

      // Olympics
      map.addLayer({
        id: 'olympic-fix',
        type: 'line',
        source: 'proposed-routes',
        filter: ['==', ['get', 'mode'], 'olympic-fix'],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': LAYER_COLORS['olympic-fix'],
          'line-width': 4.5,
          'line-opacity': 0.9,
          'line-dasharray': [3, 2],
        },
      })

      // Problem areas
      map.addLayer({
        id: 'problem-area',
        type: 'circle',
        source: 'proposed-routes',
        filter: ['==', ['get', 'mode'], 'problem-area'],
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            6,
            5,
            12,
            10,
            16,
            14,
          ],
          'circle-color': [
            'match',
            ['get', 'severity'],
            'critical',
            '#dc2626',
            'high',
            '#f97316',
            'medium',
            '#eab308',
            '#9ca3af',
          ],
          'circle-stroke-color':
            themeRef.current === 'dark' ? '#000000' : '#ffffff',
          'circle-stroke-width': themeRef.current === 'dark' ? 2.5 : 2,
          'circle-opacity': 0.9,
        },
      })

      // Labels for Problem areas
      map.addLayer({
        id: 'problem-area-labels',
        type: 'symbol',
        source: 'proposed-routes',
        filter: ['==', ['get', 'mode'], 'problem-area'],
        layout: {
          'text-field': ['get', 'name'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 8, 9, 14, 13],
          'text-offset': [0, 1.8],
          'text-anchor': 'top',
          'text-max-width': 12,
          'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
        },
        paint: {
          'text-color': themeRef.current === 'dark' ? '#fecaca' : '#991b1b',
          'text-halo-color':
            themeRef.current === 'dark' ? '#000000' : '#ffffff',
          'text-halo-width': themeRef.current === 'dark' ? 2 : 1.5,
        },
      })

      const clickableLayers: string[] = Object.values(LAYER_ID_MAP)

      clickableLayers.forEach((layerId: string) => {
        map.on('click', layerId, (e) => {
          if (e.features && e.features.length > 0) {
            const props = e.features[0].properties
            const name =
              props?.name ?? props?.longName ?? props?.shortName ?? 'Unknown'
            const description =
              props?.description ??
              (props?.longName
                ? `Route ${props?.shortName ?? ''} — ${props.longName}`
                : '')
            setSelectedFeature({
              name,
              description,
              mode: props?.mode ?? '',
              severity: props?.severity ?? undefined,
              category: props?.category ?? undefined,
            })
          }
        })
        map.on('mouseenter', layerId, () => {
          map.getCanvas().style.cursor = 'pointer'
        })
        map.on('mouseleave', layerId, () => {
          map.getCanvas().style.cursor = ''
        })
      })

      map.on('click', 'problem-area-labels', (e) => {
        if (e.features && e.features.length > 0) {
          const props = e.features[0].properties
          setSelectedFeature({
            name: props?.name ?? 'Unknown',
            description: props?.description ?? '',
            mode: props?.mode ?? '',
            severity: props?.severity ?? undefined,
            category: props?.category ?? undefined,
          })
        }
      })
      map.on('mouseenter', 'problem-area-labels', () => {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseleave', 'problem-area-labels', () => {
        map.getCanvas().style.cursor = ''
      })

      setLoaded(true)
    },
    [],
  )

  // Init
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return

    const isDark = themeRef.current === 'dark'
    appliedStyleTheme.current = themeRef.current ?? 'light'

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: isDark ? DARK_STYLE : LIGHT_STYLE,
      center: [153.025, -27.47],
      zoom: 9,
      minZoom: 4,
      maxZoom: 16,
    })

    map.addControl(new maplibregl.NavigationControl(), 'bottom-right')

    map.on('load', async () => {
      try {
        const [gtfsRes, proposedRes] = await Promise.all([
          fetch('/gtfs-routes.json'),
          fetch('/proposed-routes.json'),
        ])
        const gtfsData = (await gtfsRes.json()) as GeoJSON.FeatureCollection
        const proposedData =
          (await proposedRes.json()) as GeoJSON.FeatureCollection
        gtfsDataRef.current = gtfsData
        proposedDataRef.current = proposedData
        addLayers(map, gtfsData, proposedData)
      } catch (err) {
        console.error('Failed to load route data:', err)
        const empty: GeoJSON.FeatureCollection = {
          type: 'FeatureCollection',
          features: [],
        }
        addLayers(map, empty, empty)
      } finally {
        setDataLoading(false)
      }
    })

    mapRef.current = map
    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [addLayers])

  // Switch basemap style when theme changes
  useEffect(() => {
    const map = mapRef.current
    if (!map || !loaded || !resolvedTheme) return
    if (appliedStyleTheme.current === resolvedTheme) return
    appliedStyleTheme.current = resolvedTheme

    const styleUrl = resolvedTheme === 'dark' ? DARK_STYLE : LIGHT_STYLE
    map.once('style.load', () => {
      if (gtfsDataRef.current && proposedDataRef.current) {
        addLayers(map, gtfsDataRef.current, proposedDataRef.current)
      }
      // Update theme-dependent paint properties
      if (map.getLayer('problem-area-labels')) {
        map.setPaintProperty(
          'problem-area-labels',
          'text-color',
          resolvedTheme === 'dark' ? '#fecaca' : '#991b1b',
        )
        map.setPaintProperty(
          'problem-area-labels',
          'text-halo-color',
          resolvedTheme === 'dark' ? '#000000' : '#ffffff',
        )
        map.setPaintProperty(
          'problem-area-labels',
          'text-halo-width',
          resolvedTheme === 'dark' ? 2 : 1.5,
        )
      }
      if (map.getLayer('problem-area')) {
        map.setPaintProperty(
          'problem-area',
          'circle-stroke-color',
          resolvedTheme === 'dark' ? '#000000' : '#ffffff',
        )
        map.setPaintProperty(
          'problem-area',
          'circle-stroke-width',
          resolvedTheme === 'dark' ? 2.5 : 2,
        )
      }
    })
    map.setStyle(styleUrl)
  }, [resolvedTheme, loaded, addLayers])

  useEffect(() => {
    if (!mapRef.current || !loaded) return
    const map = mapRef.current
    for (const [key, layerId] of Object.entries(LAYER_ID_MAP) as [
      string,
      string,
    ][]) {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(
          layerId,
          'visibility',
          layers[key as LayerKey] ? 'visible' : 'none',
        )
      }
    }

    if (map.getLayer('problem-area-labels')) {
      map.setLayoutProperty(
        'problem-area-labels',
        'visibility',
        layers.problemAreas ? 'visible' : 'none',
      )
    }
  }, [layers, loaded])

  const toggleLayer = (key: LayerKey) =>
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }))

  return (
    <>
      <div className={`relative h-full w-full overflow-hidden ${className}`}>
        <div ref={mapContainer} className="h-full w-full rounded-[inherit]" />

        {dataLoading && (
          <div className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-gray-50/90 px-6 py-3 shadow-lg backdrop-blur-sm dark:bg-gray-900/90">
            <p className="text-body text-sm font-medium">
              Loading transport routes…
            </p>
          </div>
        )}

        <div className="absolute top-4 left-4 z-10 max-h-[calc(100%-2rem)] overflow-y-auto rounded-xl bg-gray-50/95 p-4 shadow-lg backdrop-blur-sm dark:bg-gray-900/95">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h3 className="text-heading text-sm font-bold tracking-tight">
              Map Layers
            </h3>
            <button
              onClick={() => setIsLayerPanelOpen((prev) => !prev)}
              className="text-muted rounded-md p-1 transition-colors hover:bg-(--nav-hover-bg) hover:text-(--nav-hover-text)"
              aria-label={
                isLayerPanelOpen ? 'Collapse map layers' : 'Expand map layers'
              }
              title={
                isLayerPanelOpen ? 'Collapse map layers' : 'Expand map layers'
              }
              aria-expanded={isLayerPanelOpen}
            >
              {isLayerPanelOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </button>
          </div>

          {isLayerPanelOpen && (
            <>
              <p className="text-muted mb-1 text-[0.65rem] font-semibold tracking-wider uppercase">
                Current Network
              </p>
              {CURRENT_LAYERS.map((key) => (
                <label
                  key={key}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 select-none hover:bg-(--nav-hover-bg)"
                >
                  <input
                    type="checkbox"
                    checked={layers[key]}
                    onChange={() => toggleLayer(key)}
                    className="accent-indigo-600"
                  />
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${LAYER_CSS_COLORS[key]}`}
                  />
                  <span className="text-body text-sm">{LAYER_LABELS[key]}</span>
                </label>
              ))}

              <p className="text-muted mt-3 mb-1 text-[0.65rem] font-semibold tracking-wider uppercase">
                Proposed Changes
              </p>
              {PROPOSED_LAYERS.map((key) => (
                <label
                  key={key}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 select-none hover:bg-(--nav-hover-bg)"
                >
                  <input
                    type="checkbox"
                    checked={layers[key]}
                    onChange={() => toggleLayer(key)}
                    className="accent-indigo-600"
                  />
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${LAYER_CSS_COLORS[key]}`}
                  />
                  <span className="text-body text-sm">{LAYER_LABELS[key]}</span>
                </label>
              ))}

              <p className="text-muted mt-3 mb-1 text-[0.65rem] font-semibold tracking-wider uppercase">
                Analysis
              </p>
              {SPECIAL_LAYERS.map((key) => (
                <label
                  key={key}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 select-none hover:bg-(--nav-hover-bg)"
                >
                  <input
                    type="checkbox"
                    checked={layers[key]}
                    onChange={() => toggleLayer(key)}
                    className="accent-indigo-600"
                  />
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${LAYER_CSS_COLORS[key]}`}
                  />
                  <span className="text-body text-sm">{LAYER_LABELS[key]}</span>
                </label>
              ))}
            </>
          )}
        </div>

        {showExpandButton && (
          <button
            onClick={openModal}
            className="absolute top-4 right-4 z-10 rounded-lg bg-gray-50/95 p-2 shadow-lg backdrop-blur-sm transition-colors hover:bg-(--nav-hover-bg) dark:bg-gray-900/95"
            aria-label="Expand map"
            title="Expand map"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="text-body h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 3H5a2 2 0 0 0-2 2v3m16-5h-3a2 2 0 0 0-2 2v3M8 21H5a2 2 0 0 1-2-2v-3m16 5h-3a2 2 0 0 1-2-2v-3"
              />
            </svg>
          </button>
        )}

        {selectedFeature && (
          <div className="absolute right-4 bottom-4 z-10 max-w-sm rounded-xl bg-gray-50/95 p-4 shadow-lg backdrop-blur-sm dark:bg-gray-900/95">
            <div className="mb-1 flex items-start justify-between gap-2">
              <h3 className="text-heading text-sm font-bold">
                {selectedFeature.name}
              </h3>
              <button
                onClick={() => setSelectedFeature(null)}
                className="text-muted shrink-0 cursor-pointer hover:text-(--nav-hover-text)"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="mb-2 flex flex-wrap gap-1.5">
              <span className="icon-well inline-block rounded-full px-2 py-0.5 text-xs font-medium">
                {modeLabel(selectedFeature.mode)}
              </span>
              {selectedFeature.severity && (
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${severityColor(selectedFeature.severity)}`}
                >
                  {selectedFeature.severity}
                </span>
              )}
              {selectedFeature.category && (
                <span className="inline-block rounded-full bg-(--surface-card-raised-bg) px-2 py-0.5 text-xs font-medium text-(--nav-text)">
                  {selectedFeature.category}
                </span>
              )}
            </div>
            {selectedFeature.description && (
              <p className="text-body text-sm leading-relaxed">
                {selectedFeature.description}
              </p>
            )}
          </div>
        )}
      </div>

      {showExpandButton && (
        <dialog
          ref={dialogRef}
          className="map-modal fixed inset-0 m-auto h-[90vh] max-h-none w-[95vw] max-w-360 rounded-xl border-0 p-0 shadow-2xl"
        >
          <div className="bg-page flex h-full flex-col overflow-hidden rounded-xl">
            <div className="border-subtle flex shrink-0 items-center justify-between border-b px-4 py-3">
              <h2 className="text-heading text-sm font-semibold">
                Our Proposed Transport Map
              </h2>
              <button
                onClick={() => dialogRef.current?.close()}
                className="text-muted rounded-md p-1.5 transition-colors hover:bg-(--nav-hover-bg) hover:text-(--nav-hover-text)"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="min-h-0 flex-1">
              {isModalOpen && (
                <TransportMap
                  showExpandButton={false}
                  className="h-full w-full"
                />
              )}
            </div>
          </div>
        </dialog>
      )}
    </>
  )
}
