import { createPageMetadata } from '@/app/layout'
import { PolicyPlatformEditionPage } from '@/components/policy-platform-edition'
import { currentPolicyPlatform } from '@/data/policy-platform'
import type { Metadata } from 'next'

export const metadata: Metadata = createPageMetadata({
  title: 'Policy Platform',
  description:
    "The Policy Platform sets out Better Transport Queensland's (BTQ's) strategic vision for a safer, more accessible, and better-integrated transport system across the state. It outlines key priorities for public, active, and freight transport in Queensland.",
  slug: 'policy-platform',
})

export default function Page() {
  return <PolicyPlatformEditionPage edition={currentPolicyPlatform} />
}
