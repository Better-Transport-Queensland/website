import { createPageMetadata } from '@/app/layout'
import { BetaOnly } from '@/components/beta-only'
import { Button } from '@/components/core/button'
import { Card } from '@/components/core/card'
import { Container } from '@/components/core/container'
import { Heading, Lead, Subheading } from '@/components/core/text'
import { Footer } from '@/components/footer/footer'
import { DisableFooter } from '@/components/footer/footer-provider'
import { HeroScroll } from '@/components/motion/hero-scroll'
import { MotionProvider } from '@/components/motion/motion-provider'
import { Parallax } from '@/components/motion/parallax'
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal'
import { Navbar } from '@/components/navbar/navbar'
import { currentPolicyPlatform } from '@/data/policy-platform'
import { NextEvent } from '@/data/upcoming-event'
import { Bus, MapPin, Train, Users } from 'lucide-react'
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
        <HeroScroll>
          <div className="pt-16 pb-28 sm:pt-20 sm:pb-40 md:pt-28 md:pb-52">
            <h1 className="animate-fade-in-up font-display max-w-4xl text-5xl/[0.9] font-bold tracking-tight text-balance text-white sm:text-6xl/[0.85] md:text-7xl/[0.85]">
              Better Transport Queensland
            </h1>
            <p className="animate-fade-in-up animation-delay-150 text-on-brand mt-8 max-w-xl text-lg/7 font-medium sm:text-xl/8">
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
        </HeroScroll>
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
        <Reveal direction="left" className="order-2 flex-1 lg:order-1">
          <p className="section-label">Featured</p>
          <Heading as="h2" className="mt-2">
            {currentPolicyPlatform.title}
          </Heading>
          <Lead className="mt-6 max-w-2xl">{currentPolicyPlatform.lead}</Lead>
          <Button className="mt-8" variant="primary" href="/policy-platform">
            Read the Platform
          </Button>
        </Reveal>

        {/* Image */}
        <Reveal
          direction="right"
          scale={0.95}
          className="order-1 w-full lg:order-2 lg:max-w-md"
        >
          <Parallax distance={50}>
            <div className="overflow-hidden rounded-lg shadow-lg">
              <Image
                alt={`${currentPolicyPlatform.label} Policy Platform cover`}
                src={currentPolicyPlatform.coverImage}
                width={1920}
                height={1080}
                className="block h-full w-full object-cover"
              />
            </div>
          </Parallax>
        </Reveal>
      </div>
    </Container>
  )
}

/* ------------------------------------------------------------------ */
/*  Pillars / "Why we exist"                                           */
/* ------------------------------------------------------------------ */
const pillars = [
  {
    icon: <Bus className="h-8 w-8" strokeWidth={1.5} />,
    title: 'Public Transport',
    body: 'World-class mass transit systems that connect people to where they live, work, and thrive, reducing congestion without widening freeways.',
  },
  {
    icon: <MapPin className="h-8 w-8" strokeWidth={1.5} />,
    title: 'Active Transport',
    body: 'Safe cycling and walking infrastructure that makes car-free travel a genuine choice for everyday trips.',
  },
  {
    icon: <Train className="h-8 w-8" strokeWidth={1.5} />,
    title: 'Freight Rail',
    body: 'Shifting heavy freight from road to rail: more efficient, less damaging to roads, and drastically better for the environment.',
  },
  {
    icon: <Users className="h-8 w-8" strokeWidth={1.5} />,
    title: 'Accessibility',
    body: 'Transport that works for everyone, regardless of age, ability, or income, fostering inclusivity and stronger communities.',
  },
]

function Pillars() {
  return (
    <div className="relative">
      <Container>
        <Reveal className="text-center">
          <p className="section-label">Our Mission</p>
          <Heading as="h2" className="mx-auto mt-2 max-w-2xl">
            Why We Exist
          </Heading>
          <Lead className="mx-auto mt-4 max-w-2xl">
            We believe Queensland&apos;s future starts with research-driven
            investment in cutting-edge transport, not more lanes on freeways.
          </Lead>
        </Reveal>

        <RevealGroup className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <RevealItem key={p.title}>
              <Card className="h-full p-8 hover:-translate-y-0.5">
                <span className="text-accent">{p.icon}</span>
                <h3 className="heading-3 mt-4">{p.title}</h3>
                <p className="text-body mt-2 text-sm/6">{p.body}</p>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>
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
          <RevealGroup className="-mx-4 grid grid-cols-2 gap-4 sm:-mx-8 sm:grid-cols-4 sm:gap-6 lg:mx-0 lg:grid-cols-2 lg:gap-5">
            {[1, 2, 3, 4].map((n) => (
              <RevealItem
                key={n}
                className={n % 2 === 0 ? '-mt-8 lg:-mt-16' : undefined}
              >
                {/* Offset columns drift at different speeds while scrolling */}
                <Parallax distance={n % 2 === 0 ? 90 : 40}>
                  <div className="aspect-square overflow-hidden rounded-lg shadow-sm transition-transform duration-300 hover:scale-[1.02]">
                    <Image
                      alt=""
                      src={`/group/${n}.webp`}
                      width={500}
                      height={500}
                      className="block size-full object-cover"
                    />
                  </div>
                </Parallax>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        {/* Text + CTA */}
        <Reveal direction="right" className="flex-1 lg:pt-12">
          <p className="section-label">Community</p>
          <Subheading className="mt-2">
            Join the Conversation on the BTQ Forum
          </Subheading>
          <Lead className="mt-6 max-w-xl">
            Connect with engaged community members, share your thoughts, and be
            part of the movement. Everyone is welcome, from transport
            enthusiasts to everyday commuters.
          </Lead>
          <Button
            className="mt-8"
            variant="primary"
            href="https://forum.bettertransportqueensland.org"
          >
            Visit the Forum
          </Button>
        </Reveal>
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
      <Reveal>
        <Heading as="h2" dark>
          Explore Our Transport Map
        </Heading>
        <p className="text-on-brand mx-auto mt-4 max-w-xl text-lg/7">
          See every rail line, bus route, and ferry, plus our proposed
          improvements, on an interactive map of South East Queensland.
        </p>
        <Button className="mt-10" size="large" variant="primary" href="/map">
          Open the Map
        </Button>
      </Reveal>
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
      <MotionProvider>
        {/* clip, not hidden: overflow-hidden would make this div the scroll
        container that the scroll-linked animations track, and it never scrolls */}
        <div className="overflow-x-clip">
          <Hero />
          <main>
            <div className="space-y-28 pt-24 pb-24 sm:space-y-36 sm:pt-32">
              {NextEvent && (
                <Reveal>
                  <UpcomingEvent
                    title={NextEvent.title}
                    description={NextEvent.description}
                    date={NextEvent.date}
                    href={NextEvent.href}
                  />
                </Reveal>
              )}
              <PolicyPlatform />
              <Pillars />
              <CommunitySection />
            </div>
          </main>
          <div className="bg-brand-gradient">
            <BetaOnly>
              <MapCTA />
            </BetaOnly>
            <Footer bare />
          </div>
        </div>
      </MotionProvider>
    </>
  )
}
