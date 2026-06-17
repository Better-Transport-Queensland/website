// Spam detection for contact form submissions

interface SpamCheckResult {
  isSpam: boolean
  reason?: string
  score: number // 0-100, higher = more likely spam
}

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export class SpamDetector {
  private readonly SPAM_THRESHOLD = 50 // Score threshold to mark as spam

  // Normalize text by removing diacritics and converting to ASCII equivalents
  private normalizeText(text: string): string {
    // Normalize to NFD (decomposed form) then remove combining diacritical marks
    const normalized = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

    // Additional common substitutions used in spam
    const substitutions: Record<string, string> = {
      а: 'a',
      е: 'e',
      о: 'o',
      р: 'p',
      с: 'c',
      х: 'x', // Cyrillic lookalikes
      ā: 'a',
      ē: 'e',
      ī: 'i',
      ō: 'o',
      ū: 'u', // Macrons
      à: 'a',
      á: 'a',
      â: 'a',
      ã: 'a',
      ä: 'a',
      å: 'a',
      è: 'e',
      é: 'e',
      ê: 'e',
      ë: 'e',
      ì: 'i',
      í: 'i',
      î: 'i',
      ï: 'i',
      ò: 'o',
      ó: 'o',
      ô: 'o',
      õ: 'o',
      ö: 'o',
      ù: 'u',
      ú: 'u',
      û: 'u',
      ü: 'u',
      ý: 'y',
      ÿ: 'y',
      ñ: 'n',
      ç: 'c',
      ł: 'l',
      ø: 'o',
      æ: 'ae',
      œ: 'oe',
      ß: 'ss',
      '0': 'o',
      '1': 'i',
      '3': 'e',
      '4': 'a',
      '5': 's',
      '7': 't',
      '8': 'b', // Leet speak numbers
      '@': 'a',
      $: 's',
      '!': 'i', // Common symbol substitutions
    }

    return normalized
      .split('')
      .map((char) => substitutions[char] || char)
      .join('')
  }

  check(data: ContactFormData): SpamCheckResult {
    let score = 0
    const reasons: string[] = []

    // 1. Check for suspicious URLs (multiple links)
    const urlPattern = /(https?:\/\/[^\s]+)/gi
    const messageUrls = (data.message.match(urlPattern) || []).length
    const subjectUrls = (data.subject.match(urlPattern) || []).length
    const totalUrls = messageUrls + subjectUrls

    if (totalUrls > 3) {
      score += 40
      reasons.push('excessive URLs')
    } else if (totalUrls > 1) {
      score += 20
      reasons.push('multiple URLs')
    }

    // 2. Check for excessive capitalization
    const messageUpperCase = (data.message.match(/[A-Z]/g) || []).length
    const messageTotalLetters = (data.message.match(/[A-Za-z]/g) || []).length
    const upperCaseRatio =
      messageTotalLetters > 0 ? messageUpperCase / messageTotalLetters : 0

    if (upperCaseRatio > 0.5 && messageTotalLetters > 20) {
      score += 30
      reasons.push('excessive capitalization')
    }

    // 3. Check for common spam patterns (with normalized text and flexible spacing)
    const spamPatterns = [
      'viagra',
      'cialis',
      'casino',
      'lottery',
      'winner',
      'congratulations',
      'claim now',
      'click here',
      'buy now',
      'limited time',
      'act now',
      'free money',
      'make money fast',
      'work from home',
      'weight loss',
      'bitcoin',
      'cryptocurrency',
      'crypto currency',
      'investment opportunity',
      'nigerian prince',
      'earn cash',
      'get paid',
      'no experience',
      'risk free',
      'satisfaction guaranteed',
      'special promotion',
      'limited offer',
    ]

    const combinedText = `${data.subject} ${data.message}`
    const normalizedText = this.normalizeText(combinedText).toLowerCase()

    // Convert patterns to regex with flexible spacing (allows 0-3 spaces/symbols between characters)
    const foundKeywords = spamPatterns.filter((pattern) => {
      // Replace spaces in pattern with flexible space regex
      const flexiblePattern = pattern
        .split('')
        .map((char) => (char === ' ' ? '[\\s\\-_.*]{0,3}' : char))
        .join('[\\s\\-_.*]{0,3}')

      const regex = new RegExp(flexiblePattern, 'i')
      return regex.test(normalizedText)
    })

    if (foundKeywords.length > 2) {
      score += 50
      reasons.push('multiple spam keywords')
    } else if (foundKeywords.length > 0) {
      score += 25
      reasons.push('spam keywords')
    }

    // 4. Check for repetitive characters
    const repetitivePattern = /(.)\1{5,}/g
    if (repetitivePattern.test(data.message)) {
      score += 20
      reasons.push('repetitive characters')
    }

    // 5. Check message length (too short or suspiciously long)
    if (data.message.length < 10) {
      score += 15
      reasons.push('message too short')
    } else if (data.message.length > 5000) {
      score += 15
      reasons.push('message unusually long')
    }

    // 6. Check for gibberish (low vowel ratio)
    const vowels = (data.message.match(/[aeiou]/gi) || []).length
    const consonants = (data.message.match(/[bcdfghjklmnpqrstvwxyz]/gi) || [])
      .length
    const vowelRatio = consonants > 0 ? vowels / consonants : 1

    if (vowelRatio < 0.2 && consonants > 20) {
      score += 25
      reasons.push('suspicious text pattern')
    }

    // 7. Check for email in message body (not in email field)
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
    const emailsInMessage = (data.message.match(emailPattern) || []).length
    if (emailsInMessage > 2) {
      score += 30
      reasons.push('multiple email addresses in message')
    }

    // 8. Check for suspicious name patterns
    if (data.name.length < 2) {
      score += 10
      reasons.push('name too short')
    }

    // Check for name containing URLs or email
    if (urlPattern.test(data.name) || emailPattern.test(data.name)) {
      score += 35
      reasons.push('suspicious name format')
    }

    // 9. Check for phone number spam (multiple phone numbers)
    const phonePattern =
      /(\+?\d{1,4}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g
    const phoneNumbers = (data.message.match(phonePattern) || []).length
    if (phoneNumbers > 3) {
      score += 25
      reasons.push('excessive phone numbers')
    }

    // 10. Check for all caps subject
    const subjectUpperCase = (data.subject.match(/[A-Z]/g) || []).length
    const subjectTotalLetters = (data.subject.match(/[A-Za-z]/g) || []).length
    const subjectUpperRatio =
      subjectTotalLetters > 0 ? subjectUpperCase / subjectTotalLetters : 0

    if (subjectUpperRatio > 0.7 && subjectTotalLetters > 5) {
      score += 15
      reasons.push('subject all caps')
    }

    // Cap score at 100
    score = Math.min(score, 100)

    return {
      isSpam: score >= this.SPAM_THRESHOLD,
      reason: reasons.length > 0 ? reasons.join(', ') : undefined,
      score,
    }
  }
}

export const spamDetector = new SpamDetector()
