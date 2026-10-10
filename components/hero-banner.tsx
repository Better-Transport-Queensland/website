import { Container } from '@/components/core/container'
import { Heading, Lead } from '@/components/core/text'
import { Navbar } from '@/components/navbar/navbar'
import type { ReactNode } from 'react'

/**
 * The gradient header strip. `title`/`lead` are optional so a page can keep the
 * branded background and navigation without a hero heading — article pages do
 * this, since the post's own title is the page heading. The Navbar supplies its
 * own vertical padding, so the strip still has height when there is no text.
 */
export function HeroBanner({
  title,
  lead,
  children,
}: {
  title?: string
  lead?: string
  children?: ReactNode
}) {
  const hasHeroContent = Boolean(title || lead || children)

  return (
    <div className="bg-brand-gradient">
      <Container className="relative">
        <Navbar filled />
        {hasHeroContent && (
          <div className="pt-8 pb-16">
            {title && (
              <Heading as="h1" dark>
                {title}
              </Heading>
            )}
            {lead && (
              <Lead className="text-on-brand mt-4 max-w-2xl">{lead}</Lead>
            )}
            {children}
          </div>
        )}
      </Container>
    </div>
  )
}
