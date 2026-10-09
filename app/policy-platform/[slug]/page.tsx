import { createPageMetadata } from '@/app/layout'
import { PolicyPlatformEditionPage } from '@/components/policy-platform-edition'
import {
  currentPolicyPlatform,
  getPolicyPlatform,
  pastPolicyPlatforms,
} from '@/data/policy-platform'
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

type Params = { params: Promise<{ slug: string }> }

/** Only superseded editions get their own page; the current one lives at /policy-platform. */
export function generateStaticParams() {
  return pastPolicyPlatforms.map((edition) => ({ slug: edition.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const edition = getPolicyPlatform(slug)

  if (!edition) {
    return createPageMetadata({
      title: 'Policy Platform',
      description:
        "Better Transport Queensland's policy platform archive of previous editions.",
      slug: 'policy-platform',
    })
  }

  return createPageMetadata({
    title: `${edition.label} Policy Platform`,
    description: `The archived ${edition.label} edition of Better Transport Queensland's Policy Platform, setting out our priorities for public, active, and freight transport in Queensland.`,
    slug: `policy-platform/${edition.slug}`,
  })
}

export default async function Page({ params }: Params) {
  const { slug } = await params

  // The current edition is canonically at /policy-platform.
  if (slug === currentPolicyPlatform.slug) {
    redirect('/policy-platform')
  }

  const edition = getPolicyPlatform(slug)

  if (!edition) {
    notFound()
  }

  return <PolicyPlatformEditionPage edition={edition} archived />
}
