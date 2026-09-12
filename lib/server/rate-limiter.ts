/**
 * Fenntrace — In-Memory Sliding Window Rate Limiter
 *
 * Protects exposure checking endpoints from automated scraping,
 * bulk lookups, and denial-of-service attempts.
 */

export interface RateLimitResult {
  allowed: boolean
  limit: number
  remaining: number
  resetTimeMs: number
}

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

class SlidingWindowRateLimiter {
  private requests: Map<string, number[]> = new Map()
  private maxRequests: number
  private windowMs: number
  private lastCleanup: number = Date.now()

  constructor(config: Partial<RateLimitConfig> = {}) {
    this.maxRequests =
      config.maxRequests ||
      (process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX, 10) : 15)
    this.windowMs =
      config.windowMs ||
      (process.env.RATE_LIMIT_WINDOW_MS ? parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) : 60_000)
  }

  /**
   * Check if a given identifier (e.g. client IP) is within the rate limit.
   */
  check(identifier: string): RateLimitResult {
    const now = Date.now()
    const windowStart = now - this.windowMs

    // Periodic cleanup of stale entries every 60 seconds
    if (now - this.lastCleanup > 60_000) {
      this.cleanup(now)
    }

    const timestamps = this.requests.get(identifier) || []
    // Filter out timestamps outside the active sliding window
    const validTimestamps = timestamps.filter((t) => t > windowStart)

    if (validTimestamps.length >= this.maxRequests) {
      const oldestInWindow = validTimestamps[0]
      const resetTimeMs = oldestInWindow + this.windowMs
      this.requests.set(identifier, validTimestamps)

      return {
        allowed: false,
        limit: this.maxRequests,
        remaining: 0,
        resetTimeMs,
      }
    }

    // Add current timestamp and store
    validTimestamps.push(now)
    this.requests.set(identifier, validTimestamps)

    const remaining = this.maxRequests - validTimestamps.length
    const resetTimeMs = now + this.windowMs

    return {
      allowed: true,
      limit: this.maxRequests,
      remaining,
      resetTimeMs,
    }
  }

  private cleanup(now: number) {
    this.lastCleanup = now
    const cutoff = now - this.windowMs
    for (const [key, timestamps] of this.requests.entries()) {
      const active = timestamps.filter((t) => t > cutoff)
      if (active.length === 0) {
        this.requests.delete(key)
      } else {
        this.requests.set(key, active)
      }
    }
  }
}

// Global singleton instance
export const rateLimiter = new SlidingWindowRateLimiter()

/**
 * Extract client IP from standard Next.js request headers
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")
  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }
  const realIp = req.headers.get("x-real-ip")
  if (realIp) {
    return realIp.trim()
  }
  return "127.0.0.1"
}

/**
 * Create standard rate-limiting response headers
 */
export function getRateLimitHeaders(result: RateLimitResult): HeadersInit {
  return {
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": Math.ceil(result.resetTimeMs / 1000).toString(),
  }
}
