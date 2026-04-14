import { createPageMetadata } from '@/app/layout'
import { Button } from '@/components/core/button'
import { Card } from '@/components/core/card'
import { Container } from '@/components/core/container'
import { Heading, Lead, Subheading } from '@/components/core/text'
import { Footer } from '@/components/footer/footer'
import { DisableFooter } from '@/components/footer/footer-provider'
import { Navbar } from '@/components/navbar/navbar'
import { NextEvent } from '@/data/upcoming-event'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Image from 'next/image'

const UpcomingEvent = dynamic(
  () => import('@/components/event-promo').then((mod) => mod.EventPromo),
  {
    ssr: true,
  },
)

export const metadata: Metadata = createPageMetadata({
  title: undefined,
  description:
    'Better Transport Queensland champions sustainable public and active transport while promoting efficient regional transport and freight rail solutions for a connected and greener future.',
  slug: undefined,
})

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */
function Hero() {
  return (
    <div className="bg-brand-gradient">
      <Container className="relative">
        <Navbar filled />
        <div className="pt-16 pb-28 sm:pt-20 sm:pb-40 md:pt-28 md:pb-52">
          <h1 className="animate-fade-in-up font-display max-w-4xl text-5xl/[0.9] font-bold tracking-tight text-balance text-white sm:text-6xl/[0.85] md:text-7xl/[0.85]">
            Better Transport Queensland
          </h1>
          <p className="animate-fade-in-up animation-delay-150 mt-8 max-w-xl text-lg/7 font-medium text-on-brand sm:text-xl/8">
            Queensland&apos;s leading advocacy group for public, active, and
            freight transport. We champion research-driven investment in
            world-class transport systems.
          </p>
          <div className="animate-fade-in-up animation-delay-300 mt-12 flex flex-col gap-x-6 gap-y-4 sm:flex-row">
            <Button
              size="large"
              variant="primary"
              href="https://forum.bettertransportqueensland.org"
            >
              Join the Conversation
            </Button>
            <Button size="large" variant="secondary" href="/member">
              Become a Member
            </Button>
          </div>
        </div>
      </Container>
    </div>
  )
}

/* ------------------------------------------------------------------
/*  Policy Platform                                                    */
/* ------------------------------------------------------------------ */
function PolicyPlatform() {
  return (
    <Container>
      <div className="flex flex-col gap-12 lg:flex-row lg:items-center">
        {/* Text */}
        <div className="order-2 flex-1 lg:order-1">
          <p className="section-label">Featured</p>
          <Heading as="h2" className="mt-2">
            The 2025 Policy Platform
          </Heading>
          <Lead className="mt-6 max-w-2xl">
            Our strategic vision for a safer, more accessible, and
            better-integrated transport system across Queensland — covering
            public, active, and freight transport priorities.
          </Lead>
          <Button className="mt-8" variant="primary" href="/policy-platform">
            Read the Platform
          </Button>
        </div>

        {/* Image */}
        <div className="order-1 w-full overflow-hidden rounded-lg shadow-lg lg:order-2 lg:max-w-md">
          <Image
            alt="2025 Policy Platform cover"
            src="/2025_policy_platform.webp"
            width={1920}
            height={1080}
            className="block h-full w-full object-cover"
          />
        </div>
      </div>
    </Container>
  )
}

/* ------------------------------------------------------------------ */
/*  Pillars / "Why we exist"                                           */
/* ------------------------------------------------------------------ */
const pillars = [
  {
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
        />
      </svg>
    ),
    title: 'Public Transport',
    body: 'World-class mass transit systems that connect people to where they live, work, and thrive — reducing congestion without widening freeways.',
  },
  {
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
        />
      </svg>
    ),
    title: 'Active Transport',
    body: 'Safe cycling and walking infrastructure that makes car-free travel a genuine choice for everyday trips.',
  },
  {
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
        />
      </svg>
    ),
    title: 'Freight Rail',
    body: 'Shifting heavy freight from road to rail — more efficient, less damaging to roads, and drastically better for the environment.',
  },
  {
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
        />
      </svg>
    ),
    title: 'Accessibility',
    body: 'Transport that works for everyone — regardless of age, ability, or income — fostering inclusivity and stronger communities.',
  },
]

