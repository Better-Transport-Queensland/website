// Only here to indicate to next.js that this page relies on non-static content
export const dynamic = 'force-dynamic'

import { createPageMetadata } from '@/app/layout'
import { Container } from '@/components/core/container'
import { HeroBanner } from '@/components/hero-banner'
import { Snippets } from '@/components/topics/feed-snippets'
import type { Metadata } from 'next'

export const metadata: Metadata = createPageMetadata({
  title: 'Blog',
  description:
    'Explore diverse perspectives from passionate community members on the Better Transport Queensland (BTQ) blog. Dive into personal opinions, creative ideas, and vibrant discussions about public, active, and sustainable transport—directly from the voices that care the most!',
  slug: 'blog',
})

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col overflow-hidden">
      <HeroBanner
        title="Blog"
        lead="Perspectives, ideas, and discussions from our passionate community — covering everything from rail policy to active transport."
      />

      <div className="grow">
        <Container className="mt-12 mb-16">
          <Snippets categoryId="57" redirectRoute="blog" showAuthor />
        </Container>
      </div>
    </main>
  )
}
