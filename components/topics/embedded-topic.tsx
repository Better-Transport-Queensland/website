import { createPageMetadata } from '@/app/layout'
import { Button } from '@/components/core/button'
import { Heading, Lead, Subheading } from '@/components/core/text'
import { LocalTime } from '@/components/localised/local-time'
import { ShareSocialImage } from '@/components/topics/share-social-image'
import { categoryByTitle } from '@/lib/discourse/categories'
import { getTopicArticleByCategoryTitle } from '@/lib/discourse/topics.server'
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
  const post = await getTopicArticleByCategoryTitle(
    Number(topicId),
    categoryTitle,
  )
  const decodedTitle = decodeURIComponent(topicTitle).replace(/-/g, ' ')
  const imageUrl = post?.heroImageUrl ?? null

  const formattedDate = post?.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : ''

  const ogParams = new URLSearchParams({
    title: post?.title ?? decodedTitle,
    category: categoryTitle,
    ...(formattedDate ? { date: formattedDate } : {}),
    ...(imageUrl ? { image: imageUrl } : {}),
  })

  return {
    ...createPageMetadata({
      title: post?.title ?? 'Post Not Found',
      description: description,
      slug: `${slug}/${topicTitle}/${topicId}`,
    }),
    openGraph: {
      title: post?.title ?? decodedTitle,
      description,
      images: [
        {
          url: `/api/og?${ogParams.toString()}`,
          width: 1200,
          height: 630,
          alt: post?.title ?? decodedTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post?.title ?? decodedTitle,
      description,
      images: [`/api/og?${ogParams.toString()}`],
    },
  }
}

function renderWithTailwind(html: string) {
  let isFirstParagraph = true
  let isFirstVisibleParagraph = true

  return parse(html, {
    replace: (node: parser.DOMNode) => {
      if (node instanceof parser.Element) {
        switch (node.name) {
          case 'h1':
            node.attribs.class ||= ''
            node.attribs.class +=
              ' mt-10 mb-3 text-3xl font-bold tracking-tight text-heading'
            break
          case 'h2':
            node.attribs.class ||= ''
            node.attribs.class +=
              ' mt-8 mb-3 text-2xl font-bold tracking-tight text-heading'
            break
          case 'h3':
            node.attribs.class ||= ''
            node.attribs.class +=
              ' mt-6 mb-2 text-xl font-semibold text-heading'
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

            // Style the first visible paragraph as a prominent byline
            if (isFirstVisibleParagraph) {
              isFirstVisibleParagraph = false
              node.attribs.class ||= ''
              node.attribs.class +=
                ' mb-6 text-xl font-semibold leading-8 text-heading border-l-4 border-accent pl-4'
              break
            }

            node.attribs.class ||= ''
            node.attribs.class += ' mb-4 leading-7'
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
            node.attribs.class += `${isApproximately16by9 ? 'w-auto' : 'aspect-[16/9] w-full object-cover'}`

            if (node.attribs?.alt) {
              return (
                <figure className="my-6">
                  <div
                    className={`${isApproximately16by9 ? 'w-fit' : 'w-full'} overflow-hidden rounded-xl shadow-lg`}
                  >
                    {parser.domToReact([node])}
                  </div>
                  <figcaption className="text-muted mt-2 text-left text-sm italic">
                    {node.attribs.alt}
                  </figcaption>
                </figure>
              )
            }

            break
          case 'div':
            // Discourse attaches a lightbox metadata block to uploaded images
            // containing the filename and intrinsic size ("1920×1441 800 KB").
            // That is forum UI chrome; here it renders as stray text under
            // every image, so drop it.
            if ((node.attribs.class ?? '').split(/\s+/).includes('meta')) {
              return <></>
            }
            break
          case 'hr':
            // A thematic break is content, not chrome, so it uses the
            // higher-contrast divider token rather than --surface-border,
            // which is nearly invisible in both themes.
            return <hr className="border-divider my-10 border-t" />
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
                ' link-accent font-medium underline underline-offset-2'
            }
            break
          case 'ul':
            node.attribs.class ||= ''
            node.attribs.class += ' mb-4 list-disc space-y-1 pl-6'
            break
          case 'ol':
            node.attribs.class ||= ''
            node.attribs.class += ' mb-4 list-decimal space-y-1 pl-6'
            break
          case 'li':
            node.attribs.class ||= ''
            node.attribs.class += ' leading-7'
            break
          case 'blockquote':
            node.attribs.class ||= ''
            node.attribs.class +=
              ' my-6 border-l-4 border-accent pl-4 italic text-prose'
            break
          case 'strong':
          case 'b':
            node.attribs.class ||= ''
            node.attribs.class += ' font-semibold text-heading'
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
  const post = await getTopicArticleByCategoryTitle(
    Number(params.topicId),
    params.categoryTitle,
  )

  // Ensure proper conditional rendering
  if (!post) {
    notFound()
  }

  const cleanHtml = DOMPurify.sanitize(post.cookedHtml || '').replaceAll(
    /<p.*?><a.*?>Read full topic<\/a><\/p>/g,
    '', // Strip the read full topic link so we can add our own CTA
  )

  const heroImageUrl = post.heroImageUrl

  // Announcements (/agm) has no listing route of its own, so it keeps falling
  // back to /blog exactly as it did before.
  const backRoute = categoryByTitle(params.categoryTitle)?.route
    ? `/${categoryByTitle(params.categoryTitle)!.route}`
    : '/blog'

  return (
    <article className="mx-auto max-w-3xl">
      {/* Back link */}
      <a
        href={backRoute}
        className="link-accent mb-6 inline-flex items-center gap-1.5 text-sm font-medium"
      >
        <span aria-hidden="true">&larr;</span>
        All {params.categoryTitle === 'Media Releases' ? 'releases' : 'posts'}
      </a>

      {/* Title & meta */}
      <Heading as="h1">{post.title}</Heading>
      {/* border-divider, matching the in-article <hr>: this rule separates
          content rather than acting as incidental chrome. */}
      <div className="border-divider text-muted mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-b pb-6 text-sm">
        {post.author && (
          <span>
            {params.showAuthor ? <>@{post.author} &middot; </> : null}
            <LocalTime date={new Date(post.createdAt)} />
          </span>
        )}
        <ShareSocialImage
          title={post.title}
          topicId={params.topicId}
          category={params.categoryTitle}
          imageUrl={heroImageUrl ?? undefined}
          date={
            post.createdAt
              ? new Date(post.createdAt).toLocaleDateString('en-AU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              : undefined
          }
        />
      </div>

      {/* Article body */}
      <div className="prose-btq text-prose mt-8 text-base/7">
        {renderWithTailwind(cleanHtml)}
      </div>

      {/* Forum CTA */}
      <div className="bg-brand-gradient mt-12 rounded-lg p-8 text-white sm:p-12">
        <Subheading as="h2" dark className="text-2xl">
          {params.linkToTopic
            ? 'See what others are saying about this post!'
            : 'Join the conversation on the BTQ Forum!'}
        </Subheading>
        <Lead className="text-on-brand mt-4 max-w-3xl">
          Stay up-to-date with the latest insights directly from the Better
          Transport Queensland (BTQ) Forum. Connect with engaged community
          members, share your thoughts, and be part of the conversation.
          Everyone is welcome!
        </Lead>
        <Button
          className="mt-6 w-full sm:w-auto"
          variant="primary"
          href={
            params.linkToTopic
              ? post.forumUrl
              : 'https://forum.bettertransportqueensland.org'
          }
        >
          {params.linkToTopic ? 'Read the comments' : 'Join the conversation'}
        </Button>
      </div>
    </article>
  )
}
