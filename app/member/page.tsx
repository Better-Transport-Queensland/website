import { createPageMetadata } from '@/app/layout'
import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { Gradient } from '@/components/gradient'
import { Link } from '@/components/link'
import { Navbar } from '@/components/navbar'
import { Heading, Lead, Subheading } from '@/components/text'
import type { Metadata } from 'next'

export const metadata: Metadata = createPageMetadata({
  title: 'Member',
  description:
    'Join Better Transport Queensland (BTQ) and make your voice heard! Become part of the movement driving change for sustainable, public, and active transport solutions in Queensland.',
  slug: 'member',
})

const tiers = [
  {
    name: 'Forum Member' as const,
    slug: 'forum',
    description: 'Access to our forum and community.',
    priceMonthly: 0,
    highlights: [{ description: 'None!' }],
    buttonText: 'Join the forum',
    href: 'https://forum.bettertransportqueensland.org',
  },
  {
    name: 'Concessional' as const,
    slug: 'concession',
    description: 'Reduced pricing for eligible members.',
    priceMonthly: 30,
    highlights: [
      { description: 'Over 18 years old' },
      { description: 'Must support the objectives of the association' },
      {
        description:
          'Be a current university student OR hold a Pensioner Concession Card',
      },
    ],
    href: 'https://forum.bettertransportqueensland.org',
  },
  {
    name: 'Ordinary' as const,
    slug: 'ordinary',
    description: 'Have a say in Better Transport Queensland!',
    priceMonthly: 50,
    highlights: [
      { description: 'Over 18 years old' },
      { description: 'Must support the objectives of the association' },
    ],
    href: 'https://forum.bettertransportqueensland.org',
  },
]

function Header() {
  return (
    <Container className="mt-16">
      <Heading as="h1">
        Influence change to improve transport throughout Queensland!
      </Heading>
      <Lead className="mt-6 max-w-3xl">
        Better Transport Queensland is a not-for-profit organisation that
        advocates for public and active transport as well as regional transport
        and freight rail. We are a community of people who are passionate about
        improving transport throughout Queensland.
      </Lead>
    </Container>
  )
}

function PricingCards() {
  return (
    <div className="relative py-24">
      <Gradient className="absolute inset-x-2 top-48 bottom-0 rounded-4xl ring-1 ring-black/5 ring-inset" />
      <Container className="relative">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {tiers.map((tier, tierIndex) => (
            <PricingCard key={tierIndex} tier={tier} />
          ))}
        </div>
      </Container>
    </div>
  )
}

function PricingCard({ tier }: { tier: (typeof tiers)[number] }) {
  return (
    <div className="relative rounded-3xl bg-white p-10 pb-9 shadow-2xl ring-1 ring-black/5">
      <Subheading>{tier.name}</Subheading>
      <p className="mt-2 text-sm/6 text-gray-950/75">{tier.description}</p>
      <div className="mt-8 flex items-center gap-4">
        <div className="text-5xl font-medium text-gray-950">
          ${tier.priceMonthly}
        </div>
        <div className="text-sm/5 text-gray-950/75">
          <p>AUD</p>
          <p>per year</p>
        </div>
      </div>
      <div className="mt-8 mb-8">
        <h3 className="text-sm/6 font-medium text-gray-950">Requirements</h3>
        <ul className="mt-3 space-y-3">
          {tier.highlights.map((props, featureIndex) => (
            <FeatureItem key={featureIndex} {...props} />
          ))}
        </ul>
      </div>
      <button className="absolute right-4 bottom-4 rounded-xl bg-pink-400 text-xs data-[hover]:bg-pink-600">
        <Link href={tier.href} className="inline-block px-4 py-2 text-white">
          {tier?.buttonText || 'Coming soon...'}
        </Link>
      </button>
    </div>
  )
}

function FeatureItem({
  description,
  disabled = false,
}: {
  description: string
  disabled?: boolean
}) {
  return (
    <li
      data-disabled={disabled ? true : undefined}
      className="flex items-start gap-4 text-sm/6 text-gray-950/75 data-[disabled]:text-gray-950/25"
    >
      <span className="inline-flex h-6 items-center">
        <PlusIcon className="size-[0.9375rem] shrink-0 fill-gray-950/25" />
      </span>
      {disabled && <span className="sr-only">Not included:</span>}
      {description}
    </li>
  )
}

function PlusIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 15 15" aria-hidden="true" {...props}>
      <path clipRule="evenodd" d="M8 0H7v7H0v1h7v7h1V8h7V7H8V0z" />
    </svg>
  )
}

function FrequentlyAskedQuestions() {
  // TODO ACCORDION
  return (
    <Container className="mt-32">
      <section id="faqs" className="scroll-mt-8">
        <Subheading className="text-center">
          Frequently asked questions
        </Subheading>
        <Heading as="div" className="mt-2 text-center">
          Your questions answered.
        </Heading>
        <div className="mx-auto mt-16 mb-32 max-w-xl space-y-12">
          <dl>
            <dt className="text-sm font-semibold">What is a member?</dt>
            <dd className="mt-4 text-sm/6 text-gray-600">
              Members are financially committed users of the forum who would
              like to contribute to the running, maintenance, and decision
              making of the organisation.
            </dd>
          </dl>
          <dl>
            <dt className="text-sm font-semibold">
              Am I a member if I sign up to the forum?
            </dt>
            <dd className="mt-4 text-sm/6 text-gray-600">
              There is a distinction between a logged-in user of the forum and a
              member of the organisation. Logged-in users are able to view more
              categories and topics than anonymous users, however they are
              unable to vote at annual general meetings or be a member of the
              working or executive committee.
            </dd>
            <dd className="mt-4 text-sm/6 font-semibold text-gray-600">
              You do need to be a paid member to access the member-only section
              of the forum!
            </dd>
          </dl>
          <dl>
            <dt className="text-sm font-semibold">
              Why should I become a member?
            </dt>
            <dd className="mt-4 text-sm/6 text-gray-600">
              If you are a frequent user of the forum and believe in the goals
              and objectives of the organisation, we highly encourage you to
              become a member. Running the forum is costly, so we rely on paying
              members to stay up and running. Our members are vital in ensuring
              we can continue to provide a safe place for interested members of
              the public to get involved in our mission. Members are also able
              to vote at annual general meetings and participate in the working
              and management committee of the organisation. This gives you the
              opportunity to shape the future of the association.
            </dd>
          </dl>
          <dl>
            <dt className="text-sm font-semibold">How are fees decided?</dt>
            <dd className="mt-4 text-sm/6 text-gray-600">
              Membership fees are carefully considered by the Treasurer to
              ensure that we are able to keep the forum and organisation up and
              running.
            </dd>
          </dl>
        </div>
      </section>
    </Container>
  )
}

export default function Pricing() {
  return (
    <main className="overflow-hidden">
      <Container>
        <Navbar />
      </Container>
      <Header />
      <PricingCards />
      <FrequentlyAskedQuestions />
      <Footer />
    </main>
  )
}
