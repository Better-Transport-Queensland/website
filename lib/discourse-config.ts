// Discourse configuration from environment variables
export const DISCOURSE_HOST =
  process.env.DISCOURSE_HOST || 'forum.bettertransportqueensland.org'
export const DISCOURSE_API_KEY = process.env.DISCOURSE_API_KEY
export const DISCOURSE_API_USERNAME = process.env.DISCOURSE_API_USERNAME
export const DISCOURSE_CONTACT_CATEGORY_ID =
  process.env.DISCOURSE_CONTACT_CATEGORY_ID

/**
 * Check if all required Discourse configuration is present for the contact form
 */
export function isContactFormConfigured(): boolean {
  // In development, allow the form even without credentials (for testing UI)
  if (process.env.NODE_ENV === 'development') {
    return true
  }

  return !!(
    DISCOURSE_API_KEY &&
    DISCOURSE_API_USERNAME &&
    DISCOURSE_CONTACT_CATEGORY_ID
  )
}
