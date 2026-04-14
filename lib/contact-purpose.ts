export enum ContactPurpose {
  GeneralEnquiry = 'general-enquiry',
  Complaint = 'complaint',
  Suggestion = 'suggestion',
  OutreachPartnership = 'outreach-partnership',
  MediaRequest = 'media-request',
  PolicyResearchFeedback = 'policy-research-feedback',
  Other = 'other',
}

// Maximum input lengths for contact form fields
export const CONTACT_FORM_MAX_LENGTHS = {
  NAME: 100,
  EMAIL: 254, // RFC 5321 max email length
  PURPOSE: 50,
  SUBJECT: 256,
  MESSAGE: 10000,
} as const
