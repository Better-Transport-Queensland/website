// Simple in-memory rate limiter
// Tracks requests per IP address with a sliding window

interface RateLimitEntry {
  count: number
  resetAt: number
}

class RateLimiter {
  private requests: Map<string, RateLimitEntry> = new Map()
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor(
    private maxRequests: number,
    private windowMs: number,
  ) {
    // Clean up expired entries every 30 seconds
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 30000)
  }

  private cleanup() {
    const now = Date.now()
    for (const [key, entry] of this.requests.entries()) {
      if (now > entry.resetAt) {
        this.requests.delete(key)
      }
    }
  }

  check(identifier: string): {
    allowed: boolean
    remaining: number
    resetAt: number
  } {
    const now = Date.now()
    const entry = this.requests.get(identifier)

    // No previous requests or window expired
    if (!entry || now > entry.resetAt) {
      const resetAt = now + this.windowMs
      return {
        allowed: true,
        remaining: this.maxRequests,
        resetAt,
      }
    }

    // Within window, check if limit exceeded
    if (entry.count >= this.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: entry.resetAt,
      }
    }

    // Has capacity
    return {
      allowed: true,
      remaining: this.maxRequests - entry.count,
      resetAt: entry.resetAt,
    }
  }

  increment(identifier: string): void {
    const now = Date.now()
    const entry = this.requests.get(identifier)

    // No previous requests or window expired
    if (!entry || now > entry.resetAt) {
      const resetAt = now + this.windowMs
      this.requests.set(identifier, { count: 1, resetAt })
      return
    }

    // Increment count
    entry.count++
  }

  // Decrement the count for an identifier (e.g., when a request fails)
  decrement(identifier: string): void {
    const entry = this.requests.get(identifier)
    if (entry && entry.count > 0) {
      entry.count--
      // Remove entry if count reaches 0
      if (entry.count === 0) {
        this.requests.delete(identifier)
      }
    }
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
  }
}

// Contact form rate limiters:
// - Per IP: 1 request per 5 minutes
// - Global: 2 requests per minute (prevents rapid spam across different IPs)
// - Spam Limiter:
export const contactFormLimiter = new RateLimiter(1, 5 * 60 * 1000)
export const contactFormGlobalLimiter = new RateLimiter(2, 60 * 1000)
export const contactFormSpamLimiter = new RateLimiter(10, 30 * 60 * 1000)
