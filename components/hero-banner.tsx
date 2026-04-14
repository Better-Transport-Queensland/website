import { Container } from '@/components/core/container'
import { Heading, Lead } from '@/components/core/text'
import { Navbar } from '@/components/navbar/navbar'
import type { ReactNode } from 'react'

export function HeroBanner({
  title,
  lead,
  children,
}: {
  title: string
  lead: string
  children?: ReactNode
}) {
  return (
    <div className="bg-brand-gradient">
      <Container className="relative">
        <Navbar filled />
        <div className="pb-16 pt-8">
          <Heading as="h1" dark>
            {title}
          </Heading>
          <Lead className="mt-4 max-w-2xl text-on-brand">{lead}</Lead>
          {children}
        </div>
      </Container>
    </div>
  )
}
