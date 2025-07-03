import { Card } from '@/components/card'
import { LocalTime } from '@/components/local-time'
import { Subheading } from '@/components/text'
import {
  fetchPostsFromCategory,
  type RSSItem,
} from '@/helpers/discourseTopicHelper'
import parse, * as parser from 'html-react-parser'
import DOMPurify from 'isomorphic-dompurify'
import type { ReactNode } from 'react'

async function fetchPosts(categoryId: string): Promise<RSSItem[]> {
  const feed = await fetchPostsFromCategory(categoryId)
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
                            'w-full lg:w-64 h-auto rounded-md shadow-md object-contain'
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
                <img
                  src="banner.png"
                  className="h-auto w-full rounded-md object-contain shadow-md lg:w-64"
                />
              )}
            </div>

            {/* Title & Summary Section */}
            <div className="flex flex-col self-start">
              <Subheading>{post.title}</Subheading>
              <div className="mb-2">
                {params.showAuthor ? <>@{post.creator} </> : null}
                {<LocalTime date={new Date(post.pubDate || '')} />}
              </div>
              <div>{TryGetDomWithDataWrapId(post.content, 'summary')}</div>
            </div>
          </div>
        </Card>
      ))}
    </ul>
  )
}
