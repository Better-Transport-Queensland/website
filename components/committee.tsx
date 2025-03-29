'use client'

import { Container } from '@/components/container'
import { Link } from '@/components/link'
import { Heading } from '@/components/text'
import * as Headless from '@headlessui/react'
import { ArrowLongRightIcon } from '@heroicons/react/20/solid'
import { clsx } from 'clsx'
import {
  MotionValue,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  type HTMLMotionProps,
} from 'framer-motion'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import useMeasure, { type RectReadOnly } from 'react-use-measure'

const testimonials = [
  {
    img: '/committee/president.png',
    name: 'Rowan G',
    title: 'President',
    email: 'president@bettertransportqueensland.org',
  },
  {
    img: '/committee/treasurer.png',
    name: 'Marc ',
    title: 'Treasurer',
    email: 'treasurer@bettertransportqueensland.org',
  },
  {
    img: '/committee/secretary.png',
    name: 'Peter V',
    title: 'Secretary',
    email: 'secretary@bettertransportqueensland.org',
  },
  {
    img: '/committee/webmaster.png',
    name: 'Tristan D',
    title: 'Webmaster',
    email: 'webmaster@bettertransportqueensland.org',
  },
]

function CommitteeCard({
  name,
  title,
  img,
  email,
  bounds,
  scrollX,
  ...props
}: {
  img: string
  name: string
  title: string
  email: string
  bounds: RectReadOnly
  scrollX: MotionValue<number>
} & HTMLMotionProps<'div'>) {
  const ref = useRef<HTMLDivElement | null>(null)

  const computeOpacity = useCallback(() => {
    const element = ref.current
    if (!element || bounds.width === 0) return 1

    const rect = element.getBoundingClientRect()

    if (rect.left < bounds.left) {
      const diff = bounds.left - rect.left
      const percent = diff / rect.width
      return Math.max(0.5, 1 - percent)
    } else if (rect.right > bounds.right) {
      const diff = rect.right - bounds.right
      const percent = diff / rect.width
      return Math.max(0.5, 1 - percent)
    } else {
      return 1
    }
  }, [ref, bounds.width, bounds.left, bounds.right])

  const opacity = useSpring(computeOpacity(), {
    stiffness: 154,
    damping: 23,
  })

  useLayoutEffect(() => {
    opacity.set(computeOpacity())
  }, [computeOpacity, opacity])

  useMotionValueEvent(scrollX, 'change', () => {
    opacity.set(computeOpacity())
  })

  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      {...props}
      className="relative flex aspect-[3/4] w-56 shrink-0 snap-start scroll-ml-[var(--scroll-padding)] flex-col justify-end overflow-hidden rounded-3xl sm:w-64 lg:w-72"
    >
      <img
        alt=""
        src={img}
        className="absolute inset-x-0 top-0 aspect-square w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black from-[calc(7/16*100%)] ring-1 ring-gray-950/10 ring-inset sm:from-25%"
      />
      <figure className="relative p-10">
        <figcaption className="mt-6 pt-6">
          <p className="text-sm/6 font-medium text-white">{name}</p>
          <p className="text-sm/6 font-medium">
            <a
              href={`mailto:${email}`}
              className="text-pink-400 hover:underline"
            >
              {title}
            </a>
          </p>
        </figcaption>
      </figure>
    </motion.div>
  )
}

function CallToAction() {
  return (
    <div>
      <p className="max-w-sm text-sm/6 text-gray-600">
        Join the fight for better transport within Queensland.
      </p>
      <div className="mt-2">
        <Link
          href="/member"
          className="inline-flex items-center gap-2 text-sm/6 font-medium text-pink-400"
        >
          Become a member
          <ArrowLongRightIcon className="size-5" />
        </Link>
      </div>
    </div>
  )
}

export function Committee() {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const { scrollX } = useScroll({ container: scrollRef })
  const [setReferenceWindowRef, bounds] = useMeasure()
  const [activeIndex, setActiveIndex] = useState(0)

  useMotionValueEvent(scrollX, 'change', (x) => {
    setActiveIndex(Math.floor(x / scrollRef.current!.children[0].clientWidth))
  })

  function scrollTo(index: number) {
    const gap = 32
    const width = (scrollRef.current!.children[0] as HTMLElement).offsetWidth
    scrollRef.current!.scrollTo({ left: (width + gap) * index })
  }

  return (
    <div className="overflow-hidden py-32">
      <Container>
        <div ref={setReferenceWindowRef}>
          <Heading as="h3" className="mt-2">
            Management Committee
          </Heading>
        </div>
      </Container>
      <div
        ref={scrollRef}
        className={clsx([
          'mt-16 flex gap-8 px-[var(--scroll-padding)]',
          '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          'snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth',
          '[--scroll-padding:max(theme(spacing.6),calc((100vw-theme(maxWidth.2xl))/2))] lg:[--scroll-padding:max(theme(spacing.8),calc((100vw-theme(maxWidth.7xl))/2))]',
        ])}
      >
        {testimonials.map(({ img, name, title, email }, testimonialIndex) => (
          <CommitteeCard
            key={testimonialIndex}
            name={name}
            title={title}
            img={img}
            bounds={bounds}
            scrollX={scrollX}
            onClick={() => scrollTo(testimonialIndex)}
            email={email}
          ></CommitteeCard>
        ))}
        <div className="w-[42rem] shrink-0 sm:w-[54rem]" />
      </div>
      <Container className="mt-16">
        <div className="flex justify-between">
          <CallToAction />
          <div className="hidden sm:flex sm:gap-2">
            {testimonials.map(({ name }, testimonialIndex) => (
              <Headless.Button
                key={testimonialIndex}
                onClick={() => scrollTo(testimonialIndex)}
                data-active={
                  activeIndex === testimonialIndex ? true : undefined
                }
                aria-label={`Scroll to testimonial from ${name}`}
                className={clsx(
                  'size-2.5 rounded-full border border-transparent bg-gray-300 transition',
                  'data-[active]:bg-gray-400 data-[hover]:bg-gray-400',
                  'forced-colors:data-[active]:bg-[Highlight] forced-colors:data-[focus]:outline-offset-4',
                )}
              />
            ))}
          </div>
        </div>
      </Container>
    </div>
  )
}
