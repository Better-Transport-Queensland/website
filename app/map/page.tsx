import { createPageMetadata } from '@/app/layout'
import { HeroBanner } from '@/components/hero-banner'
import { TransportMap } from '@/components/transport-map'
import type { Metadata } from 'next'

export const metadata: Metadata = createPageMetadata({
  title: 'Transport Map',
  description:
    "Explore current Queensland public transport routes — rail, bus, ferry, regional passenger rail, and freight corridors — alongside Better Transport Queensland's proposed improvements.",
  slug: 'map',
})

export default function MapPage() {
  return (
    <div className="overflow-hidden">
      <HeroBanner
        title="Our Proposed Transport Map"
        lead="Explore South East Queensland's public transport network alongside our proposed improvements. Toggle layers to compare the current network with what we believe would create a better connected, more sustainable future."
      >
        <p className="mt-4 text-sm text-indigo-200/70">
          Click on any route for more details. Dashed lines indicate proposed
          improvements.
        </p>
      </HeroBanner>

      <div className="px-6 lg:px-8">
        <div className="mx-auto mt-8 mb-16 h-[75vh] max-w-7xl overflow-hidden rounded-lg shadow-sm ring-1 ring-gray-200 dark:ring-gray-800">
          <TransportMap className="h-full w-full" />
        </div>
      </div>
    </div>
  )
}
