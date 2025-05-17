import '@/styles/tailwind.css'
import type { Metadata } from 'next'
import { Fira_Sans } from 'next/font/google'

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
      canonical: `https://www.bettertransportqueensland.org${params.slug ? `/${params.slug}` : ''}`,
    },
    openGraph: {
      title: params.title ?? 'Better Transport Queensland',
      description: params.description,
      siteName: 'Better Transport Queensland',
      url: `https://www.bettertransportqueensland.org${params.slug ? `/${params.slug}` : ''}`,
      images: [
        {
          url: 'https://www.bettertransportqueensland.org/banner.png',
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
      images: ['https://www.bettertransportqueensland.org/banner.png'],
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
