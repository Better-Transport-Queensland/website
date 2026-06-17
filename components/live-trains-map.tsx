'use client'

import type { TrainPosition } from '@/app/api/train-positions/route'
import { Card } from '@/components/core/card'
import type { TranslinkAlert } from '@/helpers/translinkAlertsHelper'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useCallback, useEffect, useRef, useState } from 'react'

const SEQ_CENTER: [number, number] = [153.025, -27.47]
const POLL_INTERVAL_MS = 25000

const LINE_ENDPOINT_COLOURS: Record<string, string> = {
  IP: '#6D1EC5', // Ipswich – Purple
  RW: '#6D1EC5', // Rosewood – Purple
  CA: '#007339', // Caboolture – Green
  NA: '#007339', // Nambour – Green
  GY: '#007339', // Gympie North – Green
  BN: '#CE0F0F', // Beenleigh – Red
  VL: '#CE0F0F', // Varsity Lakes (Gold Coast) – Red
  CL: '#FFB81C', // Cleveland – Yellow
  SH: '#FFB81C', // Shorncliffe – Yellow
  FG: '#C49A11', // Ferny Grove – Gold
  DB: '#0072C6', // Doomben – Blue
  BD: '#FF6900', // Airport – Orange
  RP: '#00A5A5', // Redcliffe Peninsula – Teal
  SP: '#D60071', // Springfield – Pink
}

const DEST_NAMES: Record<string, string> = {
  IP: 'Ipswich',
  RW: 'Rosewood',
  BR: 'Brisbane City',
  CA: 'Caboolture',
  BN: 'Beenleigh',
  FG: 'Ferny Grove',
  CL: 'Cleveland',
  SH: 'Shorncliffe',
  RP: 'Redcliffe Peninsula',
  SP: 'Springfield Central',
  NA: 'Nambour',
  GY: 'Gympie North',
  BD: 'Airport',
  DB: 'Doomben',
  VL: 'Varsity Lakes',
}

function getLineColor(routeId: string | null, inService = true): string {
  if (!inService) return '#9ca3af' // grey for light-engine / not-in-service
  if (!routeId) return '#7c3aed'
  const dest = routeId.substring(2, 4)
  const origin = routeId.substring(0, 2)
  // Prefer the non-Brisbane endpoint as the line-defining terminus
  const endpoint = dest !== 'BR' ? dest : origin
  return LINE_ENDPOINT_COLOURS[endpoint] ?? '#7c3aed'
}

function getDestination(routeId: string | null): string | null {
  if (!routeId) return null
  const dest = routeId.substring(2, 4)
  return DEST_NAMES[dest] ?? null
}

const SEVERITY_DOT: Record<string, string> = {
  major: 'bg-red-500',
  minor: 'bg-amber-400',
  info: 'bg-blue-400',
}

const SEVERITY_LABEL: Record<string, string> = {
  major: 'Major',
  minor: 'Minor',
  info: 'Info',
}

const SEVERITY_BADGE: Record<string, string> = {
  major: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  minor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
}

const MODE_BADGE: Record<string, string> = {
  train:
    'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  bus: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  ferry: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
  tram: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
}

const MODE_ICONS: Record<string, string> = {
  train: '🚆',
  bus: '🚌',
  ferry: '⛴️',
  tram: '🚊',
}

function buildTrainGeoJSON(
  positions: TrainPosition[],
): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: positions.map((p) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
      properties: {
        id: p.id,
        label: p.label ?? p.id,
        bearing: p.bearing,
        routeId: p.routeId,
        speed: p.speed,
        lineColor: getLineColor(p.routeId, p.inService),
        destination: getDestination(p.routeId),
        inService: p.inService,
        currentStatus: p.currentStatus,
        currentStopName: p.currentStopName ?? p.currentStopId,
        nextStopName: p.nextStopName ?? p.nextStopId,
        nextArrivalTs: p.nextArrivalTs,
        delaySeconds: p.delaySeconds,
      },
    })),
  }
}

