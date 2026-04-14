import { createPageMetadata } from '@/app/layout'
import { Card } from '@/components/core/card'
import { Container } from '@/components/core/container'
import { Heading, Lead, Subheading } from '@/components/core/text'
import { HeroBanner } from '@/components/hero-banner'
import type { Metadata } from 'next'

export const metadata: Metadata = createPageMetadata({
  title: 'Accessibility',
  description:
    "Tracking accessibility upgrades across Queensland's public transport network — station lifts, platform improvements, and inclusive design progress.",
  slug: 'accessibility',
})

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
type Station = {
  name: string
  line: string
  lifts: 'yes' | 'partial' | 'no'
  tactile: boolean
  levelBoarding: boolean
  hearingLoop: boolean
  notes?: string
}

const stations: Station[] = [
  {
    name: 'Central',
    line: 'All Lines',
    lifts: 'yes',
    tactile: true,
    levelBoarding: true,
    hearingLoop: true,
  },
  {
    name: 'Roma Street',
    line: 'All Lines',
    lifts: 'yes',
    tactile: true,
    levelBoarding: true,
    hearingLoop: true,
  },
  {
    name: 'Fortitude Valley',
    line: 'All Lines',
    lifts: 'yes',
    tactile: true,
    levelBoarding: true,
    hearingLoop: true,
  },
  {
    name: 'South Brisbane',
    line: 'All Lines',
    lifts: 'yes',
    tactile: true,
    levelBoarding: true,
    hearingLoop: true,
  },
  {
    name: 'South Bank',
    line: 'All Lines',
    lifts: 'yes',
    tactile: true,
    levelBoarding: true,
    hearingLoop: true,
  },
  {
    name: 'Bowen Hills',
    line: 'Multiple',
    lifts: 'yes',
    tactile: true,
    levelBoarding: true,
    hearingLoop: false,
  },
  {
    name: 'Park Road',
    line: 'Beenleigh/Gold Coast',
    lifts: 'yes',
    tactile: true,
    levelBoarding: true,
    hearingLoop: false,
  },
  {
    name: 'Toowong',
    line: 'Ipswich/Springfield',
    lifts: 'yes',
    tactile: true,
    levelBoarding: false,
    hearingLoop: false,
    notes: 'Platform gap wider than standard',
  },
  {
    name: 'Indooroopilly',
    line: 'Ipswich/Springfield',
    lifts: 'yes',
    tactile: true,
    levelBoarding: false,
    hearingLoop: false,
  },
  {
    name: 'Milton',
    line: 'Ipswich/Springfield',
    lifts: 'partial',
    tactile: true,
    levelBoarding: false,
    hearingLoop: false,
    notes: 'Lift to one platform only',
  },
  {
    name: 'Auchenflower',
    line: 'Ipswich/Springfield',
    lifts: 'no',
    tactile: true,
    levelBoarding: false,
    hearingLoop: false,
    notes: 'Stairs only — no accessible path',
  },
  {
    name: 'Chelmer',
    line: 'Ipswich/Rosewood',
    lifts: 'no',
    tactile: false,
    levelBoarding: false,
    hearingLoop: false,
    notes: 'Unstaffed, no lifts, heritage platform',
  },
  {
    name: 'Graceville',
    line: 'Ipswich/Rosewood',
    lifts: 'no',
    tactile: false,
    levelBoarding: false,
    hearingLoop: false,
    notes: 'Steep ramp access only',
  },
  {
    name: 'Yeronga',
    line: 'Beenleigh/Gold Coast',
    lifts: 'no',
    tactile: true,
    levelBoarding: false,
    hearingLoop: false,
    notes: 'Under review for upgrade',
  },
  {
    name: 'Fairfield',
    line: 'Beenleigh/Gold Coast',
    lifts: 'no',
    tactile: true,
    levelBoarding: false,
    hearingLoop: false,
  },
  {
    name: 'East Ipswich',
    line: 'Ipswich/Rosewood',
    lifts: 'no',
    tactile: false,
    levelBoarding: false,
    hearingLoop: false,
    notes: 'Heritage station, limited access',
  },
  {
    name: 'Wooloowin',
    line: 'Caboolture/Sunshine Coast',
    lifts: 'no',
    tactile: true,
    levelBoarding: false,
    hearingLoop: false,
  },
  {
    name: 'Albion',
    line: 'Airport/Doomben',
    lifts: 'yes',
    tactile: true,
    levelBoarding: true,
    hearingLoop: false,
  },
  {
    name: 'Petrie',
    line: 'Caboolture/Redcliffe',
    lifts: 'yes',
    tactile: true,
    levelBoarding: true,
    hearingLoop: true,
    notes: 'Recently upgraded for Redcliffe Peninsula line',
  },
  {
    name: 'Springfield Central',
    line: 'Springfield',
    lifts: 'yes',
    tactile: true,
    levelBoarding: true,
    hearingLoop: true,
    notes: 'Modern station — fully accessible',
  },
]

