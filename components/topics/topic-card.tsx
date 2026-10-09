import { Card } from '@/components/core/card'
import { Subheading } from '@/components/core/text'
import { LocalTime } from '@/components/localised/local-time'
import type { TopicCardData } from '@/lib/discourse/card-data'
import parse, * as parser from 'html-react-parser'
import Image from 'next/image'
import type { ReactNode } from 'react'
import React from 'react'

type Props = {
  children?: React.ReactNode
}

function stripBoldingAndEmphasis(node: React.ReactNode): React.ReactNode {
  if (typeof node === 'string' || typeof node === 'number' || node == null) {
    return node // plain text, number, or null — return as is
  }

  if (Array.isArray(node)) {
    return node.map((child, i) => (
      <React.Fragment key={i}>{stripBoldingAndEmphasis(child)}</React.Fragment>
    ))
  }

  if (React.isValidElement<Props>(node)) {
    const element = node // typed as React.ReactElement<Props>
    const tag =
      typeof element.type === 'string' ? element.type.toLowerCase() : null

    if (tag && ['b', 'strong', 'em', 'i'].includes(tag)) {
      return <>{stripBoldingAndEmphasis(element.props.children)}</>
    }

    return React.cloneElement(
      element,
      { ...element.props },
      stripBoldingAndEmphasis(element.props.children),
    )
  }

  return null // fallback for anything unexpected
}

/**
 * The summary fragment is extracted and sanitised when the cache entry is
 * built (lib/discourse/transform.ts), so this parses an already-isolated,
 * already-sanitised fragment.
 */
function renderSummary(card: TopicCardData): ReactNode {
  if (!card.summaryHtml) return null
  return stripBoldingAndEmphasis(parse(card.summaryHtml))
}

/**
 * Rebuild Discourse's image rather than rendering its markup as-is.
 *
 * Discourse emits intrinsic `width`/`height` attributes (e.g. 690×460) plus
 * lightbox bookkeeping. Left in place those fight `object-cover` and
 * `aspect-[16/9]`, which is why embedded-topic.tsx's renderWithTailwind
 * rebuilds images instead of passing them through. Keep `src`, `srcset` and
 * `alt` so the browser still picks a resolution and the image stays
 * described; drop the rest and let the wrapper own the geometry.
 */
function renderSummaryImage(card: TopicCardData): ReactNode {
  if (!card.summaryImageHtml) return null
  return parse(card.summaryImageHtml, {
    replace: (node: parser.DOMNode) => {
      if (node instanceof parser.Element && node.name === 'img') {
        const { src, srcset, alt } = node.attribs
        node.attribs = {
          ...(src ? { src } : {}),
          ...(srcset ? { srcset } : {}),
          alt: alt ?? '',
          class: 'aspect-[16/9] h-auto w-full object-cover',
        }
        return (
          <div className="w-full overflow-hidden rounded-md shadow-md lg:w-64">
            {parser.domToReact([node])}
          </div>
        )
      }
      return node
    },
  })
}

function PlaceholderImage({ src }: { src: string }) {
  return (
    <div className="relative aspect-[16/9] w-full lg:w-64">
      <Image
        alt="Better Transport Queensland logo with airport train on viaduct in the background."
        src={src}
        fill
        className="rounded-md object-cover shadow-md"
      />
    </div>
  )
}

export function TopicCard({
  card,
  showAuthor,
}: {
  card: TopicCardData
  showAuthor?: boolean
}) {
  return (
    // `block` is required: Card renders a bare <a>, and .surface-card sets no
    // display. The old markup put that anchor directly inside the flex <ul>,
    // which blockified it; now it sits in a semantic <li>, so without this it
    // falls back to display:inline and the padded card layout collapses.
    <Card link={card.href} className="block">
      <div className="flex flex-col items-start gap-4 lg:grid lg:grid-cols-[16rem_1fr]">
        {/* Image Section */}
        <div className="flex w-full items-center justify-center lg:w-64">
          {renderSummaryImage(card) ??
            (card.indexImageUrl ? (
              <PlaceholderImage src={card.indexImageUrl} />
            ) : (
              <PlaceholderImage src="/banner.png" />
            ))}
        </div>

        {/* Title & Summary Section */}
        <div className="flex flex-col self-start">
          <Subheading>{card.title}</Subheading>
          <div className="mb-2">
            {showAuthor ? <>@{card.author} </> : null}
            {<LocalTime date={new Date(card.createdAt)} />}
          </div>
          <div>{renderSummary(card) ?? card.excerpt}</div>
        </div>
      </div>
    </Card>
  )
}