function Pillars() {
  return (
    <div className="relative">
      <Container>
        <div className="text-center">
          <p className="section-label">Our Mission</p>
          <Heading as="h2" className="mx-auto mt-2 max-w-2xl">
            Why We Exist
          </Heading>
          <Lead className="mx-auto mt-4 max-w-2xl">
            We believe Queensland&apos;s future starts with research-driven
            investment in cutting-edge transport — not more lanes on freeways.
          </Lead>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <Card
              key={p.title}
              className="p-8 hover:-translate-y-0.5"
            >
              <span className="text-accent">{p.icon}</span>
              <h3 className="heading-3 mt-4">
                {p.title}
              </h3>
              <p className="text-body mt-2 text-sm/6">{p.body}</p>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Photo grid + forum CTA                                             */
/* ------------------------------------------------------------------ */
function CommunitySection() {
  return (
    <Container>
      <div className="flex flex-col gap-16 lg:flex-row lg:items-start">
        {/* Photo grid */}
        <div className="flex-1">
          <div className="-mx-4 grid grid-cols-2 gap-4 sm:-mx-8 sm:grid-cols-4 sm:gap-6 lg:mx-0 lg:grid-cols-2 lg:gap-5">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className={`aspect-square overflow-hidden rounded-lg shadow-sm transition-transform duration-300 hover:scale-[1.02] ${n % 2 === 0 ? '-mt-8 lg:-mt-16' : ''}`}
              >
                <Image
                  alt=""
                  src={`/group/${n}.webp`}
                  width={500}
                  height={500}
                  className="block size-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Text + CTA */}
        <div className="flex-1 lg:pt-12">
          <p className="section-label">Community</p>
          <Subheading className="mt-2">
            Join the Conversation on the BTQ Forum
          </Subheading>
          <Lead className="mt-6 max-w-xl">
            Connect with engaged community members, share your thoughts, and be
            part of the movement. Everyone is welcome — from transport
            enthusiasts to everyday commuters.
          </Lead>
          <Button
            className="mt-8"
            variant="primary"
            href="https://forum.bettertransportqueensland.org"
          >
            Visit the Forum
          </Button>
        </div>
      </div>
    </Container>
  )
}

/* ------------------------------------------------------------------ */
/*  Map CTA band                                                       */
/* ------------------------------------------------------------------ */
function MapCTA() {
  return (
    <Container className="relative py-20 text-center sm:py-28">
      <Heading as="h2" dark>
        Explore Our Transport Map
      </Heading>
      <p className="mx-auto mt-4 max-w-xl text-lg/7 text-on-brand">
        See every rail line, bus route, and ferry — plus our proposed
        improvements — on an interactive map of South East Queensland.
      </p>
      <Button className="mt-10" size="large" variant="primary" href="/map">
        Open the Map
      </Button>
    </Container>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function Home() {
  return (
    <>
      {/* This page requires a bare footer to be combined with the MapCTA, so
        disable defualt footer */}
      <DisableFooter />
      <div className="overflow-hidden">
        <Hero />
        <main>
          <div className="space-y-28 pt-24 pb-24 sm:space-y-36 sm:pt-32">
            {NextEvent && (
              <UpcomingEvent
                title={NextEvent.title}
                description={NextEvent.description}
                date={NextEvent.date}
                href={NextEvent.href}
              />
            )}
            <PolicyPlatform />
            <Pillars />
            <CommunitySection />
          </div>
        </main>
        <div className="bg-brand-gradient">
          <MapCTA />
          <Footer bare />
        </div>
      </div>
    </>
  )
}
