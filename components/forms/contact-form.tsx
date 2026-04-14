'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Card } from '../core/card'
import { ContactFormFields } from './contact-form-fields'
import { LoadingDisplay, SuccessMessage } from './contact-form-states'
import { SubmitStatus, useContactForm } from './use-contact-form'

export default function ContactForm() {
  const {
    isSubmitting,
    submitStatus,
    errorMessage,
    formData,
    setFormData,
    handleSubmit,
  } = useContactForm()

  return (
    <Card>
      <motion.div
        className="relative"
        animate={{
          height:
            submitStatus === SubmitStatus.Loading ||
            submitStatus === SubmitStatus.ErrorDisplay ||
            submitStatus === SubmitStatus.SuccessDisplay
              ? '24rem'
              : 'auto',
        }}
        transition={{
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        <AnimatePresence
          mode={
            submitStatus === SubmitStatus.Loading ||
            submitStatus === SubmitStatus.Idle ||
            submitStatus === SubmitStatus.Error
              ? 'wait'
              : 'popLayout'
          }
          initial={false}
        >
          {submitStatus === SubmitStatus.Success && (
            <motion.div
              key="success"
              className="h-max min-h-[24rem]"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              exit={{ opacity: 0 }}
            >
              <SuccessMessage />
            </motion.div>
          )}
          {(submitStatus === SubmitStatus.Loading ||
            submitStatus === SubmitStatus.SuccessDisplay ||
            submitStatus === SubmitStatus.ErrorDisplay) && (
            <div
              key="loading"
              className="flex h-full items-center justify-center py-12"
            >
              <LoadingDisplay
                status={
                  submitStatus === SubmitStatus.Loading
                    ? 'loading'
                    : submitStatus === SubmitStatus.ErrorDisplay
                      ? 'error'
                      : 'success'
                }
                errorMessage={errorMessage}
              />
            </div>
          )}
          {(submitStatus === SubmitStatus.Idle ||
            submitStatus === SubmitStatus.Error) && (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ContactFormFields
                formData={formData}
                setFormData={setFormData}
                isSubmitting={isSubmitting}
                showError={submitStatus === SubmitStatus.Error}
                errorMessage={errorMessage}
                onSubmit={handleSubmit}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Card>
  )
}
