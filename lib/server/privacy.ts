/**
 * Fenntrace — Privacy & Zero-Retention Utilities
 *
 * Enforces Fenntrace's core principle: privacy by design.
 * Masks personal data in diagnostics, generates one-way hashes for
 * k-Anonymity checks, and provides strict privacy HTTP headers.
 */

import { createHash } from "crypto"

/**
 * Masks an email address for safe diagnostic logging without leaking
 * personal identifying information.
 *
 * Example: 'alex.rivera@example.com' -> 'al***a@example.com'
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return "***@***"

  const [local, domain] = email.split("@")
  if (local.length <= 2) {
    return `*@${domain}`
  }

  const maskedLocal = `${local[0]}${"*".repeat(Math.min(local.length - 2, 4))}${local[local.length - 1]}`
  return `${maskedLocal}@${domain}`
}

/**
 * Computes the SHA-1 hash of a string (uppercase, standard for HIBP k-Anonymity APIs).
 */
export function sha1(input: string): string {
  return createHash("sha1").update(input).digest("hex").toUpperCase()
}

/**
 * Computes the SHA-256 hash of a normalized string.
 */
export function sha256(input: string): string {
  return createHash("sha256").update(input.trim().toLowerCase()).digest("hex")
}

/**
 * Privacy headers that prevent proxies, edge nodes, and browsers
 * from caching sensitive check results.
 */
export const PRIVACY_NO_STORE_HEADERS: HeadersInit = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
}
