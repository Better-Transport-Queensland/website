'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

type Severity = 'major' | 'minor' | 'info'

export type TickerAlert = {
  id: string
  title: string
  href: string
  severity: Severity
  services: string
  startDate: string | null
}

const SEVERITY_DOT: Record<Severity, string> = {
  major: 'bg-red-400',
  minor: 'bg-amber-400',
  info: 'bg-blue-400',
}

const SEVERITY_LABEL: Record<Severity, string> = {
  major: 'Major',
  minor: 'Minor',
  info: 'Info',
}

const SEVERITY_BADGE: Record<Severity, string> = {
  major: 'bg-red-500/30 text-red-100',
  minor: 'bg-amber-500/30 text-amber-100',
  info: 'bg-blue-500/30 text-blue-100',
}

const AUTO_ADVANCE_MS = 5000

export function AlertTicker({ alerts }: { alerts: TickerAlert[] }) {
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

  return (
    <div
      className="mt-6 w-full max-w-2xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >

      <div className="relative overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
        <Link
          href={alert.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group block px-5 py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <div className="flex items-start gap-3">
            <span
              className={`mt-1 inline-block size-2 shrink-0 rounded-full ${SEVERITY_DOT[alert.severity]}`}
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${SEVERITY_BADGE[alert.severity]}`}
                >
                  {SEVERITY_LABEL[alert.severity]}
                </span>
                {alert.startDate && (
                  <span className="text-xs text-indigo-200/70">
                    {alert.startDate}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm font-semibold text-white group-hover:underline">
                {alert.title}
              </p>
              {alert.services && (
                <p className="mt-0.5 truncate text-xs text-indigo-200/70">
                  {alert.services}
                </p>
              )}
            </div>
            <svg
              className="mt-1 size-4 shrink-0 text-indigo-200/50 transition group-hover:text-white"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </div>
        </Link>
      </div>

      {total > 1 && (
        <div className="mt-3 flex items-center justify-between">
          {/* Dots */}
          <div className="flex items-center gap-1.5">
            {alerts.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to alert ${i + 1}`}
                className={`rounded-full transition-all ${
                  i === index
                    ? 'size-2 bg-white'
                    : 'size-1.5 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>

          {/* Prev / Next */}
          <div className="flex items-center gap-1">
            <button
              onClick={prev}
              aria-label="Previous alert"
              className="rounded-full p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
            <span className="text-xs text-white/50">
              {index + 1} / {total}
            </span>
            <button
              onClick={next}
              aria-label="Next alert"
              className="rounded-full p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
