import { createPageMetadata } from '@/app/layout'
import { Container } from '@/components/container'
import { Snippets } from '@/components/feed-snippets'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { Heading, Lead } from '@/components/text'
import type { Metadata } from 'next'

export const metadata: Metadata = createPageMetadata({
  title: 'Media Releases',
  description:
    'Stay informed with the latest official media releases from Better Transport Queensland—covering public, active, and sustainable transport updates fresh from the source!',
  slug: 'releases',
})

const cacheKey = 'media-feed'
const feedUrl =
  'https://forum.bettertransportqueensland.org/c/media/media-releases/11.rss'

// Only here to indicate to next.js that this page relies on non-static content
export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col overflow-hidden">
      <Container>
        <Navbar />
      </Container>
      <div className="flex-grow">
        <Container className="mt-16 mb-16">
          <Heading as="h1">Media Releases</Heading>
          <Lead className="mt-6 max-w-3xl">
            Stay up to date with our latest media releases.
          </Lead>
          <Snippets
            cacheKey={cacheKey}
            feedUrl={feedUrl}
            redirectRoute="releases"
          />
        </Container>
      </div>
      <Footer />
    </main>
  )
}
