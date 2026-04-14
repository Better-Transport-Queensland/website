'use client'

import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion'
import { useState } from 'react'

export function Accordion({
  question,
  answer,
}: {
  question: string
  answer: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className="border-b border-subtle"
      // Make the whole block clickable
      role="button"
      aria-expanded={isOpen}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setIsOpen(!isOpen)
        }
      }}
    >
      {/* Header */}
      <div
        className="flex w-full cursor-pointer items-center justify-between py-4 text-left text-lg font-semibold"
        onClick={() => setIsOpen(!isOpen)}
      >
        {question}
        <motion.div
          key={`accordian-chevron ${question}`}
          initial={{ rotate: 0 }}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <ChevronDownIcon className="size-5 text-body" />
        </motion.div>
      </div>

      {/* Animated Body */}
      <motion.div
        key={`accordian ${question}`}
        initial={{ height: 0, opacity: 0 }}
        animate={
          isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }
        }
        transition={{
          duration: 0.25,
          ease: [0.25, 0.8, 0.5, 1],
        }}
        className="text-md overflow-hidden"
      >
        <div className="pb-4">{answer}</div>
      </motion.div>
    </div>
  )
}