type AccessibilityIssue = {
  title: string
  description: string
  severity: 'critical' | 'moderate' | 'improving'
}

const knownIssues: AccessibilityIssue[] = [
  {
    title: 'NGR Train Platform Gap',
    description:
      'The New Generation Rollingstock (NGR) trains were delivered with a platform gap and step that makes independent wheelchair boarding difficult at many stations. Retrofit boarding ramps and platform modifications are ongoing.',
    severity: 'critical',
  },
  {
    title: 'Older Stations Without Lifts',
    description:
      'Many suburban stations built before modern accessibility standards still lack lifts, forcing wheelchair users and people with prams to travel to alternative stations or use replacement transport.',
    severity: 'critical',
  },
  {
    title: 'Audio Announcements Inconsistency',
    description:
      'Real-time audio announcements are unreliable at some stations and on older rolling stock, creating challenges for vision-impaired passengers.',
    severity: 'moderate',
  },
  {
    title: 'Bus Stop Accessibility',
    description:
      'Many bus stops across SEQ lack concrete pads, shelters, or tactile indicators. Council and state funding is progressively upgrading priority stops.',
    severity: 'moderate',
  },
  {
    title: 'Cross River Rail Stations',
    description:
      'All four new underground CRR stations (Boggo Road, Woolloongabba, Albert Street, Roma Street) are being built to full modern accessibility standards with platform screen doors.',
    severity: 'improving',
  },
  {
    title: 'Station Upgrade Program',
    description:
      "The Queensland Government's Station Accessibility Upgrade Program is progressively adding lifts, tactile paths, and hearing loops to priority stations across the network.",
    severity: 'improving',
  },
]

type HighPriorityAction = {
  title: string
  summary: string
  whyItMatters: string
  policyActions: string[]
}

