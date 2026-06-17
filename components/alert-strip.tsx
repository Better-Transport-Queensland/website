'use client'

import type { AlertSeverity, TranslinkAlert } from '@/helpers/translinkAlertsHelper'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

const SEVERITY_BG: Record<AlertSeverity, string> = {
  major: 'bg-red-600',
  minor: 'bg-amber-500',
  info: 'bg-indigo-600',
}

const SEVERITY_LABEL: Record<AlertSeverity, string> = {
  major: 'Major disruption',
  minor: 'Minor disruption',
  info: 'Service notice',
}

const AUTO_ADVANCE_MS = 5000

export function AlertStrip({ alerts }: { alerts: TranslinkAlert[] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const total = alerts.length

  const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total])
  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total])

  useEffect(() => {
    if (total <= 1 || paused) return
    const id = setInterval(next, AUTO_ADVANCE_MS)
    return () => clearInterval(id)
  }, [total, paused, next])

  if (total === 0) return null

  const alert = alerts[index]
  const bg = SEVERITY_BG[alert.severity]

  return (
    <div
      className={`${bg} relative z-50`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-1.5 sm:px-6 lg:px-8">
        {/* Prev */}
        {total > 1 && (
          <button
            onClick={prev}
            aria-label="Previous alert"
            className="shrink-0 rounded p-0.5 text-white/70 transition hover:text-white hover:cursor-pointer"
          >
            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
        )}

        {/* Content */}
        <Link
          href={alert.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-w-0 flex-1 items-center justify-center gap-2 text-center"
        >
          <span className="shrink-0 rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            {SEVERITY_LABEL[alert.severity]}
          </span>
          {alert.mode && (
            <span className="hidden shrink-0 rounded bg-white/15 px-1.5 py-0.5 text-[10px] font-medium capitalize text-white/90 sm:inline">
              {alert.mode}
            </span>
          )}
          {alert.area && alert.area !== 'SEQ' && (
            <span className="hidden shrink-0 rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-white/80 lg:inline">
              {alert.area}
            </span>
          )}
          <span className="truncate text-xs font-medium text-white">
            {alert.title}
          </span>
          <svg
            className="size-3 shrink-0 text-white/60"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </Link>

        {/* Counter + Next */}
        <div className="flex shrink-0 items-center gap-1">
          {total > 1 && (
            <span className="text-[10px] tabular-nums text-white/60">
              {index + 1}/{total}
            </span>
          )}
          {total > 1 && (
            <button
              onClick={next}
              aria-label="Next alert"
              className="rounded p-0.5 text-white/70 transition hover:text-white hover:cursor-pointer"
            >
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
