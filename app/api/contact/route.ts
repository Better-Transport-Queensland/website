import { CONTACT_FORM_MAX_LENGTHS, ContactPurpose } from '@/lib/contact-purpose'
import {
  DISCOURSE_API_KEY,
  DISCOURSE_API_USERNAME,
  DISCOURSE_CONTACT_CATEGORY_ID,
  DISCOURSE_HOST,
  isContactFormConfigured,
} from '@/lib/discourse-config'
import {
  contactFormGlobalLimiter,
  contactFormLimiter,
  contactFormSpamLimiter,
} from '@/lib/rate-limiter'
import { spamDetector } from '@/lib/spam-detector'
import { NextRequest, NextResponse } from 'next/server'

// Types
interface ContactFormData {
  name: string
  email: string
  purpose: string
  subject: string
  message: string
}

interface SanitizedContactFormData {
  sanitizedName: string
  sanitizedEmail: string
  sanitizedSubject: string
  sanitizedMessage: string
  purpose: string
}

// Helper functions
function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

function checkRateLimits(ip: string): NextResponse | null {
  // Check global rate limit
  const globalRateLimitResult = contactFormGlobalLimiter.check('global')
  if (!globalRateLimitResult.allowed) {
    return NextResponse.json(
      {
        error: `The contact form is receiving high traffic. Please try again shortly.`,
      },
      { status: 429 },
    )
  }

  // Check per-IP rate limit
  const rateLimitResult = contactFormLimiter.check(ip)
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      {
        error: `Too many requests. Please try again shortly.`,
      },
      { status: 429 },
    )
  }

  // Check spam rate limit
  const spamRateLimitResult = contactFormSpamLimiter.check(ip)
  if (!spamRateLimitResult.allowed) {
    return NextResponse.json(
      {
        error: `Blacklisted.`,
      },
      { status: 401 },
    )
  }

  return null
}

function checkConfiguration(): NextResponse | null {
  if (!isContactFormConfigured()) {
    console.error('Discourse API credentials not configured')
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 },
    )
  }
  return null
}

function validateFormData(formData: ContactFormData): NextResponse | null {
  const { name, email, purpose, subject, message } = formData

  // Validate required fields
  if (!name || !email || !purpose || !subject || !message) {
    return NextResponse.json(
      {
        error: 'Please fill in all required fields before submitting the form.',
      },
      { status: 400 },
    )
  }

  // Validate types
  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof purpose !== 'string' ||
    typeof subject !== 'string' ||
    typeof message !== 'string'
  ) {
    return NextResponse.json(
      {
        error: 'There was a problem with your submission.',
      },
      { status: 400 },
    )
  }

  // Validate input lengths
  if (
    name.length > CONTACT_FORM_MAX_LENGTHS.NAME ||
    email.length > CONTACT_FORM_MAX_LENGTHS.EMAIL ||
    purpose.length > CONTACT_FORM_MAX_LENGTHS.PURPOSE ||
    subject.length > CONTACT_FORM_MAX_LENGTHS.SUBJECT ||
    message.length > CONTACT_FORM_MAX_LENGTHS.MESSAGE
  ) {
    return NextResponse.json(
      {
        error: 'One or more fields exceed the maximum length.',
      },
      { status: 400 },
    )
  }

  // Validate email format (RFC 5321 compliant)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      {
        error: 'Please enter a valid email address.',
      },
      { status: 400 },
    )
  }

  // Validate purpose against allowed values from enum
  const allowedPurposes = Object.values(ContactPurpose)
  if (!allowedPurposes.includes(purpose as ContactPurpose)) {
    return NextResponse.json(
      {
        error: 'Invalid purpose selected.',
      },
      { status: 400 },
    )
  }

  return null
}

function sanitize(input: string): string {
  return input
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .replace(/<[^>]*>/g, '') // Remove all HTML tags (including <iframe>, <script>, etc.)
    .replace(/&[^;]+;/g, '') // Remove HTML entities
    .trim()
}

function sanitizeFormData(formData: ContactFormData): SanitizedContactFormData {
  return {
    sanitizedName: sanitize(formData.name),
    sanitizedEmail: sanitize(formData.email),
    sanitizedSubject: sanitize(formData.subject),
    sanitizedMessage: sanitize(formData.message),
    purpose: formData.purpose,
  }
}

