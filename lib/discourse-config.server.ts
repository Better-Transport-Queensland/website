// lib/discourse.server.ts   (note .server to signal server-only in app router)
export interface DiscourseConfig {
  host: string
  apiKey: string
  apiUsername: string
  contactCategoryId: string
}

export function getDiscourseConfig() {
  return {
    host: process.env.DISCOURSE_HOST || 'forum.bettertransportqueensland.org',
    apiKey: process.env.DISCOURSE_API_KEY,
    apiUsername: process.env.DISCOURSE_API_USERNAME,
    contactCategoryId: process.env.DISCOURSE_CONTACT_CATEGORY_ID,
  } as DiscourseConfig
}

export function isContactFormConfigured(): boolean {
  if (process.env.NODE_ENV === 'development') return true
  const cfg = getDiscourseConfig()
  return !!(cfg.apiKey && cfg.apiUsername && cfg.contactCategoryId)
}
