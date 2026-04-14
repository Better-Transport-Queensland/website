import { createPageMetadata } from '@/app/layout'
import { Card } from '@/components/core/card'
import { Container } from '@/components/core/container'
import { Lead, Subheading } from '@/components/core/text'
import { HeroBanner } from '@/components/hero-banner'
import type { Metadata } from 'next'

export const metadata: Metadata = createPageMetadata({
  title: 'Rolling Stock & Fleet',
  description:
    "Learn about the trains, buses, ferries, and light rail vehicles that make up Queensland's public transport fleet.",
  slug: 'fleet',
})

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
type Vehicle = {
  name: string
  type: string
  introduced: string
  status: string
  details: string[]
}

const trains: Vehicle[] = [
  {
    name: 'Electric Multiple Unit (EMU)',
    type: 'Suburban Electric Train',
    introduced: '1979–1994',
    status: 'Recently Retired',
    details: [
      '3-car sets, typically run as 6-car consists',
      'Built by Walkers Ltd and Asea Brown Boveri',
      'Served the SEQ suburban network for over 40 years',
      'Being replaced by NGR and future rolling stock',
    ],
  },
  {
    name: 'Interurban Multiple Unit (IMU/ICE)',
    type: 'Interurban Electric Train',
    introduced: '2000s',
    status: 'Active',
    details: [
      '3-car sets designed for longer-distance suburban services',
      'Higher seating capacity with 2+3 configuration',
      'Air-conditioned with improved passenger amenities',
      'Operates on longer routes like the Gold Coast and Sunshine Coast lines',
    ],
  },
  {
    name: 'New Generation Rollingstock (NGR)',
    type: 'Suburban Electric Train',
    introduced: '2016–present',
    status: 'Active',
    details: [
      '6-car articulated sets built by Bombardier/Alstom',
      'Capacity of approximately 964 passengers per set',
      'Controversial accessibility issues led to retrofitting',
      'Features CCTV, real-time passenger info, wider doorways',
    ],
  },
  {
    name: 'Diesel and Electric Tilt Trains',
    type: 'Long-Distance / Regional',
    introduced: '1998–2003',
    status: 'Active',
    details: [
      'Tilt technology for faster travel on curved regional tracks',
      'Spirit of Queensland: Brisbane to Cairns (economy & railbed class)',
      'Spirit of the Outback: Brisbane to Longreach',
      'Tilt Train: Brisbane to Bundaberg / Rockhampton',
    ],
  },
]

const buses: Vehicle[] = [
  {
    name: 'Standard Rigid Bus',
    type: '12.5m Low-Floor',
    introduced: 'Various',
    status: 'Active — largest fleet segment',
    details: [
      'Manufacturers include Volvo, Scania, and BCI',
      'Low-floor design for wheelchair and pram accessibility',
      'Typically seats 40–50 passengers',
      'Euro 6 emission standards on newer vehicles',
    ],
  },
  {
    name: 'Articulated / Bendy Bus',
    type: '18m Articulated',
    introduced: 'Various',
    status: 'Active on high-demand routes',
    details: [
      'Used on BUZ (high-frequency) routes and busways',
      'Capacity of 60–80+ passengers',
      'Pivoting joint allows navigation of tight turns',
      'Key routes: 111, 130, 140, 150, 160, 180',
    ],
  },
  {
    name: 'Electric Buses',
    type: 'Battery-Electric',
    introduced: '2024–present',
    status: 'Trial / early rollout',
    details: [
      "Part of Queensland's zero-emission bus transition",
      'Target: fully zero-emission fleet by 2040s',
      'Operating from select depots initially',
      'Quieter, smoother ride with zero tailpipe emissions',
    ],
  },
]

const ferries: Vehicle[] = [
  {
    name: 'CityCat',
    type: 'High-Speed Catamaran',
    introduced: '1996–present',
    status: 'Active — flagship ferry service',
    details: [
      'Capacity of approximately 162 passengers',
      'Operates on the Brisbane River from UQ to Northshore Hamilton',
      'Newer vessels (KittyCats) are smaller for lower-demand stops',
      "Fast, frequent, and one of Brisbane's most popular services",
    ],
  },
  {
    name: 'Cross River Ferries',
    type: 'Inner-City Ferry',
    introduced: 'Various',
    status: 'Active',
    details: [
      'Short cross-river hops connecting inner suburbs',
      'Serves routes like Holman Street to Thornton Street',
      'Part of the TransLink integrated ticketing network',
      'Operates every 10–15 minutes during peak',
    ],
  },
]

