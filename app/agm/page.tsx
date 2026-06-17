// Only here to indicate to next.js that this page relies on non-static content
export const dynamic = 'force-dynamic'

import { createPageMetadata } from '@/app/layout'
import { Container } from '@/components/core/container'
import { Navbar } from '@/components/navbar/navbar'
import EmbeddedTopic from '@/components/topics/embedded-topic'
import type { Metadata } from 'next'

const description =
  "Learn about Better Transport Queensland's 2025 Annual general Meeting."
const topicTitle = 'annual-general-meeting-2025'
const categoryTitle = 'announcements'
const topicId = '1300'

export const metadata: Metadata = createPageMetadata({
  title: topicTitle,
  description: description,
  slug: 'blog',
})

export default async function Page() {
  return (
    <main className="overflow-hidden">
      <Container>
        <Navbar />
      </Container>
      <Container className="mb-16">
        <EmbeddedTopic
          topicTitle={topicTitle}
          topicId={topicId}
          categoryTitle={categoryTitle}
        />
      </Container>
    </main>
  )
}
