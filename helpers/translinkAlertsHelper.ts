import NodeCache from 'node-cache'
import Parser from 'rss-parser'

const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 }) // 5 minute cache

export type AlertSeverity = 'major' | 'minor' | 'info'
export type AlertTransportMode = 'train' | 'bus' | 'ferry' | 'tram' | null

export type TranslinkAlert = {
  id: string
  title: string
  href: string
  severity: AlertSeverity
  services: string
  startDate: string | null
  endDate: string | null
  mode: AlertTransportMode
  area: string | null
}

export type AlertMode = 'all' | 'bus' | 'train' | 'ferry' | 'tram'

const RSS_URLS: Record<AlertMode, string> = {
  all: 'https://translink.com.au/service-updates/rss',
  bus: 'https://translink.com.au/service-updates/rss/bus',
  train: 'https://translink.com.au/service-updates/rss/train',
  ferry: 'https://translink.com.au/service-updates/rss/ferry',
  tram: 'https://translink.com.au/service-updates/rss/tram',
}

/* ------------------------------------------------------------------ */
/*  Parsing                                                            */
/* ------------------------------------------------------------------ */

function parseSeverity(rawTitle: string): AlertSeverity {
  if (rawTitle.startsWith('☒')) return 'major'
  if (rawTitle.startsWith('⚠')) return 'minor'
  return 'info'
}

function stripEmoji(title: string): string {
  return title.replace(/^[☒⚠ⓘ]\s*/, '').trim()
}

function parseDescription(description: string): {
  startDate: string | null
  endDate: string | null
  services: string
} {
  const startMatch = description.match(/Start date:\s*([^,]+)/)
  const endMatch = description.match(/End date:\s*([^,]+)/)
  const servicesMatch = description.match(/Services:\s*(.+)$/)
  return {
    startDate: startMatch?.[1]?.trim() ?? null,
    endDate: endMatch?.[1]?.trim() ?? null,
    services: servicesMatch?.[1]?.trim() ?? '',
  }
}

export function parseTranslinkDate(raw: string): Date | null {
  const m = raw.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})\s*(AM|PM)$/i,
  )
  if (!m) return null
  const [, day, month, year, hour, minute, ampm] = m
  let h = parseInt(hour, 10)
  if (ampm.toUpperCase() === 'PM' && h !== 12) h += 12
  if (ampm.toUpperCase() === 'AM' && h === 12) h = 0
  const AEST_OFFSET_MS = 10 * 60 * 60 * 1000
  const utcMs =
    Date.UTC(
      parseInt(year, 10),
      parseInt(month, 10) - 1,
      parseInt(day, 10),
      h,
      parseInt(minute, 10),
    ) - AEST_OFFSET_MS
  return new Date(utcMs)
}

export function isTimeSpecificAlert(title: string): boolean {
  return /\b\d{1,2}:\d{2}\s*(am|pm)\b/i.test(title) || /\b\d{1,2}\s*(am|pm)\b/i.test(title)
}

export function detectMode(
  title: string,
  services: string,
  feedMode?: AlertMode,
): AlertTransportMode {
  if (feedMode && feedMode !== 'all') return feedMode as AlertTransportMode

  const text = `${title} ${services}`.toLowerCase()
  if (/\btrain\b|\brail\b|\bline\b|\bstation\b/.test(text)) return 'train'
  if (/\bferry\b|\bcitycat\b|\bcross river\b/.test(text)) return 'ferry'
  if (/\btram\b|\blight rail\b|\bg:link\b|\bgoldlinq\b/.test(text)) return 'tram'
  if (/\bbus\b|\bbusway\b|\broute \d|\b\d{3}\b/.test(text)) return 'bus'
  return null
}

export function detectArea(categories: string[], title: string): string | null {
  const catStr = categories.join(' ').toUpperCase()
  if (catStr.includes('SEQ')) return 'SEQ'
  if (catStr.includes('CNS') || /cairns/i.test(title)) return 'Cairns'
  if (catStr.includes('MHB') || /maryborough|hervey bay/i.test(title)) return 'Maryborough/Hervey Bay'
  if (catStr.includes('NSI') || /stradbroke/i.test(title)) return 'Stradbroke'
  if (catStr.includes('BOW') || /bowen/i.test(title)) return 'Bowen'
  if (catStr.includes('INN') || /innisfail/i.test(title)) return 'Innisfail'
  // Default to SEQ for anything without explicit region
  return 'SEQ'
}

export function isStartedWithinDays(startDate: string | null, days: number): boolean {
  if (!startDate) return true
  const start = parseTranslinkDate(startDate)
  if (!start) return true
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  return start >= cutoff
}

export function isStillRelevant(alert: TranslinkAlert): boolean {
  if (!isTimeSpecificAlert(alert.title)) return true
  if (alert.endDate) return true // has an explicit end, let end-date logic handle it

  const start = alert.startDate ? parseTranslinkDate(alert.startDate) : null
  if (!start) return true
  const hoursElapsed = (Date.now() - start.getTime()) / (1000 * 60 * 60)
  return hoursElapsed <= 2
}

export function scoreAlert(alert: TranslinkAlert): number {
  const severityScore = alert.severity === 'major' ? 30 : alert.severity === 'minor' ? 20 : 10

  const start = alert.startDate ? parseTranslinkDate(alert.startDate) : null
  const hoursAgo = start ? (Date.now() - start.getTime()) / (1000 * 60 * 60) : 72
  // Decay: full score at 0h, drops to 0 at 72h
  const recencyScore = Math.max(0, 10 * (1 - hoursAgo / 72))

  return severityScore + recencyScore
}

export async function fetchTranslinkAlerts(mode: AlertMode = 'all'): Promise<TranslinkAlert[]> {
  const cacheKey = `translink-alerts-v2-${mode}`
  const cached = cache.get<TranslinkAlert[]>(cacheKey)
  if (cached) return cached

  const parser = new Parser({ timeout: 8000 })
  try {
    const feed = await parser.parseURL(RSS_URLS[mode])
    const alerts = (feed.items ?? []).map((item, index) => {
      const rawTitle = (item.title ?? '').trim()
      const desc = parseDescription(item.contentSnippet ?? item.content ?? '')
      const categories = (item.categories ?? []).map((c) => c.replace(/\s+/g, ' ').trim())
      const title = stripEmoji(rawTitle)
      return {
        id: item.link ?? String(index),
        title,
        href: item.link ?? '#',
        severity: parseSeverity(rawTitle),
        ...desc,
        mode: detectMode(title, desc.services, mode),
        area: detectArea(categories, title),
      }
    })
    cache.set(cacheKey, alerts)
    return alerts
  } catch {
    return []
  }
}

