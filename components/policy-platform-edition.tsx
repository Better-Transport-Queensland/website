import { Button } from '@/components/core/button'
import { Container } from '@/components/core/container'
import { Footer } from '@/components/footer/footer'
import { DisableFooter } from '@/components/footer/footer-provider'
import { HeroBanner } from '@/components/hero-banner'
import type { PolicyPlatformEdition } from '@/data/policy-platform'
import { pastPolicyPlatforms } from '@/data/policy-platform'
import { ArrowRight, Download, Info } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

function PreviousEditionCard({ edition }: { edition: PolicyPlatformEdition }) {
  const href = `/policy-platform/${edition.slug}`

  return (
    <li className="surface-card flex flex-col overflow-hidden hover:shadow-md">
      <Link
        href={href}
        className="border-subtle relative block aspect-[16/9] border-b"
        aria-label={`View the ${edition.label} Policy Platform`}
        tabIndex={-1}
      >
        <Image
          alt=""
          src={edition.coverImage}
          fill
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </Link>
      <div className="flex grow flex-col p-5">
        <p className="text-muted text-xs font-semibold tracking-wider uppercase">
          Archived edition
        </p>
        <h3 className="heading-3 mt-1">{edition.label} Policy Platform</h3>
        <p className="text-muted mt-1 text-sm">{edition.pdfSize}</p>
        <div className="mt-auto flex flex-wrap gap-3 pt-5">
          <Button
            href={href}
            variant="primary"
            size="small"
            className="gap-1.5"
          >
            View edition
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
          <Button
            href={edition.pdfUrl}
            variant="outline"
            size="small"
            className="gap-1.5"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download className="h-4 w-4" aria-hidden />
            Download PDF
          </Button>
        </div>
      </div>
    </li>
  )
}

function PreviousEditions() {
  if (pastPolicyPlatforms.length === 0) {
    return null
  }

  return (
    <Container className="py-16">
      <p className="section-label">Archive</p>
      <h2 className="text-heading mt-2 text-2xl font-bold tracking-tight">
        Previous editions
      </h2>
      <p className="text-body mt-3 max-w-xl text-base">
        Superseded platforms remain available for reference, so you can see how
        our positions have developed over time.
      </p>
      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pastPolicyPlatforms.map((edition) => (
          <PreviousEditionCard key={edition.slug} edition={edition} />
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
          {/* PDF embed section */}
          <div className="border-t border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/50">
            <Container className="py-16">
              {archived && (
                <div className="mx-auto mb-12 flex max-w-[840px] items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900 dark:border-amber-700/70 dark:bg-amber-950/30 dark:text-amber-200">
                  <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
                  <p className="text-sm leading-relaxed">
                    This is an archived edition. Read our{' '}
                    <Link
                      href="/policy-platform"
                      className="font-medium underline"
                    >
                      current policy platform
                    </Link>{' '}
                    for Better Transport Queensland&apos;s latest positions.
                  </p>
                </div>
              )}

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
                <div className="border-subtle bg-page relative aspect-[1/1.414] max-h-[calc(100dvh-4rem)] w-full max-w-[840px] overflow-hidden rounded-lg border shadow-sm">
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
