// Only here to indicate to next.js that this page relies on non-static content
export const dynamic = 'force-dynamic'

import { createPageMetadata } from '@/app/layout'
import { Container } from '@/components/core/container'
import { HeroBanner } from '@/components/hero-banner'
import { Snippets } from '@/components/topics/feed-snippets'
import type { Metadata } from 'next'

export const metadata: Metadata = createPageMetadata({
  title: 'Media Releases',
  description:
    'Stay informed with the latest official media releases from Better Transport Queensland—covering public, active, and sustainable transport updates fresh from the source!',
  slug: 'releases',
})

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col overflow-hidden">
      <HeroBanner
        title="Media Releases"
        lead="Official statements and updates from Better Transport Queensland on public, active, and sustainable transport."
      />

      <div className="grow">
        <Container className="mt-12 mb-16">
          <Snippets categoryId="11" redirectRoute="releases" />
        </Container>
      </div>
    </main>
  )
}
