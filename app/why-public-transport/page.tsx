import { createPageMetadata } from '@/app/layout'
import { Button } from '@/components/core/button'
import { Card } from '@/components/core/card'
import { Container } from '@/components/core/container'
import { Heading, Lead, Subheading } from '@/components/core/text'
import { HeroBanner } from '@/components/hero-banner'
import type { Metadata } from 'next'

export const metadata: Metadata = createPageMetadata({
  title: 'Why Public Transport?',
  description:
    'Discover the benefits of public transport for commuters, drivers, and communities across Queensland. Learn how better PT makes life easier for everyone.',
  slug: 'why-public-transport',
})

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
const benefitsForDrivers = [
  {
    icon: (
      <svg
        className="h-7 w-7"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    ),
    title: 'Less Time in Traffic',
    body: 'Every person who takes the train or bus is one fewer car on the road. More PT riders means freer-flowing roads for those who genuinely need to drive.',
  },
  {
    icon: (
      <svg
        className="h-7 w-7"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
        />
      </svg>
    ),
    title: 'Save Money',
    body: 'The average Queensland household spends over $15,000 a year running a car. A go card costs a fraction of that — even before factoring in parking, tolls, and depreciation.',
  },
  {
    icon: (
      <svg
        className="h-7 w-7"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
        />
      </svg>
    ),
    title: 'Safer Roads',
    body: 'Public transport is statistically far safer than private car travel. More investment in PT reduces crash risk for everyone sharing the road.',
  },
  {
    icon: (
      <svg
        className="h-7 w-7"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
        />
      </svg>
    ),
    title: 'Free Up Your Time',
    body: 'On a train or bus you can read, work, or just relax. Driving demands 100% of your attention — PT gives that time back to you.',
  },
]

const gettingStartedSteps = [
  {
    step: '1',
    title: 'Plan Your Trip',
    body: 'Use the TransLink Journey Planner or Google Maps to find routes, timetables, and real-time departures for your trip.',
  },
  {
    step: '2',
    title: 'Get a go card or Use Contactless',
    body: 'Tap on with a go card, credit/debit card, or your phone. Fares are capped daily and weekly so you never overpay.',
  },
  {
    step: '3',
    title: 'Ride with Confidence',
    body: 'Most services run every 15 minutes or better during peak hours. Off-peak and weekends are cheaper, and under-5s ride free.',
  },
  {
    step: '4',
    title: 'Mix & Match Modes',
    body: 'Combine train, bus, ferry, and tram in a single journey. Transfers within one hour are free — the system is built for multi-modal trips.',
  },
]

const environmentStats = [
  {
    value: '80%',
    label: 'Less CO₂ per passenger-km than a single-occupancy car',
  },
  {
    value: '50×',
    label: 'More people moved per lane than private vehicles',
  },
  {
    value: '30%',
    label: 'Of Brisbane CBD land devoted to car parking',
  },
  {
    value: '0',
    label: 'Emissions from electric trains on the SEQ network',
  },
]

/* ------------------------------------------------------------------ */
/*  Sections                                                           */
/* ------------------------------------------------------------------ */
function WhyItMatters() {
  return (
    <Container>
      <div className="text-center">
        <p className="section-label">The Big Picture</p>
        <Heading as="h2" className="mx-auto mt-2 max-w-3xl">
          Why Public Transport Matters
        </Heading>
        <Lead className="mx-auto mt-4 max-w-2xl">
          Good public transport isn&apos;t just for riders — it makes cities
          healthier, more affordable, and better connected for everyone.
        </Lead>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {benefitsForDrivers.map((b) => (
          <Card key={b.title} className="p-8 hover:-translate-y-0.5">
            <span className="text-accent">{b.icon}</span>
            <h3 className="heading-3 mt-4">{b.title}</h3>
            <p className="text-body mt-2 text-sm/6">{b.body}</p>
          </Card>
        ))}
      </div>
    </Container>
  )
}

