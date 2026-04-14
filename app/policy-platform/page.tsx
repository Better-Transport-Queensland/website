import { createPageMetadata } from '@/app/layout'
import { Button } from '@/components/core/button'
import { Container } from '@/components/core/container'
import { Footer } from '@/components/footer/footer'
import { DisableFooter } from '@/components/footer/footer-provider'
import { HeroBanner } from '@/components/hero-banner'
import type { Metadata } from 'next'

export const metadata: Metadata = createPageMetadata({
  title: 'Policy Platform',
  description:
    "The Policy Platform sets out Better Transport Queensland's (BTQ's) strategic vision for a safer, more accessible, and better-integrated transport system across the state. It outlines key priorities for public, active, and freight transport in Queensland.",
  slug: 'policy-platform',
})

const policyDocumentPdf =
  'https://forum.bettertransportqueensland.org/uploads/short-url/gq4IxO4BzgDkkXwibIuwLt6Y8aU.pdf'

export default function Page() {
  return (
    <>
      {/* Page requires bare footer in CTA. Disable default footer */}
      <DisableFooter />
      <main className="flex min-h-screen flex-col overflow-hidden">
        <HeroBanner
          title="Policy Platform"
          lead="Our strategic vision for a safer, more accessible, and better-integrated transport system across Queensland — grounded in evidence and shaped by community input."
        >
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              href={policyDocumentPdf}
              variant="primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download the 2025 Policy Platform
            </Button>
            <span className="text-sm text-indigo-200/70">PDF · 2.4 MB</span>
          </div>
        </HeroBanner>

        <div className="grow">
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
                    src={policyDocumentPdf}
                    className="absolute inset-0 h-full w-full border-none"
                    title="BTQ Policy Platform PDF"
                  />
                </div>
              </div>

              {/* Mobile fallback */}
              <div className="mt-8 text-center lg:hidden">
                <p className="text-muted text-sm">
                  The embedded PDF viewer is available on larger screens.
                </p>
                <Button
                  href={policyDocumentPdf}
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
