import { Card } from '@/components/card'
import { LocalTime } from '@/components/local-time'
import { Subheading } from '@/components/text'
import {
  fetchPostsFromCategory,
  type RSSItem,
} from '@/helpers/discourseTopicHelper'
import parse, * as parser from 'html-react-parser'
import DOMPurify from 'isomorphic-dompurify'
import Image from 'next/image'
import type { ReactNode } from 'react'
import React from 'react'

async function fetchPosts(categoryId: string): Promise<RSSItem[]> {
  const feed = await fetchPostsFromCategory(categoryId)
  return feed?.items || []
}

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

function TryGetDomWithDataWrapId(
  content: string,
  id: string,
  htmlReactParserOptions?: parser.HTMLReactParserOptions,
  sanitisation?: (match: string) => string,
): ReactNode {
  const sanitizedContent = DOMPurify.sanitize(content || '')

  // Dynamically replace "summary" with the value of `id`
  const regex = new RegExp(
    `<([a-zA-Z0-9]+)([^>]*\\bdata-wrap\\s*=\\s*"${id}"[^>]*)>((?:(?!<\\/\\1>)[\\s\\S])*)<\\/\\1>`,
    'i',
  )

  let match = sanitizedContent.match(regex)?.[0] || null

  // Return the parsed DOM or null if no match is found
  if (match === null) {
    console.warn(`Unable to find content with data-wrap ${id}.`)
    return null
  }

  if (sanitisation !== undefined) {
    match = sanitisation(match)
  }

  return parse(match, htmlReactParserOptions)
}

export async function Snippets(params: {
  categoryId: string
  redirectRoute: string
  showAuthor?: boolean
}) {
  const posts = await fetchPosts(params.categoryId)

  // Remove the last post from the list
  posts.pop()

  // Conditional rendering based on the existence of posts
  return posts.length === 0 ? (
    <p className="mt-3 text-gray-500">
      No posts available at the moment. Please try again later.
    </p>
  ) : (
    <ul className="mt-3 flex flex-col gap-3">
      {posts.map((post: RSSItem, i: number) => (
        <Card
          key={i}
          link={
            `/${params.redirectRoute}/` +
            post.link.replace(
              'https://forum.bettertransportqueensland.org/t',
              '',
            )
          }
        >
          <div className="flex flex-col items-center gap-4 lg:grid lg:grid-cols-[16rem_1fr]">
            {/* Image Section */}
            <div className="flex w-full items-center justify-center lg:w-64">
              {TryGetDomWithDataWrapId(
                post.content,
                'summary-image',
                {
                  replace: (node: parser.DOMNode) => {
                    if (node instanceof parser.Element) {
                      switch (node.name) {
                        case 'img':
                          node.attribs.class ||= ''
                          node.attribs.class +=
                            'w-full lg:w-64 h-auto rounded-md shadow-md object-cover aspect-[16/9]'
                          break
                      }
                    }
                    return node
                  },
                },
                (value: string) => {
                  return (
                    value.match(
                      /<img\b[^>]*>(.*?)<\/img>|<img\b[^>]*\/?>/,
                    )?.[0] ?? ''
                  )
                },
              ) ?? (
                <div className="relative aspect-[16/9] w-full lg:w-64">
                  <Image
                    alt="Better Transport Queensland logo with airport train on viaduct in the background."
                    src="/banner.png"
                    fill
                    className="rounded-md object-cover shadow-md"
                  />
                </div>
              )}
            </div>

            {/* Title & Summary Section */}
            <div className="flex flex-col self-start">
              <Subheading>{post.title}</Subheading>
              <div className="mb-2">
                {params.showAuthor ? <>@{post.creator} </> : null}
                {<LocalTime date={new Date(post.pubDate || '')} />}
              </div>
              <div>
                {stripBoldingAndEmphasis(
                  TryGetDomWithDataWrapId(post.content, 'summary'),
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </ul>
  )
}