function checkSpam(
  sanitizedData: SanitizedContactFormData,
  ip: string,
  originalEmail: string,
  originalSubject: string,
): NextResponse | null {
  const spamCheckResult = spamDetector.check({
    name: sanitizedData.sanitizedName,
    email: sanitizedData.sanitizedEmail,
    subject: sanitizedData.sanitizedSubject,
    message: sanitizedData.sanitizedMessage,
  })

  if (spamCheckResult.isSpam) {
    contactFormSpamLimiter.increment(ip)

    console.warn(
      `Spam detected (score: ${spamCheckResult.score}): ${spamCheckResult.reason}`,
      { ip, email: originalEmail, subject: originalSubject },
    )

    return NextResponse.json(
      {
        error: 'Your message was flagged by our spam filter.',
      },
      { status: 400 },
    )
  }

  return null
}

function handleDevMode(subject: string): NextResponse | null {
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  if (subject.toLowerCase().includes('error')) {
    return NextResponse.json(
      {
        error: 'We encountered an issue submitting your message.',
      },
      { status: 500 },
    )
  }

  if (subject.toLowerCase().includes('success')) {
    return NextResponse.json(
      { success: true, topicId: 'topic-id' },
      { status: 200 },
    )
  }

  return null
}

function formatPurpose(value: string): string {
  return value.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function createDiscoursePayload(sanitizedData: SanitizedContactFormData) {
  const title = `[${formatPurpose(sanitizedData.purpose)}] ${sanitizedData.sanitizedSubject}`

  const raw = `**Name:** ${sanitizedData.sanitizedName}
**Email:** ${sanitizedData.sanitizedEmail}

---

${sanitizedData.sanitizedMessage}`

  const categoryId = parseInt(DISCOURSE_CONTACT_CATEGORY_ID ?? '0')
  if (isNaN(categoryId) || categoryId <= 0) {
    throw new Error('Invalid DISCOURSE_CONTACT_CATEGORY_ID')
  }

  return { title, raw, category: categoryId }
}

async function submitToDiscourse(
  sanitizedData: SanitizedContactFormData,
): Promise<NextResponse> {
  try {
    const payload = createDiscoursePayload(sanitizedData)

    const response = await fetch(`https://${DISCOURSE_HOST}/posts.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': DISCOURSE_API_KEY ?? '',
        'Api-Username': DISCOURSE_API_USERNAME ?? '',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Discourse API error:', response.status, errorText)
      return NextResponse.json(
        {
          error: 'We encountered an issue submitting your message.',
        },
        { status: 500 },
      )
    }

    const result = await response.json()

    return NextResponse.json(
      { success: true, topicId: result.topic_id },
      { status: 200 },
    )
  } catch (error) {
    console.error('Invalid DISCOURSE_CONTACT_CATEGORY_ID or submission error')
    return NextResponse.json(
      {
        error: 'We encountered an issue submitting your message.',
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)

    // Early validation checks
    const rateLimitError = checkRateLimits(ip)
    if (rateLimitError) return rateLimitError

    const configError = checkConfiguration()
    if (configError) return configError

    // Parse and validate form data
    const formData: ContactFormData = await request.json()

    const validationError = validateFormData(formData)
    if (validationError) return validationError

    // Sanitize inputs
    const sanitizedData = sanitizeFormData(formData)

    // Check for spam
    const spamError = checkSpam(
      sanitizedData,
      ip,
      formData.email,
      formData.subject,
    )
    if (spamError) return spamError

    // Handle development mode shortcuts
    const devModeResponse = handleDevMode(formData.subject)
    if (devModeResponse) return devModeResponse

    // Submit to Discourse
    const response = await submitToDiscourse(sanitizedData)

    // Increment rate limiters on success only
    if (response.status === 200) {
      contactFormGlobalLimiter.increment('global')
      contactFormLimiter.increment(ip)
    }

    return response
  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      {
        error: 'An unexpected error occurred while processing your request.',
      },
      { status: 500 },
    )
  }
}
