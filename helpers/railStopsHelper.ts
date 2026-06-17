import { readFileSync } from 'fs'
import { resolve } from 'path'

let cache: Record<string, string> | null = null

function load(): Record<string, string> {
  if (cache) return cache
  try {
    const data = readFileSync(resolve(process.cwd(), 'public', 'gtfs-stops.json'), 'utf-8')
    cache = JSON.parse(data) as Record<string, string>
  } catch {
    cache = {}
  }
  return cache
}

export function getStopName(stopId: string | null | undefined): string | null {
  if (!stopId) return null
  return load()[stopId] ?? null
}
