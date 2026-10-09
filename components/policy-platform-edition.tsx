import { Button } from '@/components/core/button'
import { Container } from '@/components/core/container'
import { Footer } from '@/components/footer/footer'
import { DisableFooter } from '@/components/footer/footer-provider'
import { HeroBanner } from '@/components/hero-banner'
import type { PolicyPlatformEdition } from '@/data/policy-platform'
import { pastPolicyPlatforms } from '@/data/policy-platform'

function PreviousEditions() {
  if (pastPolicyPlatforms.length === 0) {
    return null
  }

  return (
    <Container className="py-16">
      <h2 className="text-heading text-2xl font-bold tracking-tight">
        Previous editions
      </h2>
      <p className="text-body mt-3 max-w-xl text-base">
        Superseded platforms remain available for reference.
      </p>
      <ul className="mt-8 flex flex-wrap gap-4">
        {pastPolicyPlatforms.map((edition) => (
          <li key={edition.slug}>
            <Button href={`/policy-platform/${edition.slug}`} variant="outline">
              {edition.label} Policy Platform
            </Button>
          </li>
        ))}
      </ul>
    </Container>
  )
}

export function PolicyPlatformEditionPage({
  edition,
  archived = false,
}: {
  edition: PolicyPlatformEdition
  archived?: boolean
}) {
  return (
    <>
      {/* Page requires bare footer in CTA. Disable default footer */}
      <DisableFooter />
      <main className="flex min-h-screen flex-col overflow-hidden">
        <HeroBanner
          title={
            archived ? `${edition.label} Policy Platform` : 'Policy Platform'
          }
          lead={edition.lead}
        >
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              href={edition.pdfUrl}
              variant="primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download the {edition.label} Policy Platform
            </Button>
            <span className="text-sm text-indigo-200/70">
              {edition.pdfSize}
            </span>
          </div>
        </HeroBanner>

        <div className="grow">
          {archived && (
            <Container className="pt-12">
              <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900 dark:border-amber-700/70 dark:bg-amber-950/30 dark:text-amber-200">
                <p className="text-sm leading-relaxed">
                  This is an archived edition. Read our{' '}
                  <a href="/policy-platform" className="font-medium underline">
                    current policy platform
                  </a>{' '}
                  for Better Transport Queensland&apos;s latest positions.
                </p>
              </div>
            </Container>
          )}

          {/* PDF embed section */}
          <div className="border-t border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/50">
            <Container className="py-16">
              <div className="text-center">
                <h2 className="text-heading text-2xl font-bold tracking-tight">
                  Read the Document
                </h2>
                <p className="text-body mx-auto mt-3 max-w-xl text-base">
                  Browse the complete policy platform below, or download the PDF
                  to read offline.
                </p>
              </div>

              <div className="mt-10 hidden justify-center lg:flex">
                <div className="border-subtle bg-page relative aspect-[1/1.414] w-full max-w-[840px] overflow-hidden rounded-lg border shadow-sm">
                  <iframe
                    src={edition.pdfUrl}
                    className="absolute inset-0 h-full w-full border-none"
                    title={`BTQ ${edition.label} Policy Platform PDF`}
                  />
                </div>
              </div>

              {/* Mobile fallback */}
              <div className="mt-8 text-center lg:hidden">
                <p className="text-muted text-sm">
                  The embedded PDF viewer is available on larger screens.
                </p>
                <Button
                  href={edition.pdfUrl}
                  variant="primary"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4"
                >
                  Open PDF in New Tab
                </Button>
              </div>
            </Container>
          </div>

          {!archived && <PreviousEditions />}

          {/* CTA band + footer in one gradient */}
        </div>

        <div className="bg-brand-gradient">
          <Container className="py-16 text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Help shape the next edition
            </h2>
            <p className="text-on-brand mx-auto mt-3 max-w-xl">
              Our policy platform is a living document. Join BTQ to contribute
              your expertise, local knowledge, and ideas to the next revision.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/member" variant="primary">
                Become a Member
              </Button>
              <Button href="/contact" variant="secondary">
                Get in Touch
              </Button>
            </div>
          </Container>
          <Footer bare />
        </div>
      </main>
    </>
  )
}
