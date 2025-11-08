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
      className="border-b border-gray-300"
      // Make the whole block clickable
      onClick={() => setIsOpen(!isOpen)}
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
      <div className="flex w-full cursor-pointer items-center justify-between py-4 text-left text-lg font-semibold">
        {question}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 360 }}
          transition={{ duration: 0.25 }}
        >
          <ChevronDownIcon className="size-5 text-gray-600" />
        </motion.div>
      </div>

      {/* Animated Body */}
      <motion.div
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
