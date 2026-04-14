import { transit_realtime } from 'gtfs-realtime-bindings'
import { recordPosition } from '@/helpers/trainHistoryStore'
import { getStopName } from '@/helpers/railStopsHelper'

const VEHICLE_POSITIONS_URL =
  'https://gtfsrt.api.translink.com.au/api/realtime/SEQ/VehiclePositions/Rail'
const TRIP_UPDATES_URL =
  'https://gtfsrt.api.translink.com.au/api/realtime/SEQ/TripUpdates/Rail'

export type TrainPosition = {
  id: string
  label: string | null
  lat: number
  lng: number
  bearing: number
  tripId: string | null
  routeId: string | null
  speed: number | null
  inService: boolean
  currentStatus: 'STOPPED_AT' | 'INCOMING_AT' | 'IN_TRANSIT_TO' | null
  currentStopId: string | null
  currentStopName: string | null
  nextStopId: string | null
  nextStopName: string | null
  nextArrivalTs: number | null // unix seconds
  delaySeconds: number | null
}

type StopUpdate = {
  stopSeq: number | null
  stopId: string | null
  arrivalDelay: number | null
  arrivalTs: number | null
}

type TripInfo = {
  stopUpdates: StopUpdate[]
  overallDelay: number | null
}

async function fetchTripUpdates(): Promise<Map<string, TripInfo>> {
  const map = new Map<string, TripInfo>()
  try {
    const res = await fetch(TRIP_UPDATES_URL, { next: { revalidate: 20 } })
    if (!res.ok) return map
    const buffer = await res.arrayBuffer()
    const feed = transit_realtime.FeedMessage.decode(new Uint8Array(buffer))
    for (const entity of feed.entity) {
      const tu = entity.tripUpdate
      if (!tu) continue
      const tripId = tu.trip?.tripId
      if (!tripId) continue
      const stopUpdates: StopUpdate[] = (tu.stopTimeUpdate ?? []).map((stu) => ({
        stopSeq: stu.stopSequence ?? null,
        stopId: stu.stopId ?? null,
        arrivalDelay: stu.arrival?.delay ?? null,
        arrivalTs:
          stu.arrival?.time != null
            ? Number(stu.arrival.time)
            : stu.departure?.time != null
              ? Number(stu.departure.time)
              : null,
      }))
      map.set(tripId, { stopUpdates, overallDelay: tu.delay ?? null })
    }
  } catch {
    // TripUpdates are optional enrichment
  }
  return map
}

const VehicleStopStatus = transit_realtime.VehiclePosition?.VehicleStopStatus

export async function GET() {
  try {
    const [vpRes, tripInfoMap] = await Promise.all([
      fetch(VEHICLE_POSITIONS_URL, { next: { revalidate: 20 } }),
      fetchTripUpdates(),
    ])

    if (!vpRes.ok) return Response.json([], { status: 200 })

    const buffer = await vpRes.arrayBuffer()
    const feed = transit_realtime.FeedMessage.decode(new Uint8Array(buffer))

    const positions: TrainPosition[] = feed.entity
      .filter((e) => e.vehicle?.position != null)
      .map((e) => {
        const pos = e.vehicle!.position!
        const id = e.id
        const lat = pos.latitude
        const lng = pos.longitude
        recordPosition(id, lat, lng)

        const tripId = e.vehicle?.trip?.tripId ?? null
        const statusNum = e.vehicle?.currentStatus ?? null
        const currentStopId = e.vehicle?.stopId ?? null
        const currentStopSeq = e.vehicle?.currentStopSequence ?? null

        let currentStatus: TrainPosition['currentStatus'] = null
        if (VehicleStopStatus) {
          if (statusNum === VehicleStopStatus.STOPPED_AT) currentStatus = 'STOPPED_AT'
          else if (statusNum === VehicleStopStatus.INCOMING_AT) currentStatus = 'INCOMING_AT'
          else if (statusNum === VehicleStopStatus.IN_TRANSIT_TO) currentStatus = 'IN_TRANSIT_TO'
        }

        const tripInfo = tripId ? tripInfoMap.get(tripId) : null
        let nextStopId: string | null = null
        let nextArrivalTs: number | null = null
        let delaySeconds: number | null = null

        if (tripInfo) {
          delaySeconds = tripInfo.stopUpdates[0]?.arrivalDelay ?? tripInfo.overallDelay
          if (currentStatus === 'STOPPED_AT' && currentStopSeq != null) {
            // Find the first upcoming stop after the one we're currently stopped at
            const next = tripInfo.stopUpdates.find(
              (u) => u.stopSeq != null && u.stopSeq > currentStopSeq,
            )
            nextStopId = next?.stopId ?? null
            nextArrivalTs = next?.arrivalTs ?? null
          } else {
            nextStopId = tripInfo.stopUpdates[0]?.stopId ?? null
            nextArrivalTs = tripInfo.stopUpdates[0]?.arrivalTs ?? null
          }
        }

        return {
          id,
          label: e.vehicle?.vehicle?.label ?? null,
          lat,
          lng,
          bearing: pos.bearing ?? 0,
          tripId,
          routeId: e.vehicle?.trip?.routeId ?? null,
          speed: pos.speed != null ? Math.round(pos.speed * 3.6) : null,
          inService: !!(e.vehicle?.trip?.routeId),
          currentStatus,
          currentStopId,
          currentStopName: getStopName(currentStopId),
          nextStopId,
          nextStopName: getStopName(nextStopId),
          nextArrivalTs,
          delaySeconds,
        }
      })

    return Response.json(positions, {
      headers: { 'Cache-Control': 'public, max-age=20' },
    })
  } catch {
    return Response.json([])
  }
}