const lightRail: Vehicle[] = [
  {
    name: 'Flexity 2 (G:link)',
    type: 'Light Rail Vehicle',
    introduced: '2014–present',
    status: 'Active',
    details: [
      'Built by Bombardier (now Alstom) for the Gold Coast',
      '43.5 metres long, capacity of ~300 passengers',
      'Runs from Broadbeach South to Helensvale',
      'Further extensions to Burleigh Heads under construction',
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Components                                                         */
/* ------------------------------------------------------------------ */
function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="heading-3">{vehicle.name}</h3>
          <p className="text-muted text-sm">{vehicle.type}</p>
        </div>
        <span
          className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ${
            vehicle.status.toLowerCase().includes('retired') ||
            vehicle.status.toLowerCase().includes('being')
              ? 'badge-warning'
              : vehicle.status.toLowerCase().includes('trial')
                ? 'badge-info'
                : 'badge-success'
          }`}
        >
          {vehicle.status}
        </span>
      </div>
      <p className="text-muted mt-1 text-xs">
        Introduced: {vehicle.introduced}
      </p>
      <ul className="mt-4 space-y-1.5">
        {vehicle.details.map((d, i) => (
          <li key={i} className="text-body flex items-start gap-2 text-sm">
            <span className="bg-accent mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
            {d}
          </li>
        ))}
      </ul>
    </Card>
  )
}

function FleetSection({
  label,
  title,
  description,
  vehicles,
  image,
}: {
  label: string
  title: string
  description: string
  vehicles: Vehicle[]
  image?: {
    src: string
    alt: string
    caption: string
    href: string
    license: string
  }
}) {
  return (
    <Container>
      <div>
        <p className="section-label">{label}</p>
        <Subheading className="mt-2">{title}</Subheading>
        <Lead className="mt-4 max-w-2xl">{description}</Lead>
      </div>
      {image && (
        <figure className="mt-8 overflow-hidden rounded-lg">
          <img
            src={image.src}
            alt={image.alt}
            loading="lazy"
            className="w-full object-cover"
          />
          <figcaption className="caption">
            {image.caption}{' '}
            <a
              href={image.href}
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Wikimedia Commons
            </a>{' '}
            · {image.license}
          </figcaption>
        </figure>
      )}
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        {vehicles.map((v) => (
          <VehicleCard key={v.name} vehicle={v} />
        ))}
      </div>
    </Container>
  )
}

/* ------------------------------------------------------------------ */
/*  Key Lines                                                          */
/* ------------------------------------------------------------------ */
type RailLine = {
  name: string
  colour: string
  route: string
  frequency: string
}

const keyLines: RailLine[] = [
  {
    name: 'Beenleigh Line',
    colour: 'bg-yellow-500',
    route: 'City → Kuraby → Beenleigh',
    frequency: 'Every 15 min peak',
  },
  {
    name: 'Gold Coast Line',
    colour: 'bg-yellow-400',
    route: 'City → Beenleigh → Varsity Lakes',
    frequency: 'Every 30 min',
  },
  {
    name: 'Cleveland Line',
    colour: 'bg-amber-600',
    route: 'City → Manly → Cleveland',
    frequency: 'Every 15 min peak',
  },
  {
    name: 'Ferny Grove Line',
    colour: 'bg-blue-600',
    route: 'City → Newmarket → Ferny Grove',
    frequency: 'Every 15 min peak',
  },
  {
    name: 'Caboolture/Sunshine Coast',
    colour: 'bg-red-600',
    route: 'City → Caboolture → Nambour/Gympie',
    frequency: 'Every 15–30 min',
  },
  {
    name: 'Ipswich/Rosewood Line',
    colour: 'bg-gray-600',
    route: 'City → Ipswich → Rosewood',
    frequency: 'Every 15 min peak',
  },
  {
    name: 'Springfield Line',
    colour: 'bg-lime-600',
    route: 'City → Richlands → Springfield Central',
    frequency: 'Every 15 min peak',
  },
  {
    name: 'Airport Line',
    colour: 'bg-sky-500',
    route: 'City → Airport (Domestic & International)',
    frequency: 'Every 15–30 min',
  },
  {
    name: 'Redcliffe Peninsula',
    colour: 'bg-purple-600',
    route: 'City → Petrie → Kippa-Ring',
    frequency: 'Every 15 min peak',
  },
  {
    name: 'Doomben Line',
    colour: 'bg-emerald-600',
    route: 'City → Ascot → Doomben',
    frequency: 'Limited service',
  },
]

function KeyLines() {
  return (
    <div className="bg-subtle py-20">
      <Container>
        <div>
          <p className="section-label">Rail Network</p>
          <Subheading className="mt-2">SEQ Rail Lines</Subheading>
          <Lead className="mt-4 max-w-2xl">
            The suburban rail network is the backbone of South East
            Queensland&apos;s public transport system.
          </Lead>
        </div>

        <div className="border-subtle mt-10 overflow-hidden rounded-lg border">
          <table className="border-subtle min-w-full divide-y">
            <thead className="bg-(--surface-card-raised-bg)">
              <tr>
                <th className="text-muted px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase">
                  Line
                </th>
                <th className="text-muted hidden px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase sm:table-cell">
                  Route
                </th>
                <th className="text-muted px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase">
                  Frequency
                </th>
              </tr>
            </thead>
            <tbody className="border-subtle bg-page divide-y">
              {keyLines.map((line) => (
                <tr key={line.name}>
                  <td className="text-heading flex items-center gap-2 px-4 py-3 text-sm font-medium">
                    <span
                      className={`inline-block h-3 w-3 shrink-0 rounded-full ${line.colour}`}
                    />
                    {line.name}
                  </td>
                  <td className="text-muted hidden px-4 py-3 text-sm sm:table-cell">
                    {line.route}
                  </td>
                  <td className="text-muted px-4 py-3 text-sm">
                    {line.frequency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function FleetPage() {
  return (
    <main className="overflow-hidden">
      <HeroBanner
        title="Rolling Stock & Fleet"
        lead="Get to know the trains, buses, ferries, and light rail vehicles that keep Queensland moving."
      />

      <div className="space-y-20 py-20 sm:space-y-28 sm:py-28">
        <FleetSection
          label="Trains"
          title="Rail Fleet"
          description="From heritage EMUs to the brand-new NGR sets, Queensland's rail fleet spans decades of rolling stock evolution."
          vehicles={trains}
          image={{
            src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/EMU702BHI.jpg/960px-EMU702BHI.jpg',
            alt: 'New Generation Rollingstock (NGR) train 702 under test at Bowen Hills station, Brisbane',
            caption: 'NGR 702 under test at Bowen Hills, March 2017.',
            href: 'https://commons.wikimedia.org/wiki/File:EMU702BHI.jpg',
            license: 'CC BY-SA 4.0',
          }}
        />
        <KeyLines />
        <FleetSection
          label="Buses"
          title="Bus Fleet"
          description="TransLink's bus network is the workhorse of SEQ public transport, running thousands of services daily across hundreds of routes."
          vehicles={buses}
        />
        <FleetSection
          label="Ferries"
          title="Ferry Fleet"
          description="Brisbane's iconic CityCats and cross-river ferries provide scenic, traffic-free travel along the Brisbane River."
          vehicles={ferries}
          image={{
            src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/CityCat_Baneraba%2C_Brisbane.jpg/960px-CityCat_Baneraba%2C_Brisbane.jpg',
            alt: 'CityCat Baneraba ferry on the Brisbane River',
            caption: 'CityCat "Baneraba" on the Brisbane River.',
            href: 'https://commons.wikimedia.org/wiki/File:CityCat_Baneraba,_Brisbane.jpg',
            license: 'CC BY-SA 4.0',
          }}
        />
        <FleetSection
          label="Light Rail"
          title="Gold Coast Light Rail"
          description="The G:link — Queensland's first modern light rail system — connects the Gold Coast's key destinations."
          vehicles={lightRail}
          image={{
            src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Glink-07.jpg/960px-Glink-07.jpg',
            alt: 'A Bombardier Flexity 2 light rail vehicle on the Gold Coast G:link system',
            caption: 'A Bombardier Flexity 2 on the G:link, Gold Coast.',
            href: 'https://commons.wikimedia.org/wiki/File:Glink-07.jpg',
            license: 'CC BY 2.0',
          }}
        />
      </div>
    </main>
  )
}
