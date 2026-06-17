'use client'
import { clsx } from 'clsx'
import Link from 'next/link'

export function Card({
  as: Element = 'div',
  children,
  link,
  className,
  target,
  rel,
}: {
  as?: 'div' | 'article' | 'li'
  children: React.ReactNode
  link?: string
  className?: string
  target?: string
  rel?: string
}) {
  const classes = clsx('surface-card p-6 hover:shadow-md', className)

  if (link) {
    return (
      <Link href={link} className={classes} target={target} rel={rel}>
        {children}
      </Link>
    )
  }

  return <Element className={classes}>{children}</Element>
}