export function LiveTrainsMap({
  initialAlerts,
}: {
  initialAlerts: TranslinkAlert[]
}) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const popupRef = useRef<maplibregl.Popup | null>(null)
  const [trainCount, setTrainCount] = useState(0)
  const [outOfServiceCount, setOutOfServiceCount] = useState(0)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [error, setError] = useState(false)

  const loadTrains = useCallback(async (map: maplibregl.Map) => {
    try {
      const res = await fetch('/api/train-positions')
      if (!res.ok) throw new Error('fetch failed')
      const positions: TrainPosition[] = await res.json()
      const geojson = buildTrainGeoJSON(positions)

      const src = map.getSource('trains') as
        | maplibregl.GeoJSONSource
        | undefined
      if (src) {
        src.setData(geojson)
      } else {
        // On first load, add rail-line geometries under the train dots
        try {
          const routesRes = await fetch('/gtfs-routes.json')
          const routesData =
            (await routesRes.json()) as GeoJSON.FeatureCollection
          const railFeatures = routesData.features
            .filter((f) => f.properties?.mode === 'rail')
            .map((f) => ({
              ...f,
              properties: {
                ...f.properties,
                lineColor: getLineColor(f.properties?.routeId ?? null),
              },
            }))
          map.addSource('rail-lines', {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: railFeatures },
          })
          map.addLayer({
            id: 'rail-lines-layer',
            type: 'line',
            source: 'rail-lines',
            paint: {
              'line-color': ['get', 'lineColor'],
              'line-width': [
                'interpolate',
                ['linear'],
                ['zoom'],
                8,
                1.5,
                14,
                4,
              ],
              'line-opacity': 0.55,
            },
          })
        } catch {}

        try {
          const stopsRes = await fetch('/gtfs-rail-stops.json')
          const stopsData = (await stopsRes.json()) as GeoJSON.FeatureCollection
          map.addSource('rail-stops', { type: 'geojson', data: stopsData })
          map.addLayer({
            id: 'rail-station-dots',
            type: 'circle',
            source: 'rail-stops',
            minzoom: 9,
            paint: {
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                9,
                2.5,
                13,
                5,
              ],
              'circle-color': '#ffffff',
              'circle-stroke-width': [
                'interpolate',
                ['linear'],
                ['zoom'],
                9,
                1,
                13,
                2,
              ],
              'circle-stroke-color': '#555555',
              'circle-opacity': 0.85,
            },
          })
          map.addLayer({
            id: 'rail-station-labels',
            type: 'symbol',
            source: 'rail-stops',
            minzoom: 12,
            layout: {
              'text-field': ['get', 'name'],
              'text-size': 11,
              'text-offset': [0, 1.2],
              'text-anchor': 'top',
            },
            paint: {
              'text-color': '#cccccc',
              'text-halo-color': '#000000',
              'text-halo-width': 1.2,
            },
          })

          // Show station name popup on click (only when not clicking a train)
          map.on('click', 'rail-station-dots', (e) => {
            const feature = e.features?.[0]
            if (!feature) return
            const name = String(feature.properties?.name ?? '')
            const coords = (feature.geometry as GeoJSON.Point).coordinates as [
              number,
              number,
            ]
            popupRef.current?.remove()
            popupRef.current = new maplibregl.Popup({
              closeButton: false,
              maxWidth: '200px',
              offset: 8,
            })
              .setLngLat(coords)
              .setHTML(
                `<div style="font-family:sans-serif;font-size:13px;font-weight:600;color:#f1f5f9;padding:2px 4px">${name}</div>`,
              )
              .addTo(map)
          })
          map.on('mouseenter', 'rail-station-dots', () => {
            map.getCanvas().style.cursor = 'pointer'
          })
          map.on('mouseleave', 'rail-station-dots', () => {
            map.getCanvas().style.cursor = ''
          })
        } catch {
          // station dots are decorative – don't block train display
        }

        map.addSource('trains', { type: 'geojson', data: geojson })
        map.addLayer({
          id: 'train-dots',
          type: 'circle',
          source: 'trains',
          paint: {
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              8,
              5,
              14,
              10,
            ],
            'circle-color': ['get', 'lineColor'],
            'circle-color-transition': { duration: 400 },
            'circle-stroke-width': 2,
            'circle-stroke-color': [
              'case',
              ['boolean', ['get', 'inService'], true],
              '#fff',
              '#6b7280',
            ],
            'circle-opacity': [
              'case',
              ['boolean', ['get', 'inService'], true],
              0.92,
              0.55,
            ],
          },
        })
        map.addLayer({
          id: 'train-labels',
          type: 'symbol',
          source: 'trains',
          minzoom: 11,
          layout: {
            'text-field': ['get', 'label'],
            'text-size': 10,
            'text-offset': [0, 1.4],
            'text-anchor': 'top',
          },
          paint: {
            'text-color': '#4c1d95',
            'text-halo-color': '#fff',
            'text-halo-width': 1.5,
          },
        })

        map.on('click', 'train-dots', (e) => {
          const feature = e.features?.[0]
          if (!feature) return
          const props = feature.properties as Record<string, unknown>
          const label = String(props.label ?? props.id ?? '')
          const routeId = props.routeId ? String(props.routeId) : null
          const lineColor = String(props.lineColor ?? '#7c3aed')
          const inSvc = props.inService === true || props.inService === 'true'
          const coords = (feature.geometry as GeoJSON.Point).coordinates as [
            number,
            number,
          ]

          // MapLibre serialises null properties as the string "null"
          const s = (v: unknown) => (v && v !== 'null' ? String(v) : null)
          const n = (v: unknown): number | null =>
            v != null && v !== 'null' && !isNaN(Number(v)) ? Number(v) : null

          const speedRaw = n(props.speed)
          const currentStatus = s(props.currentStatus)
          const currentStopName = s(props.currentStopName)
          const nextStopName = s(props.nextStopName)
          const nextArrivalTs = n(props.nextArrivalTs)
          const delaySeconds = n(props.delaySeconds)

          const orig = routeId?.substring(0, 2) ?? null
          const dest = routeId?.substring(2, 4) ?? null
          const origName = orig ? (DEST_NAMES[orig] ?? null) : null
          const destName = dest ? (DEST_NAMES[dest] ?? null) : null
          const lineName =
            (dest !== 'BR' ? destName : origName) ??
            destName ??
            origName ??
            null
          const route =
            origName && destName ? `${origName} - ${destName}` : null

          const fmtTime = (ts: number) =>
            new Date(ts * 1000).toLocaleTimeString('en-AU', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
              timeZone: 'Australia/Brisbane',
            })

          // Split "Station name, platform N" → [station, "Platform N"] or [station, null]
          const splitStop = (name: string | null) => {
            if (!name) return { station: null, platform: null }
            const idx = name.toLowerCase().indexOf(', platform ')
            if (idx === -1) return { station: name, platform: null }
            return {
              station: name.slice(0, idx),
              platform: 'Platform ' + name.slice(idx + ', platform '.length),
            }
          }

          // Status line
          let statusHtml = ''
          if (inSvc) {
            if (currentStatus === 'STOPPED_AT' && currentStopName) {
              const { station, platform } = splitStop(currentStopName)
              const platformLine = platform
                ? `<div style="font-size:12px;color:#64748b;margin-top:1px;padding-left:16px">${platform}</div>`
                : ''
              statusHtml = `<div style="font-size:12px;color:#cbd5e1;margin-top:5px;padding-left:16px">
                <span style="color:#f87171;font-weight:600">⏹</span> Stopped at <strong style="color:#f1f5f9">${station}</strong>
              </div>${platformLine}`
            } else if (currentStatus === 'INCOMING_AT' && nextStopName) {
              const { station, platform } = splitStop(nextStopName)
              const eta = nextArrivalTs ? `est. ${fmtTime(nextArrivalTs)}` : ''
              const sub = [platform, eta].filter(Boolean).join(', ')
              const subLine = sub
                ? `<div style="font-size:12px;color:#64748b;margin-top:1px;padding-left:16px">${sub}</div>`
                : ''
              statusHtml = `<div style="font-size:12px;color:#cbd5e1;margin-top:5px;padding-left:16px">
                Approaching <strong style="color:#f1f5f9">${station}</strong>
              </div>${subLine}`
            } else if (nextStopName) {
              const { station, platform } = splitStop(nextStopName)
              const eta = nextArrivalTs ? `est. ${fmtTime(nextArrivalTs)}` : ''
              const sub = [platform, eta].filter(Boolean).join(', ')
              const subLine = sub
                ? `<div style="font-size:12px;color:#64748b;margin-top:1px;padding-left:16px">${sub}</div>`
                : ''
              statusHtml = `<div style="font-size:12px;color:#cbd5e1;margin-top:5px;padding-left:16px">
                Next: <strong style="color:#f1f5f9">${station}</strong>
              </div>${subLine}`
            }
          }

          // Delay line
          let delayHtml = ''
          if (inSvc && delaySeconds !== null) {
            const mins = Math.round(Math.abs(delaySeconds) / 60)
            if (delaySeconds > 90) {
              delayHtml = `<div style="font-size:11px;color:#f87171;margin-top:2px;padding-left:16px">+${mins} min late</div>`
            } else if (delaySeconds < -90) {
              delayHtml = `<div style="font-size:11px;color:#4ade80;margin-top:2px;padding-left:16px">${mins} min early</div>`
            } else {
              delayHtml = `<div style="font-size:11px;color:#4ade80;margin-top:2px;padding-left:16px">On time</div>`
            }
          }

          const dotStyle = `display:inline-block;width:10px;height:10px;border-radius:50%;background:${lineColor};margin-right:6px;vertical-align:middle;border:1.5px solid rgba(255,255,255,0.25);flex-shrink:0;`
          popupRef.current?.remove()
          popupRef.current = new maplibregl.Popup({
            closeButton: true,
            maxWidth: '280px',
          })
            .setLngLat(coords)
            .setHTML(
              `<div style="font-family:sans-serif;padding:3px 0">
                 ${
                   inSvc && lineName
                     ? `<div style="display:flex;align-items:center;font-size:14px;font-weight:700;color:#f1f5f9"><span style="${dotStyle}"></span>${lineName}</div>
                        ${route ? `<div style="font-size:11px;color:#94a3b8;margin-top:2px;padding-left:16px">${route}</div>` : ''}`
                     : `<div style="display:flex;align-items:center;font-size:13px;font-weight:600;color:#64748b"><span style="${dotStyle}"></span>Light engine / not in service</div>`
                 }
                 ${statusHtml}
                 ${delayHtml}
                 <div style="font-size:10px;color:#475569;margin-top:5px;padding-left:16px;border-top:1px solid #334155;padding-top:4px">Train ${label}${speedRaw !== null && speedRaw > 0 ? ` · ${speedRaw} km/h` : ''}</div>
               </div>`,
            )
            .addTo(map)
        })

        map.on('mouseenter', 'train-dots', () => {
          map.getCanvas().style.cursor = 'pointer'
        })
        map.on('mouseleave', 'train-dots', () => {
          map.getCanvas().style.cursor = ''
        })
      }

      setTrainCount(positions.length)
      setOutOfServiceCount(positions.filter((p) => !p.inService).length)
      setLastUpdated(new Date())
      setError(false)
    } catch {
      setError(true)
    }
  }, [])

  useEffect(() => {
    if (!mapContainer.current) return

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: SEQ_CENTER,
      zoom: 10,
    })
    mapRef.current = map

    map.addControl(new maplibregl.NavigationControl(), 'top-right')
    map.on('load', () => loadTrains(map))

    const interval = setInterval(() => {
      if (mapRef.current) loadTrains(mapRef.current)
    }, POLL_INTERVAL_MS)

    return () => {
      clearInterval(interval)
      popupRef.current?.remove()
      map.remove()
    }
  }, [loadTrains])

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Map */}
      <div className="relative flex-1 overflow-hidden rounded-xl ring-1 ring-gray-200 dark:ring-gray-800">
        <div ref={mapContainer} className="h-[60vh] w-full lg:h-[75vh]" />
        {/* Status bar */}
        <div className="absolute right-0 bottom-0 left-0 flex items-center justify-between bg-black/60 px-3 py-1.5 text-xs text-white/80 backdrop-blur-sm">
          <span>
            {error ? (
              <span className="text-red-300">
                Unable to load live positions
              </span>
            ) : (
              <>
                <span className="mr-1.5 inline-block size-2 rounded-full bg-gray-50/70 align-middle" />
                {trainCount - outOfServiceCount} in service
                {outOfServiceCount > 0 && (
                  <span className="ml-1 text-white/40">
                    · {outOfServiceCount} light engine
                  </span>
                )}
              </>
            )}
          </span>
          {lastUpdated && (
            <span className="text-white/50">
              Updated{' '}
              {lastUpdated.toLocaleTimeString('en-AU', {
                timeStyle: 'short',
                timeZone: 'Australia/Brisbane',
              })}
            </span>
          )}
        </div>
      </div>

      {/* Alert sidebar */}
      <div className="flex w-full flex-col gap-3 lg:max-h-[75vh] lg:w-80 lg:overflow-y-auto">
        <h2 className="text-heading text-sm font-semibold">Recent alerts</h2>
        {initialAlerts.length === 0 ? (
          <p className="text-muted text-sm">No alerts in the last 3 days.</p>
        ) : (
          initialAlerts.map((alert) => (
            <Card
              key={alert.id}
              link={alert.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl p-3"
            >
              <div className="mb-1 flex flex-wrap items-center gap-1.5">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${SEVERITY_BADGE[alert.severity]}`}
                >
                  {SEVERITY_LABEL[alert.severity]}
                </span>
                {alert.mode && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${MODE_BADGE[alert.mode] ?? 'bg-gray-100 text-gray-600'}`}
                  >
                    {MODE_ICONS[alert.mode]} {alert.mode}
                  </span>
                )}
                {alert.area && alert.area !== 'SEQ' && (
                  <span className="rounded-full bg-(--surface-card-raised-bg) px-2 py-0.5 text-[10px] font-semibold text-(--text-muted)">
                    {alert.area}
                  </span>
                )}
              </div>
              <p className="text-heading text-xs font-medium group-hover:underline">
                {alert.title}
              </p>
              {alert.services && (
                <p className="text-muted mt-0.5 truncate text-[10px]">
                  {alert.services}
                </p>
              )}
              {alert.startDate && (
                <p className="text-muted mt-1 text-[10px]">
                  From {alert.startDate}
                  {alert.endDate && ` → ${alert.endDate}`}
                </p>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
