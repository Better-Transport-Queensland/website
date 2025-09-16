import { createPageMetadata } from '@/app/layout'
import { Card } from '@/components/card'
import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { Heading, Lead } from '@/components/text'
import type { Metadata } from 'next'

export const metadata: Metadata = createPageMetadata({
  title: 'Contact us',
  description:
    'Looking to connect with Better Transport Queensland? Discover easy ways to reach out and share your ideas for public, active, and sustainable transport solutions in Queensland!',
  slug: 'contact',
})

type CommitteeMember = {
  name: string
  role: string
  email?: string
}

function CommitteeMemberCard({ name, role, email }: CommitteeMember) {
  return (
    <Card>
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-sm text-gray-500">
        {role}
        {email && (
          <>
            {' — '}
            <a
              href={`mailto:${email}`}
              className="text-pink-500 hover:underline"
            >
              {email}
            </a>
          </>
        )}
      </p>
    </Card>
  )
}

const committeeMembers: CommitteeMember[] = [
  { name: 'Rowan Gray', role: 'President', email: 'president@btq.org.au' },
  { name: 'Alex Jago', role: 'Secretary', email: 'secretary@btq.org.au' },
  {
    name: 'Marc Fotsch-Heatley',
    role: 'Treasurer',
    email: 'treasurer@btq.org.au',
  },
  {
    name: 'Tristan Duncombe',
    role: 'Web Master',
    email: 'webmaster@btq.org.au',
  },
  { name: 'Peter V', role: 'Non-Governing Director' },
  { name: 'Alex D', role: 'Non-Governing Director' },
]

function GeneralContacts() {
  return (
    <section>
      <Heading as="h1">Contact us</Heading>
      <Lead className="mt-6 max-w-3xl">
        Get in touch with us to learn more about our mission and how you can
        help us improve transport throughout Queensland.
      </Lead>
      <p className="mt-4 max-w-3xl text-gray-600">
        We&apos;re always happy to take part in interviews on any topic relating
        to Queensland&apos;s transport system, such as policy, infrastructure,
        accessibility, and community impacts.
      </p>
      <section className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        <Card>
          <h3 className="text-lg font-semibold">General Enquiries</h3>
          <p className="mt-4 text-sm text-gray-600">
            For any general enquiries or questions, please contact us at{' '}
            <a
              href="mailto:enquiries@btq.org.au"
              className="text-pink-500 hover:underline"
            >
              enquiries@btq.org.au
            </a>
          </p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold">Media Enquiries</h3>
          <p className="mt-4 text-sm text-gray-600">
            For any media enquiries or questions, please contact us at{' '}
            <a
              href="mailto:media@btq.org.au"
              className="text-pink-500 hover:underline"
            >
              media@btq.org.au
            </a>
          </p>
        </Card>
      </section>
    </section>
  )
}

function ManagementCommittee() {
  return (
    <section>
      <Heading as="h2">Management Committee</Heading>
      <p className="mt-6 max-w-3xl text-gray-600">
        Our Management Committee is made up of dedicated volunteers who guide
        Better Transport Queensland&apos;s strategy, governance, and advocacy
        work. Each member brings unique expertise and a shared commitment to
        improving transport outcomes across the state.
      </p>

      <p className="mt-4 max-w-3xl text-gray-600">
        For the quickest response, please direct your general and media
        enquiries to the email addresses listed in the section above.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {committeeMembers.map((member) => (
          <CommitteeMemberCard
            key={member.name}
            name={member.name}
            role={member.role}
            email={member.email}
          />
        ))}
      </div>
    </section>
  )
}

function Contacts() {
  return (
    <Container className="space-y-24">
      <GeneralContacts />
      <ManagementCommittee />
    </Container>
  )
}

export default function Company() {
  return (
    <main className="flex min-h-screen flex-col overflow-hidden">
      <Container>
        <Navbar />
      </Container>
      <div className="mb-16 flex-grow">
        <Contacts />
      </div>
      <Footer />
    </main>
  )
}
