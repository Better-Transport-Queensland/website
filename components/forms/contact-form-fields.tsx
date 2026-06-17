import { CONTACT_FORM_MAX_LENGTHS, ContactPurpose } from '@/lib/contact-purpose'
import { PaperAirplaneIcon } from '@heroicons/react/16/solid'
import { Button } from '../core/button'
import { EnumSelect } from '../core/enum-select'

interface FormData {
  name: string
  email: string
  purpose: string
  subject: string
  message: string
}

interface ContactFormFieldsProps {
  formData: FormData
  setFormData: (data: FormData) => void
  isSubmitting: boolean
  showError: boolean
  errorMessage: string
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export function ContactFormFields({
  formData,
  setFormData,
  isSubmitting,
  showError,
  errorMessage,
  onSubmit,
}: ContactFormFieldsProps) {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div>
        <label
          htmlFor="name"
          className="block text-base font-semibold text-heading"
        >
          Your name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={CONTACT_FORM_MAX_LENGTHS.NAME}
          placeholder="Enter your name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-2 input-field"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-base font-semibold text-heading"
        >
          Your email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={CONTACT_FORM_MAX_LENGTHS.EMAIL}
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-2 input-field"
        />
      </div>

      <div>
        <label
          htmlFor="purpose"
          className="block text-base font-semibold text-heading"
        >
          Purpose
        </label>

        <EnumSelect
          id="purpose"
          name="purpose"
          placeholder="Select a purpose…"
          enumObject={ContactPurpose}
          required
          value={formData.purpose}
          onChange={(value) =>
            setFormData({ ...formData, purpose: value as string })
          }
        />
      </div>

      <div>
        <label
          htmlFor="subject"
          className="block text-base font-semibold text-heading"
        >
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          maxLength={CONTACT_FORM_MAX_LENGTHS.SUBJECT}
          placeholder="What is your message about?"
          value={formData.subject}
          onChange={(e) =>
            setFormData({ ...formData, subject: e.target.value })
          }
          className="mt-2 input-field"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-base font-semibold text-heading"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          maxLength={CONTACT_FORM_MAX_LENGTHS.MESSAGE}
          placeholder="Write your message here..."
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          className="mt-2 input-field"
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {showError && (
          <p className="text-sm text-error">
            {errorMessage} If the problem persists, you can email us directly at
            enquiries@btq.org.au.
          </p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:ml-auto sm:w-auto"
        >
          <span className="inline-flex items-center gap-2">
            Submit
            <PaperAirplaneIcon className="h-5 w-5" />
          </span>
        </Button>
      </div>
    </form>
  )
}
