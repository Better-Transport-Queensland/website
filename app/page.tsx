import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { Link } from '@/components/link'
import { Navbar } from '@/components/navbar'
import { Heading, Lead } from '@/components/text'
import { ChevronRightIcon } from '@heroicons/react/16/solid'
import type { Metadata } from 'next'
import Image from 'next/image'
import { createPageMetadata } from './layout'

export const metadata: Metadata = createPageMetadata({
  title: undefined,
  description:
    'Better Transport Queensland champions sustainable public and active transport while promoting efficient regional transport and freight rail solutions for a connected and greener future.',
  slug: undefined, // If no specific slug is needed, leave it as an empty string
})

function Hero() {
  return (
    <div className="mx-2 rounded-4xl bg-indigo-800 selection:bg-pink-400 selection:text-indigo-800">
      <Container className="relative">
        <Navbar
          banner={
            <Link
              href="https://forum.bettertransportqueensland.org/t/notice-of-general-special-general-and-policy-meetings-april-6th-2025/346"
              className="flex items-center gap-1 rounded-full bg-indigo-500 px-3 py-0.5 text-sm/6 font-medium text-white transition duration-200 ease-out data-[hover]:bg-indigo-600"
            >
              Join us for our 2025 Policy Platform
              <ChevronRightIcon className="size-4" />
            </Link>
          }
          filled
        />
        <div className="pb-24 pt-16 sm:pb-32 sm:pt-24 md:pb-48 md:pt-32">
          <h1 className="font-display text-balance text-4xl/[0.9] font-medium tracking-tight text-gray-200 sm:text-6xl/[0.8] md:text-7xl/[0.8]">
            Better Transport Queensland
          </h1>
          <p className="mt-8 max-w-lg text-xl/7 font-medium text-gray-200 sm:text-2xl/8">
            Queensland's leading advocacy group for public, active, and freight
            transport.
          </p>
          <div className="mt-12 flex flex-col gap-x-6 gap-y-4 sm:flex-row">
            <Button
              variant="primary"
              href="https://forum.bettertransportqueensland.org"
            >
              Join the Conversation
            </Button>
            <Button variant="secondary" href="/member">
              Become a member
            </Button>
          </div>
        </div>
      </Container>
    </div>
  )
}

function UpcomingEvents() {
  return (
    <div className="overflow-hidden">
      <Container className="pb-24">
        <Heading>2025 Policy Platform - Match 6th</Heading>
        <Lead className="mt-6 max-w-3xl">
          Join us for our inaugural policy platform on March 6th at Kenmore
          Library! This is your opportunity to shape the future of transport in
          Queensland and make your voice heard.
        </Lead>
        <Button
          className="mt-6"
          variant="primary"
          href="https://forum.bettertransportqueensland.org/t/notice-of-general-special-general-and-policy-meetings-april-6th-2025/346"
        >
          Learn more here
        </Button>
      </Container>
    </div>
  )
}

