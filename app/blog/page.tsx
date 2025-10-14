import { createPageMetadata } from '@/app/layout'

import { Container } from '@/components/container'
import { Snippets } from '@/components/feed-snippets'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { Heading, Lead } from '@/components/text'
import type { Metadata } from 'next'

export const metadata: Metadata = createPageMetadata({
  title: 'Blog',
  description:
    'Explore diverse perspectives from passionate community members on the Better Transport Queensland (BTQ) blog. Dive into personal opinions, creative ideas, and vibrant discussions about public, active, and sustainable transport—directly from the voices that care the most!',
  slug: 'blog',
})

// Only here to indicate to next.js that this page relies on non-static content
export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col overflow-hidden">
      <Container>
        <Navbar />
      </Container>
      <div className="flex-grow">
        <Container className="mb-16">
          <Heading as="h1">Blog</Heading>
          <Lead className="mt-6 max-w-3xl">
            See thoughts from the BTQ Community.
          </Lead>
          <Snippets categoryId="57" redirectRoute="blog" showAuthor />
        </Container>
      </div>
      <Footer />
    </main>
  )
}