const highPriorityActions: HighPriorityAction[] = [
  {
    title: 'Accelerate Station Accessibility Upgrades',
    summary:
      'Bring stations to consistent full-access standards faster, rather than relying on incremental partial works.',
    whyItMatters:
      'Full-height, full-length accessible platforms reduce boarding risk and are central to timely DDA-aligned outcomes for passengers with disability, seniors, and pram users.',
    policyActions: [
      'Prioritise full-platform accessibility projects across the network as a staged program with published timelines.',
      'Reduce vertical and horizontal train-platform gaps to improve independent boarding.',
      'Avoid partial platform raising as a long-term default where full compliance remains unresolved.',
    ],
  },
  {
    title: 'Improve Bus Stop Infrastructure',
    summary:
      'Upgrade stops on high-frequency and high-demand routes to deliver shelter, comfort, and inclusive access in Queensland conditions.',
    whyItMatters:
      'Heat, humidity, heavy rain, and strong sun make poor stop design a safety and accessibility problem, not just an amenity issue.',
    policyActions: [
      'Deliver weather-protective shelter and shade at priority stops, especially where dwell times are high.',
      'Require DDA-compliant stop design or relocate non-compliant stops to nearby feasible sites.',
      'Pair stop upgrades with accessible footpaths and surrounding approaches so users can actually reach the stop safely.',
    ],
  },
  {
    title: 'Improve Bus Stop Crossing Facilities',
    summary:
      'Treat pedestrian access to and from bus stops as core transport infrastructure, not an afterthought.',
    whyItMatters:
      'Stops on high-speed roads without safe crossings force dangerous behaviour and can make access impossible for people with disability.',
    policyActions: [
      'Set annual assessment targets for stop access safety, including outbound and return walking trips.',
      'Install safe crossing facilities near priority stops where current access requires detours or unsafe crossing behaviour.',
      'Use pedestrian safety criteria in stop placement and upgrade sequencing.',
    ],
  },
  {
    title: 'Increase Density in Local Activity Centres',
    summary:
      'Align transport and land-use by prioritising denser, mixed-use local centres with high-frequency public transport.',
    whyItMatters:
      'Higher local density in amenity-rich centres supports shorter trips, better service viability, and 15-minute neighbourhood outcomes.',
    policyActions: [
      'Identify local centres suitable for uplift based on existing service, amenities, and walkability potential.',
      'Prioritise frequent bus corridors linking these centres to major destinations.',
      'Coordinate planning and transport investment so accessibility outcomes are built into growth decisions.',
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Components                                                         */
/* ------------------------------------------------------------------ */
function StatusBadge({
  value,
  label,
}: {
  value: boolean | string
  label: string
}) {
  if (typeof value === 'string') {
    // lifts: yes/partial/no
    const colour =
      value === 'yes'
        ? 'badge-success'
        : value === 'partial'
          ? 'badge-warning'
          : 'badge-danger'
    return (
      <span
        className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${colour}`}
      >
        {value === 'yes' ? '✓' : value === 'partial' ? '~' : '✗'} {label}
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
        value ? 'badge-success' : 'badge-danger'
      }`}
    >
      {value ? '✓' : '✗'} {label}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Sections                                                           */
/* ------------------------------------------------------------------ */
function Overview() {
  const total = stations.length
  const withLifts = stations.filter((s) => s.lifts === 'yes').length
  const withTactile = stations.filter((s) => s.tactile).length
  const withLevelBoarding = stations.filter((s) => s.levelBoarding).length

  const overviewStats = [
    { value: `${withLifts}/${total}`, label: 'Stations with full lift access' },
    {
      value: `${withTactile}/${total}`,
      label: 'Stations with tactile indicators',
    },
    {
      value: `${withLevelBoarding}/${total}`,
      label: 'Stations with level boarding',
    },
    {
      value: `${Math.round((withLifts / total) * 100)}%`,
      label: 'Lift coverage (sampled)',
    },
  ]

  return (
    <Container>
      <div className="text-center">
        <p className="section-label">At a Glance</p>
        <Heading as="h2" className="mx-auto mt-2 max-w-3xl">
          Network Accessibility Snapshot
        </Heading>
        <Lead className="mx-auto mt-4 max-w-2xl">
          A sample of station accessibility across the SEQ rail network. This is
          not exhaustive. We use this tracker to connect on-the-ground
          conditions with the policy priorities in BTQ&apos;s platform.
        </Lead>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-lg bg-(--surface-card-raised-border) shadow-sm sm:grid-cols-4">
        {overviewStats.map((stat) => (
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
  )
}

function StationTracker() {
  return (
    <div className="bg-subtle py-20">
      <Container>
        <div>
          <p className="section-label">Station by Station</p>
          <Subheading className="mt-2">Accessibility Tracker</Subheading>
          <Lead className="mt-4 max-w-2xl">
            Lift access, tactile paths, level boarding, and hearing loops across
            sampled SEQ stations.
          </Lead>
        </div>

        <div className="border-subtle mt-10 overflow-x-auto rounded-lg border">
          <table className="border-subtle min-w-full divide-y">
            <thead className="bg-(--surface-card-raised-bg)">
              <tr>
                <th className="text-muted px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase">
                  Station
                </th>
                <th className="text-muted hidden px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase sm:table-cell">
                  Line
                </th>
                <th className="text-muted px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase">
                  Accessibility
                </th>
                <th className="text-muted hidden px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase md:table-cell">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="border-subtle bg-page divide-y">
              {stations.map((s) => (
                <tr key={s.name}>
                  <td className="text-heading px-4 py-3 text-sm font-medium">
                    {s.name}
                  </td>
                  <td className="text-muted hidden px-4 py-3 text-sm sm:table-cell">
                    {s.line}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      <StatusBadge value={s.lifts} label="Lifts" />
                      <StatusBadge value={s.tactile} label="Tactile" />
                      <StatusBadge value={s.levelBoarding} label="Level" />
                      <StatusBadge value={s.hearingLoop} label="Hearing" />
                    </div>
                  </td>
                  <td className="text-muted hidden px-4 py-3 text-xs md:table-cell">
                    {s.notes ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-muted mt-4 text-center text-xs">
          Data is indicative and based on publicly available information.
          Stations are a representative sample, not the full network. Please
          contact TransLink for the latest accessibility information before
          travel.
        </p>
      </Container>
    </div>
  )
}

function KnownIssues() {
  return (
    <Container>
      <div>
        <p className="section-label">Progress &amp; Challenges</p>
        <Subheading className="mt-2">Known Accessibility Issues</Subheading>
        <Lead className="mt-4 max-w-2xl">
          What&apos;s being fixed, what still needs work, and where progress is
          being made.
        </Lead>
      </div>

      <figure className="mt-8 overflow-hidden rounded-lg">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/NGR_719_Disability_Upgrade.jpg/960px-NGR_719_Disability_Upgrade.jpg"
          alt="Interior of NGR train 719 after disability accessibility upgrade, showing new priority seats"
          loading="lazy"
          className="w-full object-cover"
        />
        <figcaption className="caption">
          Inside an NGR train after the disability accessibility retrofit — new
          priority seating and improved signage.{' '}
          <a
            href="https://commons.wikimedia.org/wiki/File:NGR_719_Disability_Upgrade.jpg"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Wikimedia Commons
          </a>{' '}
          · CC BY-SA 4.0
        </figcaption>
      </figure>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        {knownIssues.map((issue) => (
          <Card key={issue.title} className="p-6">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold uppercase ${
                  issue.severity === 'critical'
                    ? 'badge-danger'
                    : issue.severity === 'moderate'
                      ? 'badge-warning'
                      : 'badge-success'
                }`}
              >
                {issue.severity}
              </span>
            </div>
            <h3 className="heading-3 mt-3">{issue.title}</h3>
            <p className="text-body mt-2 text-sm/6">{issue.description}</p>
          </Card>
        ))}
      </div>
    </Container>
  )
}

function WhatWeCampaignFor() {
  const demands = [
    'Time-bound delivery plans for full station accessibility upgrades',
    'Bus stop standards that include shade, shelter, and DDA-compliant design',
    'Safe pedestrian crossings included in stop access planning and upgrades',
    'Relocation of stops that cannot achieve practical DDA compliance in place',
    'Transport and land-use coordination in local activity centres',
    'Public reporting against annual accessibility upgrade and access targets',
  ]

  return (
    <div className="bg-subtle py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="section-label">Our Position</p>
          <Subheading className="mt-2">
            Accessibility Delivery Priorities
          </Subheading>
          <Lead className="mt-4">
            We assess progress by whether policy commitments are converted into
            measurable delivery on the ground.
          </Lead>
        </div>

        <ul className="mx-auto mt-12 max-w-2xl space-y-4">
          {demands.map((d, i) => (
            <Card as="li" key={i} className="flex items-start gap-3 px-5 py-4">
              <svg
                className="text-accent mt-0.5 h-5 w-5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
              <span className="text-heading text-sm font-medium">{d}</span>
            </Card>
          ))}
        </ul>
      </Container>
    </div>
  )
}

function HighPriorityActions() {
  return (
    <Container>
      <div>
        <p className="section-label">From The Policy Platform</p>
        <Subheading className="mt-2">
          High Priority Accessibility Agenda
        </Subheading>
        <Lead className="mt-4 max-w-3xl">
          BTQ&apos;s accessibility priorities focus on closing the gap between
          policy intent and everyday passenger experience.
        </Lead>
      </div>

      <div className="mt-10 space-y-6">
        {highPriorityActions.map((action) => (
          <Card as="article" key={action.title} className="p-6">
            <div className="flex items-center gap-2">
              <span className="badge-danger inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold uppercase">
                High Priority
              </span>
            </div>
            <h3 className="heading-3 mt-3">{action.title}</h3>
            <p className="text-body mt-2 text-sm/6">{action.summary}</p>
            <p className="text-body mt-3 rounded-md bg-(--surface-card-raised-bg) px-3 py-2 text-sm">
              <span className="text-heading font-semibold">
                Why it matters:
              </span>{' '}
              {action.whyItMatters}
            </p>
            <ul className="mt-4 space-y-2">
              {action.policyActions.map((point) => (
                <li
                  key={point}
                  className="text-body flex items-start gap-3 text-sm/6"
                >
                  <span className="bg-accent mt-2 h-1.5 w-1.5 shrink-0 rounded-full" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </Container>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function AccessibilityPage() {
  return (
    <main className="overflow-hidden">
      <HeroBanner
        title="Accessibility"
        lead="A policy-led view of accessibility across Queensland's transport network: where barriers remain, what BTQ is prioritising, and how delivery should accelerate."
      />

      <div className="space-y-20 py-20 sm:space-y-28 sm:py-28">
        <Overview />
        <StationTracker />
        <KnownIssues />
        <HighPriorityActions />
        <WhatWeCampaignFor />
      </div>
    </main>
  )
}
