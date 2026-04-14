'use client'

import { Card } from '@/components/core/card'
import {
  parseTranslinkDate,
  type TranslinkAlert,
} from '@/helpers/translinkAlertsHelper'
import { useMemo, useState } from 'react'

const MODES = [
  { id: 'all', label: 'All modes' },
  { id: 'train', label: 'Train' },
  { id: 'bus', label: 'Bus' },
  { id: 'ferry', label: 'Ferry' },
  { id: 'tram', label: 'Tram' },
] as const

type ModeId = (typeof MODES)[number]['id']

const TIME_RANGES = [
  { id: '1', label: 'Today' },
  { id: '3', label: 'Last 3 days' },
  { id: '7', label: 'Last 7 days' },
  { id: 'all', label: 'All time' },
] as const

type TimeRangeId = (typeof TIME_RANGES)[number]['id']

const SEVERITY_BADGE: Record<string, string> = {
  major: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  minor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
}
const SEVERITY_LABEL: Record<string, string> = {
  major: 'Major',
  minor: 'Minor',
  info: 'Info',
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

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? 'rounded-full bg-indigo-700 px-4 py-1.5 text-sm font-medium text-white shadow-sm'
          : 'rounded-full bg-(--surface-card-raised-bg) px-4 py-1.5 text-sm font-medium text-(--nav-text) hover:bg-(--nav-hover-bg) hover:text-(--nav-hover-text)'
      }
    >
      {children}
    </button>
  )
}

function Select({
  value,
  onChange,
  children,
}: {
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input-field rounded-lg px-3 py-1.5 text-sm shadow-sm"
    >
      {children}
    </select>
  )
}

function AlertCard({ alert }: { alert: TranslinkAlert }) {
  return (
    <Card
      link={alert.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-xl p-4"
    >
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
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

      <p className="text-heading text-sm leading-snug font-semibold group-hover:underline">
        {alert.title}
      </p>

      {/* Services */}
      {alert.services && (
        <p className="text-muted mt-1 line-clamp-2 text-xs">{alert.services}</p>
      )}

      <div className="text-muted mt-2 flex flex-wrap gap-3 text-[11px]">
        {alert.startDate && <span>From {alert.startDate}</span>}
        {alert.endDate && <span>Until {alert.endDate}</span>}
      </div>
    </Card>
  )
}

export function AlertsClient({
  alerts,
  areas,
}: {
  alerts: TranslinkAlert[]
  areas: string[]
}) {
  const [mode, setMode] = useState<ModeId>('all')
  const [area, setArea] = useState('all')
  const [timeRange, setTimeRange] = useState<TimeRangeId>('3')

  const filtered = useMemo(() => {
    const cutoffDays = timeRange === 'all' ? null : parseInt(timeRange, 10)
    const cutoff = cutoffDays
      ? new Date(Date.now() - cutoffDays * 24 * 60 * 60 * 1000)
      : null

    return alerts.filter((a) => {
      if (mode !== 'all' && a.mode !== mode) return false
      if (area !== 'all' && a.area !== area) return false
      if (cutoff && a.startDate) {
        const d = parseTranslinkDate(a.startDate)
        if (d && d < cutoff) return false
      }
      return true
    })
  }, [alerts, mode, area, timeRange])

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {MODES.map(({ id, label }) => (
            <Pill key={id} active={mode === id} onClick={() => setMode(id)}>
              {label}
            </Pill>
          ))}
        </div>

        <div className="hidden h-6 w-px bg-(--surface-card-raised-border) sm:block" />

        <div className="flex flex-wrap gap-2">
          <Select value={area} onChange={setArea}>
            <option value="all">All locations</option>
            {areas.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </Select>

          <Select
            value={timeRange}
            onChange={(v) => setTimeRange(v as TimeRangeId)}
          >
            {TIME_RANGES.map(({ id, label }) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <p className="text-muted mt-4 text-sm">
        {filtered.length > 0 ? (
          <>
            <span className="text-heading font-semibold">
              {filtered.length}
            </span>{' '}
            alert{filtered.length !== 1 ? 's' : ''}
          </>
        ) : (
          'No alerts match the current filters.'
        )}
      </p>

      {filtered.length > 0 && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      )}
    </>
  )
}
