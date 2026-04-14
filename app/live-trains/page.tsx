import { createPageMetadata } from '@/app/layout'
import { Container } from '@/components/core/container'
import { HeroBanner } from '@/components/hero-banner'
import { LiveTrainsMap } from '@/components/live-trains-map'
import {
  fetchTranslinkAlerts,
  isStartedWithinDays,
  isStillRelevant,
  scoreAlert,
} from '@/helpers/translinkAlertsHelper'
import type { Metadata } from 'next'

export const metadata: Metadata = createPageMetadata({
  title: 'Live Train Positions',
  description:
    'Track live Queensland train positions and current service alerts on the SEQ rail network — powered by the Translink GTFS real-time feed.',
  slug: 'live-trains',
})

export default async function LiveTrainsPage() {
  const all = await fetchTranslinkAlerts('all')
  const alerts = all
    .filter((a) => isStartedWithinDays(a.startDate, 3) && isStillRelevant(a))
    .sort((a, b) => scoreAlert(b) - scoreAlert(a))

  return (
    <div>
      <HeroBanner
        title="Live Train Positions"
        lead="Real-time locations of trains on the SEQ network, refreshed every 25 seconds. Recent service alerts shown alongside."
      >
        <p className="mt-3 text-xs text-indigo-200/70">
          Position data from the{' '}
          <a
            href="https://translink.com.au/about-translink/open-data/gtfs-rt"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Translink GTFS-RT feed
          </a>{' '}
          (CC-BY licence).
        </p>
      </HeroBanner>

      <Container className="mt-8 mb-16">
        <LiveTrainsMap initialAlerts={alerts} />
      </Container>

    </div>
  )
}
