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
    'Explore the Better Transport Queensland blog, where engaged community members share their opinions and insights on public, active, and sustainable transport (not official policy). Stay informed and join the conversation!',
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
