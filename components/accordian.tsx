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
    <div className="border-b border-gray-300">
      {/* Accordion Header */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full cursor-pointer items-center justify-between text-left text-lg font-semibold focus:outline-none"
        aria-expanded={isOpen}
      >
        {question}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 360 }}
          transition={{ duration: 0.25 }} // Faster rotation
        >
          <ChevronDownIcon className="size-5 text-gray-600" />
        </motion.div>
      </motion.button>

      {/* Animated Accordion Body */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={
          isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }
        }
        transition={{
          type: 'spring',
          stiffness: 300, // Increased stiffness for faster snap
          damping: 25, // Less bounce
        }}
        className="text-md my-2 overflow-hidden"
      >
        {answer}
      </motion.div>
    </div>
  )
}
