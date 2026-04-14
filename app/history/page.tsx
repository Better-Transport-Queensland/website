import { createPageMetadata } from '@/app/layout'
import { Container } from '@/components/core/container'
import { Heading, Lead, Subheading } from '@/components/core/text'
import { HeroBanner } from '@/components/hero-banner'
import type { Metadata } from 'next'

export const metadata: Metadata = createPageMetadata({
  title: 'Queensland Transport History',
  description:
    'From horse-drawn trams to electric rail — explore the fascinating history of public transport in Queensland and the networks we lost along the way.',
  slug: 'history',
})

/* ------------------------------------------------------------------ */
/*  Timeline Data                                                      */
/* ------------------------------------------------------------------ */
type TimelineEntry = {
  year: string
  title: string
  body: string
  highlight?: boolean
}

const timeline: TimelineEntry[] = [
  {
    year: '1882',
    title: 'Horse-Drawn Trams Begin',
    body: "Brisbane's first horse-drawn tramway opens along a route from the city to Breakfast Creek, marking the start of organised public transport in Queensland.",
  },
  {
    year: '1897',
    title: 'Electric Trams Arrive',
    body: 'Brisbane becomes one of the first cities in Australia to electrify its tram network. The system would eventually grow to over 50 routes covering the inner suburbs.',
  },
  {
    year: '1901',
    title: 'Federation & Rail Expansion',
    body: "Queensland's rail network expands rapidly to connect regional towns. By Federation, the state has thousands of kilometres of narrow-gauge track linking the coast to the interior.",
  },
  {
    year: '1930s',
    title: 'The Golden Age of Trams',
    body: "Brisbane's tram network reaches its peak with over 300 trams carrying tens of millions of passengers a year. Trams are the backbone of the city — fast, frequent, and reliable.",
    highlight: true,
  },
  {
    year: '1948',
    title: 'Trolley Buses Introduced',
    body: 'Electric trolley buses begin replacing some tram routes, promising "modern" transport. The first trolley bus services run from Kalinga to the city.',
  },
  {
    year: '1969',
    title: 'The Last Tram Runs',
    body: "Brisbane's final tram makes its last journey on 13 April 1969. The entire network is ripped up in favour of buses and cars — a decision many now regard as one of the city's greatest planning mistakes.",
    highlight: true,
  },
  {
    year: '1979',
    title: 'The Suburban Rail Crisis',
    body: 'Decades of underinvestment leave the rail network struggling. Ageing rolling stock and declining patronage raise questions about the future of trains in Brisbane.',
  },
  {
    year: '1996',
    title: 'Airtrain Opens',
    body: "The Airport rail link connects Brisbane Airport to the suburban network, giving the city one of Australia's few direct rail connections to an airport.",
  },
  {
    year: '2008',
    title: 'TransLink Established',
    body: 'The TransLink Transit Authority integrates ticketing and planning across bus, train, and ferry services in South East Queensland, introducing the go card.',
  },
  {
    year: '2014',
    title: 'Gold Coast Light Rail (G:link)',
    body: 'Queensland gets its first modern light rail system. The G:link runs along the Gold Coast from Broadbeach to Southport, later extended to Helensvale station.',
  },
  {
    year: '2016',
    title: 'New Generation Rollingstock',
    body: "The NGR trains enter service on the SEQ network — Queensland's first new suburban trains in over a decade, though not without controversy over accessibility issues.",
  },
  {
    year: '2024',
    title: 'Cross River Rail Under Construction',
    body: "The biggest public transport infrastructure project in Queensland's history takes shape. Cross River Rail will add a new underground rail line through the Brisbane CBD with four new stations.",
    highlight: true,
  },
  {
    year: '2032',
    title: 'Brisbane Olympics & Beyond',
    body: "The 2032 Olympic and Paralympic Games provide a once-in-a-generation opportunity to transform SEQ's transport network with new rail lines, upgraded stations, and better connectivity.",
    highlight: true,
  },
]

