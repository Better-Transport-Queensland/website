import { fetchRSSFeedWithCache, type RSSItem } from '@/app/layout'
import { Card } from '@/components/card'
import { LocalTime } from '@/components/local-time'
import { Lead } from '@/components/text'
import parse, * as parser from 'html-react-parser'
import DOMPurify from 'isomorphic-dompurify'
import type { ReactNode } from 'react'

async function fetchPosts(url: string, cacheKey: string): Promise<RSSItem[]> {
  const feed = await fetchRSSFeedWithCache(cacheKey, url)
  return feed?.items || []
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
    `<div[^>]*data-wrap="${id}"[^>]*>([\\s\\S]*?)<\\/div>`,
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
  feedUrl: string
  cacheKey: string
  redirectRoute: string
  showAuthor?: boolean
}) {
  const posts = await fetchPosts(params.feedUrl, params.cacheKey)

  // Remove the last post from the list
  posts.pop()

  // Conditional rendering based on the existence of posts
  return posts.length === 0 ? (
    <p className="mt-3 text-gray-500">
      No posts available at the moment. Please try again later.
    </p>
  ) : (
    <ul className="mt-3">
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
          <div className="flex flex-col gap-4 sm:flex-row lg:block">
            {/* Image Section */}
            <div className="w-full sm:mb-4 sm:max-w-64 lg:float-left lg:mr-4 lg:mb-1 lg:w-64">
              {TryGetDomWithDataWrapId(
                post.content,
                'summary-image',
                {
                  replace: (node: parser.DOMNode) => {
                    if (node instanceof parser.Element) {
                      switch (node.name) {
                        case 'img':
                          node.attribs.class ||= ''
                          node.attribs.class += 'rounded-md shadow-md'
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
              )}
            </div>

            {/* Title Section */}
            <div>
              <Lead>{post.title}</Lead>
              <div className="mb-2">
                {params.showAuthor ? <>@{post.creator} </> : null}
                {<LocalTime date={new Date(post.pubDate || '')} />}
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div>{TryGetDomWithDataWrapId(post.content, 'summary')}</div>
        </Card>
      ))}
    </ul>
  )
}
