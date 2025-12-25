import { Button } from '@/components/core/button'
import { Container } from '@/components/core/container'
import { Footer } from '@/components/footer/footer'
import { Navbar } from '@/components/navbar/navbar'
import '@/styles/tailwind.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: {
    index: false, // Prevent indexing
    follow: false, // Prevent following links
  },
}

export default function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col font-sans text-gray-950 antialiased">
      <div className="flex grow flex-col overflow-hidden">
        <Container>
          <Navbar />
        </Container>
        <main className="grow">
          <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
              <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
                Page not found
              </h1>
              <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
                Sorry, we couldn't find the page you're looking for.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button href="/" variant="primary">
                  Go back home
                </Button>
              </div>
            </div>
          </main>
        </main>

        <Footer />
      </div>
    </div>
  )
}
