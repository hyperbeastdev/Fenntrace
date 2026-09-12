/**
 * Fenntrace — Client Cryptography Utilities
 *
 * Implements client-side SHA-1 hashing using the Web Crypto API
 * for privacy-preserving k-Anonymity checks.
 *
 * The raw password NEVER leaves the client. Only the 5-character
 * SHA-1 prefix is transmitted to the server.
 */

export interface HashParts {
  fullHash: string
  prefix: string
  suffix: string
}

/**
 * Computes the SHA-1 hash of a string using the native Web Crypto API.
 * Returns the uppercase 40-character hexadecimal representation.
 */
export async function computeSha1(text: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest("SHA-1", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase()
}

/**
 * Computes the SHA-1 hash and splits it into the 5-character prefix
 * and 35-character suffix for k-Anonymity.
 */
export async function getKAnonymityParts(password: string): Promise<HashParts> {
  const fullHash = await computeSha1(password)
  const prefix = fullHash.slice(0, 5)
  const suffix = fullHash.slice(5)
  return { fullHash, prefix, suffix }
}

export interface PasswordStrength {
  score: number // 0 to 4
  label: "Very Weak" | "Weak" | "Fair" | "Strong" | "Very Strong"
  color: string
  feedback: string[]
}

/**
 * Evaluates password complexity without external heavy libraries.
 */
export function evaluatePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return { score: 0, label: "Very Weak", color: "bg-muted", feedback: ["Enter a password to evaluate."] }
  }

  let score = 0
  const feedback: string[] = []

  if (password.length >= 8) score += 1
  else feedback.push("Use at least 8 characters")

  if (password.length >= 14) score += 1

  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1
  else feedback.push("Combine uppercase and lowercase letters")

  if (/[0-9]/.test(password)) score += 0.5
  else feedback.push("Include at least one number")

  if (/[^A-Za-z0-9]/.test(password)) score += 0.5
  else feedback.push("Include at least one special character (!@#$%^&*)")

  const normalizedScore = Math.min(4, Math.floor(score))

  switch (normalizedScore) {
    case 0:
    case 1:
      return {
        score: normalizedScore,
        label: "Weak",
        color: "bg-ft-danger",
        feedback: feedback.length > 0 ? feedback : ["Password is very easy to guess"],
      }
    case 2:
      return {
        score: 2,
        label: "Fair",
        color: "bg-ft-caution",
        feedback: feedback.length > 0 ? feedback : ["Consider making your password longer"],
      }
    case 3:
      return {
        score: 3,
        label: "Strong",
        color: "bg-primary",
        feedback: ["Good complexity. Check if it has been exposed in a breach below."],
      }
    case 4:
    default:
      return {
        score: 4,
        label: "Very Strong",
        color: "bg-ft-success",
        feedback: ["Excellent complexity and length."],
      }
  }
}
