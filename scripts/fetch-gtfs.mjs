/**
 * Fetch TransLink SEQ GTFS data and save processed routes as a static JSON file.
**/

import AdmZip from 'adm-zip'
import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const GTFS_URL = 'https://gtfsrt.api.translink.com.au/GTFS/SEQ_GTFS.zip'
const OUTPUT_PATH = resolve(__dirname, '..', 'public', 'gtfs-routes.json')

const SIMPLIFY_TOLERANCE = 0.0002

function parseCSVRow(line) {
  const fields = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') { current += '"'; i++ }
      else if (ch === '"') inQuotes = false
      else current += ch
    } else {
      if (ch === '"') inQuotes = true
      else if (ch === ',') { fields.push(current.trim()); current = '' }
      else current += ch
    }
  }
  fields.push(current.trim())
  return fields
}

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0)
  if (lines.length < 2) return []
  const headers = parseCSVRow(lines[0])
  return lines.slice(1).map((line) => {
    const values = parseCSVRow(line)
    const row = {}
    for (let j = 0; j < headers.length; j++) row[headers[j]] = values[j] ?? ''
    return row
  })
}

function perpDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay
  if (dx === 0 && dy === 0) return Math.hypot(px - ax, py - ay)
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)))
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy))
}

function simplify(coords, tol) {
  if (coords.length <= 2) return coords
  let maxD = 0, maxI = 0
  const [ax, ay] = coords[0], [bx, by] = coords[coords.length - 1]
  for (let i = 1; i < coords.length - 1; i++) {
    const d = perpDist(coords[i][0], coords[i][1], ax, ay, bx, by)
    if (d > maxD) { maxD = d; maxI = i }
  }
  if (maxD > tol) {
    const left = simplify(coords.slice(0, maxI + 1), tol)
    const right = simplify(coords.slice(maxI), tol)
    return [...left.slice(0, -1), ...right]
  }
  return [coords[0], coords[coords.length - 1]]
}

function routeTypeToMode(rt) {
  switch (rt) {
    case '0': return 'tram'
    case '2': return 'rail'
    case '3': return 'bus'
    case '4': return 'ferry'
    default:  return 'bus'
  }
}

