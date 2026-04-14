import { createPageMetadata } from '@/app/layout'
import { Card } from '@/components/core/card'
import { Container } from '@/components/core/container'
import { Heading, Lead } from '@/components/core/text'
import ContactForm from '@/components/forms/contact-form'
import { HeroBanner } from '@/components/hero-banner'
import { isContactFormConfigured } from '@/lib/discourse-config'
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
    <Card className="p-6">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg icon-well text-sm font-bold">
        {name
          .split(' ')
          .map((n) => n[0])
          .join('')}
      </div>
      <h3 className="text-lg font-semibold text-heading">{name}</h3>
      <p className="mt-1 text-sm text-muted">{role}</p>
      {email && (
        <a
          href={`mailto:${email}`}
          className="mt-2 inline-block text-sm font-medium link-accent"
        >
          {email}
        </a>
      )}
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
  {
    name: 'Ari Bowe',
    role: 'Media Director',
    email: 'media.director@btq.org.au',
  },
  {
    name: 'Alexander Lynch',
    role: 'Non-Executive Director',
  },
  {
    name: '#Metro',
    role: 'Non-Executive Director',
  },
  {
    name: 'You?',
    role: "We're always looking for additional volunteers to fill open roles!",
  },
]

function GeneralContacts() {
  return (
    <section>
      <div className="mb-8 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900 dark:border-amber-700/70 dark:bg-amber-950/30 dark:text-amber-200">
        <p className="text-sm font-semibold uppercase tracking-wide">
          Important Notice
        </p>
        <p className="mt-2 text-sm leading-relaxed">
          Better Transport Queensland is an independent community organisation.
          We are <strong>not</strong> the Queensland Government, TransLink,
          Queensland Rail, or any local council, and we cannot process official
          complaints, fines, or service requests.
        </p>
        <p className="mt-2 text-sm leading-relaxed">
          For government transport services, please contact the relevant agency
          directly.
        </p>
      </div>
      <Heading as="h2">Get in touch</Heading>
      <p className="mt-4 max-w-3xl text-body">
        We&apos;re always happy to take part in interviews on any topic relating
        to Queensland&apos;s transport system, such as policy, infrastructure,
        accessibility, and community impacts.
      </p>
      <section className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="group relative p-8">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg icon-well">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
          </div>
          <h3 className="heading-3">
            General Enquiries
          </h3>
          <p className="mt-2 text-sm text-body">
            For any general enquiries or questions, please contact us at{' '}
            <a
              href="mailto:enquiries@btq.org.au"
              className="font-medium link-accent"
            >
              enquiries@btq.org.au
            </a>
          </p>
        </Card>
        <Card className="group relative p-8">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg icon-well">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
            </svg>
          </div>
          <h3 className="heading-3">
            Media Enquiries
          </h3>
          <p className="mt-2 text-sm text-body">
            For any media enquiries or questions, please contact us at{' '}
            <a
              href="mailto:media@btq.org.au"
              className="font-medium link-accent"
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
      <p className="mt-6 max-w-3xl text-body">
        Our Management Committee is made up of dedicated volunteers who guide
        Better Transport Queensland&apos;s strategy, governance, and advocacy
        work. Each member brings unique expertise and a shared commitment to
        improving transport outcomes across the state.
      </p>

      <p className="mt-4 max-w-3xl text-body">
        For the quickest response, please direct your general and media
        enquiries to the email addresses listed in the section above.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
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

function ContactFormSection() {
  const formConfigured = isContactFormConfigured()

  if (!formConfigured) {
    return null
  }

  return (
    <section>
      <Heading as="h1">Send us a message</Heading>
      <Lead className="mt-6 max-w-3xl">
        Have a question, idea, or suggestion? Use the form below to reach out to
        Better Transport Queensland directly.
      </Lead>

      <div className="mt-8">
        <ContactForm />
      </div>
    </section>
  )
}

function Contacts() {
  return (
    <Container className="space-y-24">
      <ContactFormSection />
      <GeneralContacts />
      <ManagementCommittee />
    </Container>
  )
}

export default function Company() {
  return (
    <main className="flex min-h-screen flex-col overflow-hidden">
      <HeroBanner
        title="Contact us"
        lead="Get in touch with us to learn more about our mission and how you can help us improve transport throughout Queensland."
      />

      <div className="mt-12 mb-16 grow">
        <Contacts />
      </div>
    </main>
  )
}
