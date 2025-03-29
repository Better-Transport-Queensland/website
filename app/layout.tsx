import '@/styles/tailwind.css'
import type { Metadata } from 'next'
import { Fira_Sans } from 'next/font/google'
import NodeCache from 'node-cache'
import RSSParser from 'rss-parser'

export const cache = new NodeCache({ stdTTL: 900, checkperiod: 120 }) // 900 seconds = 15 minutes

export type RSSItem = {
  creator: string
  title: string
  link: string
  pubDate: string
  'dc:creator': string
  categories: string[]
  content: string
  contentSnippet: string
  guid: string
  isoDate: string
}

export type PaginationLinks = {
  self: string
}

export type RSSFeed = {
  title: string
  link: string
  language: string
  lastBuildDate: string
  paginationLinks: PaginationLinks
  self: string
  items: RSSItem[] // Array of individual RSS feed items
}

export const fetchRSSFeedWithCache = async (
  cacheKey: string,
  url: string,
): Promise<RSSFeed | null> => {
  if (cache.has(cacheKey)) {
    console.log('Cache hit') // Debug: Cache was used
    return cache.get(cacheKey) ?? null
  } else {
    console.log('Cache miss') // Debug: Cache wasn't used

    const parser = new RSSParser()

    try {
      const response: unknown = await parser.parseURL(url)
      cache.set(cacheKey, response) // Cache the feed for 15 minutes
      return (response as RSSFeed) ?? null
    } catch (error) {
      console.warn('Failed to fetch RSS feed:', error) // Log the error for debugging
      return null // Gracefully return null in case of an error
    }
  }
}

export const metadata: Metadata = {
  title: {
    template: '%s - Better Transport Queensland',
    default: 'Better Transport Queensland',
  },
  openGraph: {
    title: {
      template: '%s - Better Transport Queensland',
      default: 'Better Transport Queensland',
    },
  },
  twitter: {
    title: {
      template: '%s - Better Transport Queensland',
      default: 'Better Transport Queensland',
    },
  },
  // Robots metadata
  robots: {
    index: true,
    follow: true,
    nocache: false,
    noimageindex: false,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
}

export const createPageMetadata = (params: {
  title: string | undefined
  description: string
  slug: string | undefined
}): Metadata => {
  return {
    title: params.title ?? 'Better Transport Queensland',
    description: params.description,
    alternates: {
      canonical: `https://bettertransportqueensland.org/${params.slug}`,
    },
    openGraph: {
      title: params.title ?? 'Better Transport Queensland',
      description: params.description,
      siteName: 'Better Transport Queensland',
      url: `https://bettertransportqueensland.org${params.slug ? `/${params.slug}` : ''}`,
      images: [
        {
          url: 'https://bettertransportqueensland.org/banner.png',
          width: 1200,
          height: 630,
          alt: 'Better Transport Queensland Banner',
        },
      ],
      locale: 'en_AU',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: params.title ?? 'Better Transport Queensland',
      description: params.description,
      images: ['https://bettertransportqueensland.org/banner.png'],
    },
  }
}

// Configure the Fira Sans font
const firaSans = Fira_Sans({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], // Include desired font weights
})

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scrollbar-gutter-stable">
      <body
        className={`bg-[#f1f1f1] ${firaSans.className} text-gray-950 antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