async function main() {
  console.log('[GTFS] Downloading from TransLink…')
  const t0 = Date.now()

  const res = await fetch(GTFS_URL)
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)

  const buf = Buffer.from(await res.arrayBuffer())
  console.log(`[GTFS] Downloaded ${(buf.length / 1024 / 1024).toFixed(1)} MB in ${Date.now() - t0}ms`)

  const zip = new AdmZip(buf)

  const routesEntry = zip.getEntry('routes.txt')
  const tripsEntry  = zip.getEntry('trips.txt')
  const shapesEntry = zip.getEntry('shapes.txt')
  if (!routesEntry || !tripsEntry || !shapesEntry) {
    throw new Error('GTFS zip missing routes.txt, trips.txt, or shapes.txt')
  }

  // --- routes ---
  console.log('[GTFS] Parsing routes…')
  const routeRows = parseCSV(routesEntry.getData().toString('utf-8'))
  const routeMap = new Map()
  for (const r of routeRows) {
    routeMap.set(r.route_id, {
      shortName: r.route_short_name ?? '',
      longName:  r.route_long_name  ?? '',
      type:      r.route_type       ?? '3',
    })
  }
  console.log(`[GTFS]   ${routeMap.size} routes`)

  console.log('[GTFS] Parsing trips…')
  const tripRows = parseCSV(tripsEntry.getData().toString('utf-8'))
  const routeShapes = new Map()   // route_id → Map<shape_id, count>
  for (const t of tripRows) {
    if (!t.route_id || !t.shape_id) continue
    if (!routeShapes.has(t.route_id)) routeShapes.set(t.route_id, new Map())
    const m = routeShapes.get(t.route_id)
    m.set(t.shape_id, (m.get(t.shape_id) ?? 0) + 1)
  }

  const routeToShape = new Map()
  const neededShapes = new Set()
  for (const [rid, shapeMap] of routeShapes) {
    let bestId = '', bestN = 0
    for (const [sid, n] of shapeMap) { if (n > bestN) { bestN = n; bestId = sid } }
    if (bestId) { routeToShape.set(rid, bestId); neededShapes.add(bestId) }
  }
  console.log(`[GTFS]   Need ${neededShapes.size} unique shapes`)

  console.log('[GTFS] Parsing shapes…')
  const shapesText = shapesEntry.getData().toString('utf-8')
  const shapeLines = shapesText.split(/\r?\n/)
  const hdr = parseCSVRow(shapeLines[0])
  const iId = hdr.indexOf('shape_id')
  const iLat = hdr.indexOf('shape_pt_lat')
  const iLon = hdr.indexOf('shape_pt_lon')
  const iSeq = hdr.indexOf('shape_pt_sequence')

  const shapePoints = new Map()
  for (let i = 1; i < shapeLines.length; i++) {
    const l = shapeLines[i]
    if (!l.trim()) continue
    const parts = l.split(',')
    const sid = parts[iId]?.trim().replace(/"/g, '')
    if (!sid || !neededShapes.has(sid)) continue
    const lat = parseFloat(parts[iLat])
    const lon = parseFloat(parts[iLon])
    const seq = parseInt(parts[iSeq], 10)
    if (isNaN(lat) || isNaN(lon)) continue
    if (!shapePoints.has(sid)) shapePoints.set(sid, [])
    shapePoints.get(sid).push({ lat, lon, seq })
  }

  const shapeCoords = new Map()
  for (const [sid, pts] of shapePoints) {
    pts.sort((a, b) => a.seq - b.seq)
    const raw = pts.map((p) => [
      Math.round(p.lon * 1e5) / 1e5,
      Math.round(p.lat * 1e5) / 1e5,
    ])
    shapeCoords.set(sid, simplify(raw, SIMPLIFY_TOLERANCE))
  }
  console.log(`[GTFS]   Built ${shapeCoords.size} geometries`)

  const features = []
  for (const [routeId, shapeId] of routeToShape) {
    const route = routeMap.get(routeId)
    const coords = shapeCoords.get(shapeId)
    if (!route || !coords || coords.length < 2) continue

    const mode = routeTypeToMode(route.type)
    const name = route.shortName
      ? `${route.shortName} — ${route.longName}`
      : route.longName

    features.push({
      type: 'Feature',
      properties: { name, shortName: route.shortName, longName: route.longName, mode, routeType: route.type, routeId },
      geometry: { type: 'LineString', coordinates: coords },
    })
  }

  const geojson = { type: 'FeatureCollection', features }

  writeFileSync(OUTPUT_PATH, JSON.stringify(geojson), 'utf-8')
  const sizeMB = (Buffer.byteLength(JSON.stringify(geojson)) / 1024 / 1024).toFixed(2)
  console.log(`[GTFS]   ${features.length} routes written (${sizeMB} MB)`)

  const stopsEntry = zip.getEntry('stops.txt')
  const stopsFullData = {}
  if (stopsEntry) {
    console.log('[GTFS] Parsing stops…')
    const stopsRows = parseCSV(stopsEntry.getData().toString('utf-8'))
    const stopsMap = {}
    for (const s of stopsRows) {
      if (!s.stop_id || !s.stop_name) continue
      stopsMap[s.stop_id] = s.stop_name
      stopsFullData[s.stop_id] = {
        name: s.stop_name,
        lat: parseFloat(s.stop_lat),
        lon: parseFloat(s.stop_lon),
        parentStation: s.parent_station ?? '',
      }
    }
    const stopsPath = resolve(__dirname, '..', 'public', 'gtfs-stops.json')
    writeFileSync(stopsPath, JSON.stringify(stopsMap), 'utf-8')
    console.log(`[GTFS]   ${Object.keys(stopsMap).length} stops written`)
  }

  const stopTimesEntry = zip.getEntry('stop_times.txt')
  if (stopTimesEntry && Object.keys(stopsFullData).length > 0) {
    console.log('[GTFS] Building rail station map data…')

    const railRouteIds = new Set(
      routeRows.filter((r) => r.route_type === '2').map((r) => r.route_id),
    )
    const railTripIds = new Set(
      tripRows.filter((t) => railRouteIds.has(t.route_id)).map((t) => t.trip_id),
    )

    const stText = stopTimesEntry.getData().toString('utf-8')
    const stLines = stText.split(/\r?\n/)
    const stHdr = stLines[0].split(',').map((h) => h.trim().replace(/"/g, ''))
    const iTripId = stHdr.indexOf('trip_id')
    const iStopId = stHdr.indexOf('stop_id')

    const railPlatformIds = new Set()
    for (let i = 1; i < stLines.length; i++) {
      if (!stLines[i].trim()) continue
      const parts = stLines[i].split(',')
      const tripId = parts[iTripId]?.trim().replace(/"/g, '')
      const stopId = parts[iStopId]?.trim().replace(/"/g, '')
      if (tripId && stopId && railTripIds.has(tripId)) railPlatformIds.add(stopId)
    }

    const seen = new Set()
    const railStationFeatures = []
    for (const platformId of railPlatformIds) {
      const platform = stopsFullData[platformId]
      if (!platform) continue
      const stationId = platform.parentStation || platformId
      if (seen.has(stationId)) continue
      seen.add(stationId)
      const station = stopsFullData[stationId] ?? platform
      if (isNaN(station.lat) || isNaN(station.lon)) continue

      const cleanName = station.name.replace(/,\s*platform\s+\S+/i, '').trim()
      railStationFeatures.push({
        type: 'Feature',
        properties: { id: stationId, name: cleanName },
        geometry: { type: 'Point', coordinates: [
          Math.round(station.lon * 1e5) / 1e5,
          Math.round(station.lat * 1e5) / 1e5,
        ]},
      })
    }

    const railStopsPath = resolve(__dirname, '..', 'public', 'gtfs-rail-stops.json')
    writeFileSync(
      railStopsPath,
      JSON.stringify({ type: 'FeatureCollection', features: railStationFeatures }),
      'utf-8',
    )
    console.log(`[GTFS]   ${railStationFeatures.length} rail stations written`)
  }

  console.log(`[GTFS] Done in ${((Date.now() - t0) / 1000).toFixed(1)}s`)
}

main().catch((err) => { console.error(err); process.exit(1) })