function FeatureSection() {
  return (
    <div className="overflow-hidden">
      <Container>
        <Heading as="h1">
          Empowering Queenslanders to Shape the Future of Transport!
        </Heading>
        <Lead className="mt-6 max-w-3xl">
          We’re on a mission to improve transport throughout Queensland. We
          advocate for public and active transport as well as regional transport
          and freight rail.
        </Lead>
        <section className="mt-16 grid grid-cols-1 lg:grid-cols-2">
          <div className="max-w-lg space-y-6">
            {/* Who are we? */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="border-b border-gray-200 pb-2 text-2xl font-medium tracking-tight">
                Who are we?
              </h2>
              <p className="text-md/6 mt-3 text-gray-600">
                Better Transport Queensland is a passionate not-for-profit
                advocacy group dedicated to creating a brighter, more connected
                future through better transportation solutions.
              </p>
            </div>

            {/* Our goals */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="border-b border-gray-200 pb-2 text-2xl font-medium tracking-tight">
                Our goals
              </h2>
              <p className="text-md/6 mt-3 text-gray-600">
                We believe Queensland’s brighter future starts with world-class
                public, active, and freight transport systems. Our goal is to
                shift the narrative on Queensland's transport away from
                car-centric ideologies and towards research-driven investments
                in cutting-edge transport solutions.
              </p>
            </div>
            {/* Our mission */}
            <div className="space-y-6 rounded-lg bg-white p-6 shadow-md">
              <h2 className="border-b border-gray-200 pb-2 text-2xl font-medium tracking-tight">
                Our Mission
              </h2>
              <p className="text-md/6 mt-3 text-gray-600">
                Our mission is to drive meaningful change by championing
                investments in active and public transport as well as regional
                freight rail.
              </p>

              {/* Subsections */}
              <div className="space-y-4">
                {/* Congestion */}
                <div>
                  <h3 className="mt-4 text-lg font-semibold text-indigo-800">
                    Congestion
                  </h3>
                  <p className="text-md/6 mt-2 text-gray-600">
                    Public and active transport are vital for reducing urban
                    congestion. The current approach of widening roads and
                    freeways is a temporary solution, as induced demand only
                    perpetuates the cycle. The most effective way to address
                    congestion is by providing world-class, mass transportation
                    systems that connect people to where they live, work, and
                    thrive.
                  </p>
                </div>

                {/* Environmental Impact */}
                <div>
                  <h3 className="mt-4 text-lg font-semibold text-indigo-800">
                    Environmental Impact
                  </h3>
                  <p className="text-md/6 mt-2 text-gray-600">
                    Reducing heavy vehicle traffic on major roads is essential
                    to protecting the environment and creating a sustainable
                    future. Freight transportation by heavy rail is
                    significantly more efficient than by single B-doubles.
                    Prioritizing key freight rail corridors, such as the North
                    Coast Line, can make a transformative difference.
                  </p>
                </div>

                {/* Social Benefits */}
                <div>
                  <h3 className="mt-4 text-lg font-semibold text-indigo-800">
                    Social Benefits
                  </h3>
                  <p className="text-md/6 mt-2 text-gray-600">
                    Enhancing public and active transport ensures equal
                    opportunities for all, regardless of personal vehicle
                    ownership. Improved transportation options empower
                    individuals to access employment, education, and social
                    activities, fostering inclusivity and stronger communities.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-20 lg:row-span-2 lg:-mr-16 xl:mr-auto">
            <div className="-mx-8 grid grid-cols-2 gap-4 sm:-mx-16 sm:grid-cols-4 lg:mx-0 lg:grid-cols-2 lg:gap-4 xl:gap-8">
              <div className="aspect-square overflow-hidden rounded-xl shadow-xl outline-1 -outline-offset-1 outline-black/10">
                <Image
                  alt=""
                  src="/group/1.jpg"
                  width={500}
                  height={500}
                  className="block size-full object-cover"
                />
              </div>
              <div className="-mt-8 aspect-square overflow-hidden rounded-xl shadow-xl outline-1 -outline-offset-1 outline-black/10 lg:-mt-32">
                <Image
                  alt=""
                  src="/group/2.jpg"
                  width={500}
                  height={500}
                  className="block size-full object-cover"
                />
              </div>
              <div className="aspect-square overflow-hidden rounded-xl shadow-xl outline-1 -outline-offset-1 outline-black/10">
                <Image
                  alt=""
                  src="/group/3.jpg"
                  width={500}
                  height={500}
                  className="block size-full object-cover"
                />
              </div>
              <div className="-mt-8 aspect-square overflow-hidden rounded-xl shadow-xl outline-1 -outline-offset-1 outline-black/10 lg:-mt-32">
                <Image
                  alt=""
                  src="/group/4.jpg"
                  width={500}
                  height={500}
                  className="block size-full object-cover"
                />
              </div>
            </div>
            <div className="pt-20">
              <Heading as="h2">Join the conversation on the BTQ Forum!</Heading>
              <Lead className="mt-6 max-w-3xl">
                Stay up-to-date with the latest insights directly from the
                Better Transport Queensland (BTQ) Forum. Connect with engaged
                community members, share your thoughts, and be part of the
                conversation—everyone is welcome!
              </Lead>
              <Button
                className="mt-6"
                variant="primary"
                href="https://forum.bettertransportqueensland.org/t/notice-of-general-special-general-and-policy-meetings-april-6th-2025/346"
              >
                Join the conversation
              </Button>
            </div>
          </div>
        </section>
      </Container>
    </div>
  )
}

export default function Home() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <main>
        <div className="py-32">
          <UpcomingEvents />
          <FeatureSection />
        </div>
      </main>

      <Footer filled />
    </div>
  )
}