function EnvironmentImpact() {
  return (
    <div className="bg-subtle py-20">
      <Container>
        <div className="text-center">
          <p className="section-label">Environmental Impact</p>
          <Subheading className="mx-auto mt-2 max-w-2xl">
            Better for the Planet
          </Subheading>
          <Lead className="mx-auto mt-4 max-w-2xl">
            Switching even one car trip a week to public transport makes a
            measurable difference.
          </Lead>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-lg bg-(--surface-card-raised-border) shadow-sm sm:grid-cols-4">
          {environmentStats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center bg-(--surface-card-raised-bg) px-4 py-8 text-center"
            >
              <span className="text-accent text-3xl font-bold tracking-tight">
                {stat.value}
              </span>
              <span className="text-muted mt-2 text-xs font-medium tracking-wide uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}

function GettingStarted() {
  return (
    <Container>
      <div className="text-center">
        <p className="section-label">New to PT?</p>
        <Heading as="h2" className="mx-auto mt-2 max-w-2xl">
          Getting Started Is Easy
        </Heading>
        <Lead className="mx-auto mt-4 max-w-2xl">
          Queensland&apos;s TransLink network covers trains, buses, ferries, and
          light rail across South East Queensland.
        </Lead>
      </div>

      <div className="mx-auto mt-16 max-w-3xl space-y-8">
        {gettingStartedSteps.map((s) => (
          <div key={s.step} className="flex gap-6">
            <div className="icon-well-solid flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg font-bold">
              {s.step}
            </div>
            <div>
              <h3 className="text-heading text-lg font-bold">{s.title}</h3>
              <p className="text-body mt-1 text-sm/6">{s.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button
          variant="primary"
          href="https://jp.translink.com.au/plan-your-journey/journey-planner"
        >
          Plan a Journey on TransLink
        </Button>
      </div>
    </Container>
  )
}

function DriversSection() {
  return (
    <div className="bg-subtle py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="section-label">For Drivers</p>
          <Subheading className="mt-2">What&apos;s In It For You?</Subheading>
          <Lead className="mt-4">
            You don&apos;t have to give up your car to benefit from better
            public transport.
          </Lead>
        </div>

        <div className="text-prose mx-auto mt-12 max-w-3xl space-y-6 text-base/7">
          <p>
            Better PT means fewer cars competing for road space during peak
            hours. When your neighbour catches the train instead of driving, the
            motorway is less congested — for both of you.
          </p>
          <p>
            It also means less pressure to widen roads and build new car parks
            at enormous taxpayer expense. That public money can be redirected to
            road maintenance, safety improvements, and the services you rely on.
          </p>
          <p>
            And on the days when driving isn&apos;t ideal — major events, bad
            weather, or when parking is impossible — a reliable PT network gives
            you a genuine backup plan.
          </p>
          <p>
            <strong className="text-heading">
              Everyone benefits when public transport works.
            </strong>{' '}
            Whether you ride it daily, occasionally, or never — investment in PT
            makes Queensland a better place to live.
          </p>
        </div>
      </Container>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function WhyPublicTransport() {
  return (
    <main className="overflow-hidden">
      <HeroBanner
        title="Why Public Transport?"
        lead="Better public transport benefits everyone — riders, drivers, and the communities in between. Here's why it matters and how to get started."
      />

      <div className="space-y-20 py-20 sm:space-y-28 sm:py-28">
        <WhyItMatters />

        {/* Scenic image break */}
        <Container>
          <figure className="overflow-hidden rounded-lg">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/BrisbaneCombinationTramVictoriaBridge1906.jpg/960px-BrisbaneCombinationTramVictoriaBridge1906.jpg"
              alt="An electric tram crossing Victoria Bridge in Brisbane, circa 1906"
              loading="lazy"
              className="w-full object-cover"
            />
            <figcaption className="caption">
              Brisbane once had a world-class tram network. An electric tram
              crosses Victoria Bridge, c.&nbsp;1906.{' '}
              <a
                href="https://commons.wikimedia.org/wiki/File:BrisbaneCombinationTramVictoriaBridge1906.jpg"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Wikimedia Commons
              </a>{' '}
              · Public domain
            </figcaption>
          </figure>
        </Container>

        <EnvironmentImpact />
        <GettingStarted />
        <DriversSection />
      </div>
    </main>
  )
}
