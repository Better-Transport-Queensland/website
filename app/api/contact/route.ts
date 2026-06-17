import { CONTACT_FORM_MAX_LENGTHS, ContactPurpose } from '@/lib/contact-purpose'
import {
  getDiscourseConfig,
  isContactFormConfigured,
  type DiscourseConfig,
} from '@/lib/discourse-config.server'
import {
  contactFormAttemptLimiter,
  contactFormGlobalLimiter,
  contactFormLimiter,
  contactFormSpamLimiter,
} from '@/lib/rate-limiter'
import { spamDetector } from '@/lib/spam-detector'
import { NextRequest, NextResponse } from 'next/server'
import validator from 'validator'
import { z } from 'zod'

// Schema and types
const contactFormSchema = z.object({
  name: z.string().trim().min(1).max(CONTACT_FORM_MAX_LENGTHS.NAME),
  email: z.email().max(CONTACT_FORM_MAX_LENGTHS.EMAIL),
  purpose: z.enum(ContactPurpose),
  subject: z.string().trim().min(1).max(CONTACT_FORM_MAX_LENGTHS.SUBJECT),
  message: z.string().trim().min(1).max(CONTACT_FORM_MAX_LENGTHS.MESSAGE),
})

type ContactFormData = z.infer<typeof contactFormSchema>

interface SanitizedContactFormData {
  sanitizedName: string
  sanitizedEmail: string
  sanitizedSubject: string
  sanitizedMessage: string
  purpose: string
}

// Helper functions
function getClientIp(request: NextRequest): string {
  // Cloudflare sets cf-connecting-ip to the real client IP; the client cannot
  // spoof it (Cloudflare overwrites any value), so trust it first.
  const cfIp = request.headers.get('cf-connecting-ip')?.trim()
  if (cfIp) return cfIp

  // Fallback: use the RIGHTMOST X-Forwarded-For entry — the hop appended by the
  // closest trusted proxy — never the spoofable left-most client-supplied value.
  const xff = request.headers.get('x-forwarded-for')
  if (xff) {
    const parts = xff
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean)
    if (parts.length > 0) return parts[parts.length - 1]
  }

  return request.headers.get('x-real-ip')?.trim() || 'unknown'
}

function checkRateLimits(ip: string): NextResponse | null {
  // Per-IP attempt limit: counts EVERY request (not just successful ones), so
  // floods and spam-filter probing are throttled even when they never succeed.
  const attemptResult = contactFormAttemptLimiter.check(ip)
  if (!attemptResult.allowed) {
    return NextResponse.json(
      {
        error: `Too many requests. Please try again shortly.`,
      },
      { status: 429 },
    )
  }
  contactFormAttemptLimiter.increment(ip)

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

// Map a Zod validation failure to a user-friendly, non-leaky message that
// mirrors the previous hand-rolled responses.
function validationErrorMessage(error: z.ZodError): string {
  const issue = error.issues[0]
  if (issue?.code === 'too_big') {
    return 'One or more fields exceed the maximum length.'
  }
  if (issue?.path[0] === 'email') {
    return 'Please enter a valid email address.'
  }
  if (issue?.path[0] === 'purpose') {
    return 'Invalid purpose selected.'
  }
  return 'Please fill in all required fields before submitting the form.'
}

function sanitize(input: string, allowNewlines = false): string {
  // Normalise line endings first so newline handling is consistent.
  const normalized = allowNewlines ? input.replace(/\r\n?/g, '\n') : input

  // validator.stripLow removes control chars (< 0x20 and 0x7F); the second arg
  // keeps newlines for multi-line fields.
  let current = validator.stripLow(normalized, allowNewlines)

  // Strip HTML tags/entities repeatedly until stable. A single pass is an
  // incomplete multi-character sanitisation: removing one tag can reveal a new
  // one (e.g. "<scr<script>ipt>" -> "<script>"), so loop until nothing changes.
  let previous: string
  do {
    previous = current
    current = current
      .replace(/<[^>]*>/g, '') // Remove HTML tags (<script>, <iframe>, ...)
      .replace(/&[^;]+;/g, '') // Remove HTML entities
  } while (current !== previous)

  return validator.trim(current)
}

function sanitizeFormData(formData: ContactFormData): SanitizedContactFormData {
  return {
    sanitizedName: sanitize(formData.name),
    sanitizedEmail: sanitize(formData.email),
    sanitizedSubject: sanitize(formData.subject),
    sanitizedMessage: sanitize(formData.message, true), // preserve line breaks
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

// Neutralise Discourse Markdown so user input renders as literal text and
// cannot inject mentions, links, images/oneboxes, formatting, or forge the
// **Name:**/**Email:** template lines.
function escapeMarkdown(input: string, breakMentions = true): string {
  // Backslash-escape every ASCII punctuation char. Per CommonMark the
  // backslash is dropped on render, so only the literal character is shown
  // (and copy/paste stays clean).
  const escaped = input.replace(/[!"#$%&'()*+,\-./:;<=>?[\\\]^_`{|}~]/g, '\\$&')

  // Backslash-escaping does not reliably disable Discourse @mentions, so for
  // free-text fields insert a zero-width space to break the mention pattern.
  // Skipped for the email field (its @ is mid-token, never a mention) to keep
  // the address copy/paste-able.
  return breakMentions ? escaped.replace(/@/g, '@\u200B') : escaped
}

function createDiscoursePayload(
  sanitizedData: SanitizedContactFormData,
  cfg: DiscourseConfig,
) {
  const title = `[${formatPurpose(sanitizedData.purpose)}] ${sanitizedData.sanitizedSubject}`

  const raw = `**Name:** ${escapeMarkdown(sanitizedData.sanitizedName)}
**Email:** ${escapeMarkdown(sanitizedData.sanitizedEmail, false)}

---

${escapeMarkdown(sanitizedData.sanitizedMessage)}`

  const categoryId = parseInt(cfg.contactCategoryId ?? '0')
  if (isNaN(categoryId) || categoryId <= 0) {
    throw new Error('Invalid DISCOURSE_CONTACT_CATEGORY_ID')
  }

  return { title, raw, category: categoryId }
}

async function submitToDiscourse(
  sanitizedData: SanitizedContactFormData,
  cfg: DiscourseConfig,
): Promise<NextResponse> {
  try {
    const payload = createDiscoursePayload(sanitizedData, cfg)

    const response = await fetch(`https://${cfg.host}/posts.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': cfg.apiKey ?? '',
        'Api-Username': cfg.apiUsername ?? '',
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

    // Reject oversized payloads before parsing the whole body into memory.
    const contentLength = Number(request.headers.get('content-length') ?? '0')
    if (Number.isFinite(contentLength) && contentLength > 32 * 1024) {
      return NextResponse.json(
        { error: 'Request payload too large.' },
        { status: 413 },
      )
    }

    // Parse the body, rejecting malformed JSON explicitly
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'There was a problem with your submission.' },
        { status: 400 },
      )
    }

    // Validate against the schema
    const parsed = contactFormSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: validationErrorMessage(parsed.error) },
        { status: 400 },
      )
    }
    const formData = parsed.data

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

    const cfg = getDiscourseConfig()

    // Submit to Discourse
    const response = await submitToDiscourse(sanitizedData, cfg)

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
