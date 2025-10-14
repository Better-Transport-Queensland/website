import { createPageMetadata } from '@/app/layout'
import { Button } from '@/components/button'
import { LocalTime } from '@/components/local-time'
import { Heading, Lead, Subheading } from '@/components/text'
import { fetchPostFromCategory } from '@/helpers/discourseTopicHelper'
import parse, * as parser from 'html-react-parser'
import DOMPurify from 'isomorphic-dompurify'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export async function generateMetadataFromTopic(
  categoryTitle: string,
  topicTitle: string,
  topicId: string,
  slug: string,
  description: string,
): Promise<Metadata> {
  const post = await fetchPostFromCategory(topicId, categoryTitle)

  return createPageMetadata({
    title: post?.title ?? 'Post Not Found',
    description: description,
    slug: `${slug}/${topicTitle}/${topicId}`,
  })
}

function renderWithTailwind(html: string) {
  let isFirstParagraph = true

  return parse(html, {
    replace: (node: parser.DOMNode) => {
      if (node instanceof parser.Element) {
        switch (node.name) {
          case 'h1':
            node.attribs.class ||= ''
            node.attribs.class += ' mb-2 text-3xl font-bold'
            break
          case 'h2':
            node.attribs.class ||= ''
            node.attribs.class += ' mb-2 text-2xl font-bold'
            break
          case 'h3':
            node.attribs.class ||= ''
            node.attribs.class += ' mb-2 text-xl font-bold'
            break
          case 'p':
            if (node.childNodes.length == 0) {
              return null
            }

            // This will remove the first paragraph only if it is italicised.
            // This allows media releases and blog posts to have content at
            // the start which only shows up on the forum.
            if (
              isFirstParagraph &&
              node.children.length == 1 &&
              node.firstChild instanceof parser.Element
            ) {
              isFirstParagraph = false

              const containsEm =
                (node.firstChild as parser.Element).name === 'em'
              if (containsEm) {
                node.children = []
                return null
              }
            }
            isFirstParagraph = false
            node.attribs.class ||= ''
            node.attribs.class += ' mb-4'
            break
          case 'em':
            break
          case 'img':
            // handle emojis
            if (
              node.attribs.src.startsWith(
                'https://forum.bettertransportqueensland.org/images/emoji',
              )
            ) {
              node.attribs.class =
                (node.attribs.class || '') + ' inline align-text-bottom ml-0.5'
              break
            }

            const aspectRatio =
              parseFloat(node.attribs.width) / parseFloat(node.attribs.height)
            const isApproximately16by9 = aspectRatio < 5 / 4
            // handle other images
            node.attribs.class ||= ''
            node.attribs.class += `${isApproximately16by9 ? 'w-fit' : 'aspect-[16/9] w-full  object-cover'}`

            if (node.attribs?.alt) {
              return (
                <div className={`${isApproximately16by9 ? 'w-fit' : 'w-full'}`}>
                  <div className={`overflow-hidden rounded-md shadow-md`}>
                    {parser.domToReact([node])}
                  </div>
                  <p className="mt-2 mb-4 text-sm text-gray-500">
                    {node.attribs.alt}
                  </p>
                </div>
              )
            }

            break
          case 'hr':
            node.attribs.class ||= ''
            node.attribs.class += ' my-6 border-t border-gray-300'
            break
          case 'a':
            if (
              node.children &&
              node.children.some(
                (child) =>
                  child instanceof parser.Element && child.name === 'img',
              )
            ) {
              delete node.attribs.href
            } else {
              node.attribs.class ||= ''
              node.attribs.class +=
                ' text-blue-500 underline hover:text-blue-600'
            }
            break
          case 'ul':
            node.attribs.class ||= ''
            node.attribs.class += ' mb-4 list-disc pl-8'
            break
          case 'ol':
            node.attribs.class ||= ''
            node.attribs.class += ' mb-4 list-decimal pl-8'
            break
          case 'li':
            node.attribs.class ||= ''
            node.attribs.class += ' mb-2'
            break
        }
      }
      return node
    },
  })
}

export default async function EmbeddedTopic(params: {
  topicTitle: string
  topicId: string
  categoryTitle: string
  showAuthor?: boolean
  linkToTopic?: boolean
}) {
  const post = await fetchPostFromCategory(params.topicId, params.categoryTitle)

  // Ensure proper conditional rendering
  if (!post) {
    notFound()
  }

  const cleanHtml = DOMPurify.sanitize(post.content || '').replaceAll(
    /<p.*?><a.*?>Read full topic<\/a><\/p>/g,
    '', // Strip the read full topic link so we can add our own CTA
  )

  return (
    <section className="mx-auto max-w-256">
      <Heading as="h1">{post.title}</Heading>
      <Lead className="pb-5">
        {post.creator && (
          <span className="mb-2">
            {params.showAuthor ? <>@{post.creator} </> : null}
            {<LocalTime date={new Date(post.pubDate || '')} />}
          </span>
        )}
      </Lead>
      <div>{renderWithTailwind(cleanHtml)}</div>
      <div className="mt-8 rounded-4xl bg-indigo-800 p-12 text-white selection:bg-pink-400 selection:text-indigo-800">
        <Subheading as="h2" dark className="text-2xl">
          {params.linkToTopic
            ? 'See what others are saying about this post!'
            : 'Join the conversation on the BTQ Forum!'}
        </Subheading>
        <Lead className="mt-6 max-w-3xl" data-dark="true">
          Stay up-to-date with the latest insights directly from the Better
          Transport Queensland (BTQ) Forum. Connect with engaged community
          members, share your thoughts, and be part of the conversation—everyone
          is welcome!
        </Lead>
        <Button
          className="mt-6 w-full sm:w-auto"
          variant="primary"
          href={
            params.linkToTopic
              ? post.link
              : 'https://forum.bettertransportqueensland.org'
          }
        >
          {params.linkToTopic ? 'Read the comments' : 'Join the conversation'}
        </Button>
      </div>
    </section>
  )
}