/* ------------------------------------------------------------------ */
/*  Sections                                                           */
/* ------------------------------------------------------------------ */
function Timeline() {
  return (
    <Container>
      <div className="text-center">
        <p className="section-label">Through the Decades</p>
        <Heading as="h2" className="mx-auto mt-2 max-w-2xl">
          A Timeline of Queensland Transport
        </Heading>
      </div>

      <div className="relative mx-auto mt-16 max-w-3xl">
        {/* Vertical line */}
        <div className="absolute top-0 bottom-0 left-5 w-px bg-(--surface-card-raised-border) sm:left-1/2" />

        <div className="space-y-12">
          {timeline.map((entry, i) => (
            <div
              key={entry.year}
              className={`relative flex flex-col sm:flex-row ${i % 2 === 0 ? 'pl-8 sm:flex-row-reverse' : ''}`}
            >
              {/* Dot */}
              <div className="absolute left-5 z-10 mt-1.5 -ml-2.5 sm:left-1/2">
                <div
                  className={`h-5 w-5 rounded-full border-4 ${
                    entry.highlight
                      ? 'border-(--color-primary) bg-(--icon-well-bg)'
                      : 'border-(--surface-card-raised-border) bg-(--surface-card-raised-bg)'
                  }`}
                />
              </div>

              {/* Content */}
              <div
                className={`ml-12 w-full sm:ml-0 sm:w-1/2 ${i % 2 === 0 ? 'sm:pr-12' : 'sm:pl-12'}`}
              >
                <span className="text-accent text-sm font-bold">
                  {entry.year}
                </span>
                <h3 className="heading-3 mt-1">{entry.title}</h3>
                <p className="text-body mt-2 text-sm/6">{entry.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  )
}

function TramLegacy() {
  return (
    <div className="bg-subtle py-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="section-label">The Trams We Lost</p>
          <Subheading className="mt-2">
            Brisbane&apos;s Tram Network: A Cautionary Tale
          </Subheading>

          <figure className="mt-8 overflow-hidden rounded-lg">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/BrisbaneCombinationTramVictoriaBridge1906.jpg/960px-BrisbaneCombinationTramVictoriaBridge1906.jpg"
              alt="Early electric tram at the northern end of Victoria Bridge, Brisbane, circa 1906"
              loading="lazy"
              className="w-full object-cover"
            />
            <figcaption className="caption">
              An early electric tram at Victoria Bridge, Brisbane, c.&nbsp;1906.{' '}
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

          <div className="text-prose mt-8 space-y-6 text-base/7">
            <p>
              For over 80 years, trams were the lifeblood of Brisbane. At their
              peak in the 1940s, the network carried more than 100 million
              passenger trips a year across over 50 routes. Trams were fast,
              affordable, and went everywhere people needed to go.
            </p>

            <figure className="overflow-hidden rounded-lg">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BrisbaneQueenStreet1947.jpg/960px-BrisbaneQueenStreet1947.jpg"
                alt="Dreadnought trams and other trams in Queen Street, Brisbane, 1947"
                loading="lazy"
                className="w-full object-cover"
              />
              <figcaption className="caption">
                Dreadnought trams in Queen Street, Brisbane, 1947.{' '}
                <a
                  href="https://commons.wikimedia.org/wiki/File:BrisbaneQueenStreet1947.jpg"
                  className="underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wikimedia Commons
                </a>{' '}
                · Public domain
              </figcaption>
            </figure>

            <p>
              The post-war love affair with the automobile changed everything.
              City planners saw trams as outdated obstacles to car traffic.
              Routes were progressively cut through the 1960s, and on 13 April
              1969, the last tram ran from Rainworth to the Depot. The tracks
              were torn up, overhead wires pulled down, and trams scrapped.
            </p>
            <p>
              Decades later, Brisbane is spending billions to build rail
              corridors through the CBD that the tram network already provided.
              Cities like Melbourne, which kept their trams, now have some of
              the best urban transport in the world.
            </p>
            <p>
              <strong className="text-heading">
                Brisbane&apos;s trams are a reminder:
              </strong>{' '}
              once you tear out public transport infrastructure, getting it back
              is phenomenally expensive. The lesson for today is clear — protect
              and invest in the networks we have.
            </p>
          </div>
        </div>
      </Container>
    </div>
  )
}

function LookingForward() {
  return (
    <Container>
      <div className="mx-auto max-w-3xl text-center">
        <p className="section-label">The Future</p>
        <Subheading className="mt-2">
          Learning From the Past, Building for Tomorrow
        </Subheading>
        <Lead className="mt-4">
          Queensland has a chance to get it right this time. Cross River Rail,
          the Gold Coast Light Rail extension, and the 2032 Olympics give us a
          generational opportunity to build the transport network our state
          deserves.
        </Lead>
        <Lead className="mt-4">
          Better Transport Queensland exists to make sure we don&apos;t repeat
          the mistakes of 1969.
        </Lead>
      </div>
    </Container>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function HistoryPage() {
  return (
    <main className="overflow-hidden">
      <HeroBanner
        title="Queensland Transport History"
        lead="From horse-drawn trams to Cross River Rail — the story of public transport in Queensland is one of ambition, loss, and renewal."
      />

      <div className="space-y-20 py-20 sm:space-y-28 sm:py-28">
        <Timeline />
        <TramLegacy />
        <LookingForward />
      </div>
    </main>
  )
}
