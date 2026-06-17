import { useState } from 'react'

export enum SubmitStatus {
  Idle = 'idle',
  Loading = 'loading',
  SuccessDisplay = 'success-display',
  Success = 'success',
  Error = 'error',
  ErrorDisplay = 'error-display',
}

interface FormData {
  name: string
  email: string
  purpose: string
  subject: string
  message: string
}

export function useContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(
    SubmitStatus.Idle,
  )
  const [errorMessage, setErrorMessage] = useState('')
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    purpose: '',
    subject: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setIsSubmitting(true)
    setSubmitStatus(SubmitStatus.Loading)
    setErrorMessage('')

    const formDataObj = new FormData(e.currentTarget)
    const data: FormData = {
      name: formDataObj.get('name') as string,
      email: formDataObj.get('email') as string,
      purpose: formDataObj.get('purpose') as string,
      subject: formDataObj.get('subject') as string,
      message: formDataObj.get('message') as string,
    }

    // Save form data in case of failure
    setFormData(data)

    const startTime = Date.now()

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      // Ensure at least 1 second of loading animation
      const elapsedTime = Date.now() - startTime
      const remainingTime = Math.max(0, 1000 - elapsedTime)
      await new Promise((resolve) => setTimeout(resolve, remainingTime))

      if (response.ok) {
        setSubmitStatus(SubmitStatus.SuccessDisplay)
        // Show success icon for 1.5 seconds, then show thank you message
        setTimeout(() => {
          setSubmitStatus(SubmitStatus.Success)
        }, 1500)
        // Reset form data on success
        setFormData({
          name: '',
          email: '',
          purpose: '',
          subject: '',
          message: '',
        })
      } else {
        // Try to get error message from response
        const errorData = await response.json().catch(() => ({}))
        const serverError =
          errorData.error ||
          'There was an error submitting your message. Please try again.'
        setErrorMessage(serverError)
        setSubmitStatus(SubmitStatus.ErrorDisplay)
        // Show error message for 1.5 seconds, then return to form
        setTimeout(() => {
          setSubmitStatus(SubmitStatus.Error)
          setIsSubmitting(false)
        }, 1500)
        return
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setErrorMessage(
        'Unable to connect to the server. Please check your internet connection and try again. We encountered an issue submitting your message.',
      )
      setSubmitStatus(SubmitStatus.ErrorDisplay)
      // Show error message for 1.5 seconds, then return to form
      setTimeout(() => {
        setSubmitStatus(SubmitStatus.Error)
        setIsSubmitting(false)
      }, 1500)
      return
    }

    setIsSubmitting(false)
  }

  return {
    isSubmitting,
    submitStatus,
    errorMessage,
    formData,
    setFormData,
    handleSubmit,
  }
}
