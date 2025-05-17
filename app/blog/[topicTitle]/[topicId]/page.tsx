import { Container } from '@/components/container'
import EmbeddedTopic, {
  generateMetadataFromTopic,
} from '@/components/embedded-topic'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import type { Metadata } from 'next'

type Params = Promise<{ topicTitle: string; topicId: string }>
const description =
  'Explore diverse perspectives from passionate community members on the Better Transport Queensland blog. Dive into personal opinions, creative ideas, and vibrant discussions about public, active, and sustainable transport—directly from the voices that care the most!'
const categoryTitle = 'Blog'

export const generateMetadata = async ({
  params: Params,
}: {
  params: Params
}): Promise<Metadata> => {
  const { topicTitle, topicId } = await Params

  return generateMetadataFromTopic(
    categoryTitle,
    topicTitle,
    topicId,
    'blog',
    description,
  )
}

export default async function Page({ params: Params }: { params: Params }) {
  const { topicTitle, topicId } = await Params

  return (
    <main className="overflow-hidden">
      <Container>
        <Navbar />
      </Container>
      <Container className="mt-16 mb-16">
        <EmbeddedTopic
          topicTitle={topicTitle}
          topicId={topicId}
          categoryTitle={categoryTitle}
          linkToTopic
          showAuthor
        />
      </Container>
      <Footer />
    </main>
  )
}
