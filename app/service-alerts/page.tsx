import { createPageMetadata } from '@/app/layout'
import { Container } from '@/components/core/container'
import { HeroBanner } from '@/components/hero-banner'
import { fetchTranslinkAlerts, scoreAlert } from '@/helpers/translinkAlertsHelper'
import type { Metadata } from 'next'
import Link from 'next/link'
import { AlertsClient } from './alerts-client'

export const metadata: Metadata = createPageMetadata({
  title: 'Service Alerts',
  description:
    'Live Translink service alerts — track current delays, disruptions, and planned outages across the Queensland public transport network.',
  slug: 'service-alerts',
})

export default async function ServiceAlertsPage() {
  const alerts = await fetchTranslinkAlerts('all')
  alerts.sort((a, b) => scoreAlert(b) - scoreAlert(a))

  const areas = Array.from(
    new Set(alerts.map((a) => a.area).filter(Boolean) as string[]),
  ).sort()

  return (
    <div>
      <HeroBanner
        title="Service Alerts"
        lead="Live Translink service disruptions, delays, and notices. Filter by mode, location, or time."
      />

      <Container className="mt-10 mb-16">
        <AlertsClient alerts={alerts} areas={areas} />

        <p className="text-muted mt-10 text-xs">
          Data sourced from the{' '}
          <Link
            href="https://translink.com.au/about-translink/open-data"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-600 dark:hover:text-gray-400"
          >
            Translink open data feed
          </Link>{' '}
          under the Creative Commons (CC-BY) licence. Updates may be delayed by a few minutes.
        </p>
      </Container>

    </div>
  )
}
