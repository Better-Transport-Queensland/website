import { Container } from '@/components/container'
import EmbeddedTopic, {
  generateMetadataFromTopic,
} from '@/components/embedded-topic'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import type { Metadata } from 'next'

type Params = Promise<{ topicId: string; number: string }>
const description =
  'Stay informed with the latest official media releases from Better Transport Queensland—covering public, active, and sustainable transport updates fresh from the source!'

export const generateMetadata = async ({
  params: Params,
}: {
  params: Params
}): Promise<Metadata> => {
  const { topicId, number } = await Params

  return generateMetadataFromTopic(topicId, number, 'releases', description)
}

export default async function Page({ params: Params }: { params: Params }) {
  const { topicId, number } = await Params

  return (
    <main className="overflow-hidden">
      <Container>
        <Navbar />
      </Container>
      <Container className="mb-16 mt-16">
        <EmbeddedTopic topicId={topicId} number={number} />
      </Container>
      <Footer />
    </main>
  )
}
