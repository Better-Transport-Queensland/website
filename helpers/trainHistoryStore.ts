export type HistoryPoint = { lat: number; lng: number; ts: number }

const store = new Map<string, HistoryPoint[]>()

function dayStartMs(): number {
  const now = new Date()
  const aestNow = new Date(now.getTime() + 10 * 3_600_000)
  const midnight = Date.UTC(aestNow.getUTCFullYear(), aestNow.getUTCMonth(), aestNow.getUTCDate())
  return midnight - 10 * 3_600_000
}

export function recordPosition(id: string, lat: number, lng: number): void {
  const now = Date.now()
  const cutoff = dayStartMs()
  const history = store.get(id) ?? []

  const last = history[history.length - 1]
  if (last) {
    if (Math.abs(last.lat - lat) < 0.0004 && Math.abs(last.lng - lng) < 0.0004) return
  }

  const pruned = history.filter((p) => p.ts >= cutoff)
  pruned.push({ lat, lng, ts: now })
  store.set(id, pruned)
}

export function getHistory(id: string): HistoryPoint[] {
  return store.get(id) ?? []
}
