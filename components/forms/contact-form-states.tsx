import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '../core/button'

export function SuccessMessage() {
  return (
    <div className="flex h-max min-h-96 flex-col items-center justify-around py-8 text-center">
      <div>
        <h2 className="text-heading mb-3 text-xl font-bold sm:text-2xl">
          Thank you for reaching out!
        </h2>

        <p className="text-body mb-6 text-sm sm:text-base">
          We&apos;ve received your message and our team will get back to you
          shortly.
        </p>
      </div>

      <div className="max-w-3xl rounded-lg bg-(--surface-card-raised-bg) p-5">
        <p className="text-heading mb-1 text-base font-semibold sm:text-lg">
          Want to stay connected while you wait?
        </p>

        <p className="text-body mb-4 text-sm sm:text-base">
          Join the conversation in our community forum. It&apos;s a great place
          to share ideas, ask questions, and connect with others who care about
          better transport.
        </p>

        <Button href="https://forum.bettertransportqueensland.org/signup">
          Join the Conversation
        </Button>
      </div>
    </div>
  )
}

export function SuccessIcon() {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-(--badge-success-bg)">
        <svg
          className="h-6 w-6 text-(--badge-success-text)"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <p className="text-sm text-(--badge-success-text) sm:text-base">
        Message sent successfully!
      </p>
    </div>
  )
}

export function LoadingSpinner() {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-(--surface-border) border-t-(--color-primary)" />
      <p className="text-body text-sm sm:text-base">
        Submitting your message...
      </p>
    </div>
  )
}

export function ErrorIcon({ errorMessage }: { errorMessage: string }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--badge-danger-bg)]">
        <svg
          className="h-6 w-6 text-(--badge-danger-text)"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <p className="max-w-xl text-sm text-(--badge-danger-text) sm:text-base">
        {errorMessage}
      </p>
    </div>
  )
}

export function LoadingDisplay({
  status,
  errorMessage,
}: {
  status: 'loading' | 'success' | 'error'
  errorMessage?: string
}) {
  return (
    <AnimatePresence mode="popLayout">
      {status === 'loading' && (
        <motion.div
          key="loading"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <LoadingSpinner />
        </motion.div>
      )}
      {status === 'success' && (
        <motion.div
          key="success"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <SuccessIcon />
        </motion.div>
      )}
      {status === 'error' && (
        <motion.div
          key="error"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <ErrorIcon errorMessage={errorMessage || ''} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
