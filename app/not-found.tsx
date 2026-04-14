import { Button } from '@/components/core/button'
import { Container } from '@/components/core/container'
import { Navbar } from '@/components/navbar/navbar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: {
    index: false,
    follow: false,
  },
}

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col font-sans antialiased">
      <div className="flex grow flex-col overflow-hidden">
        <Container>
          <Navbar />
        </Container>

        <div className="grow">
          <main className="flex min-h-full flex-col items-center justify-center px-6 py-24 sm:py-32 lg:px-8">
            {/* Departure board */}
            <div className="w-full max-w-md rounded-2xl bg-gray-900 p-5 shadow-2xl ring-1 ring-white/10 dark:bg-gray-800">
              {/* Board header */}
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">
                  Departures
                </span>
                <span className="flex h-2 w-2 animate-pulse rounded-full bg-green-400 shadow-lg shadow-green-400/50" />
              </div>

              {/* Column headers */}
              <div className="grid grid-cols-3 border-b border-gray-700 pb-2 font-mono text-xs text-gray-500">
                <span>TIME</span>
                <span>DESTINATION</span>
                <span className="text-right">STATUS</span>
              </div>

              {/* 404 row */}
              <div className="grid grid-cols-3 items-center border-b border-gray-700/50 py-3.5">
                <span className="font-mono text-2xl font-bold tabular-nums text-amber-400">
                  404
                </span>
                <span className="font-mono text-sm font-semibold text-white">
                  NOT FOUND
                </span>
                <span className="text-right font-mono text-xs font-medium text-red-400">
                  CANCELLED
                </span>
              </div>

              {/* Ghost rows */}
              <div className="grid grid-cols-3 items-center border-b border-gray-700/20 py-2.5 opacity-25">
                <span className="font-mono text-sm text-gray-400">---</span>
                <span className="font-mono text-sm text-gray-400">NEXT SERVICE</span>
                <span className="text-right font-mono text-xs text-gray-400">UNKNOWN</span>
              </div>
              <div className="grid grid-cols-3 items-center py-2.5 opacity-10">
                <span className="font-mono text-sm text-gray-400">---</span>
                <span className="font-mono text-sm text-gray-400">-----------</span>
                <span className="text-right font-mono text-xs text-gray-400">-------</span>
              </div>
            </div>

            {/* Text content */}
            <div className="mt-10 text-center">
              <h1 className="text-4xl font-semibold tracking-tight text-balance text-heading sm:text-5xl">
                This stop doesn&apos;t exist
              </h1>
              <p className="mt-4 text-lg font-medium text-pretty text-muted">
                Looks like this route isn&apos;t in service. Let&apos;s get you back on track.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Button href="/" variant="primary">
                  Back to home
                </Button>
                <Button href="/contact" variant="outline">
                  Contact us
                </Button>
              </div>
            </div>
          </main>
        </div>

      </div>
    </div>
  )
}
