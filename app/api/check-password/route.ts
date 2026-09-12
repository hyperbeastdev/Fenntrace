/**
 * Fenntrace — Password Exposure Check API (k-Anonymity)
 *
 * POST /api/check-password
 *
 * Uses the HIBP Pwned Passwords Range API with k-Anonymity.
 * Receives the first 5 hexadecimal characters of the SHA-1 hash of a password,
 * fetches candidate hash suffixes, and returns matches without ever learning
 * the user's plain-text password or full hash.
 */

import { NextResponse } from "next/server"
import {
  rateLimiter,
  getClientIp,
  getRateLimitHeaders,
} from "@/lib/server/rate-limiter"
import { PRIVACY_NO_STORE_HEADERS } from "@/lib/server/privacy"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(req: Request) {
  const clientIp = getClientIp(req)
  const rateLimitResult = rateLimiter.check(clientIp)
  const rateLimitHeaders = getRateLimitHeaders(rateLimitResult)

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { ...PRIVACY_NO_STORE_HEADERS, ...rateLimitHeaders } }
    )
  }

  let body: { hashPrefix?: string; hashSuffix?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body." },
      { status: 400, headers: { ...PRIVACY_NO_STORE_HEADERS, ...rateLimitHeaders } }
    )
  }

  const { hashPrefix, hashSuffix } = body

  // Validate 5-character prefix format (hexadecimal)
  if (!hashPrefix || !/^[0-9A-Fa-f]{5}$/.test(hashPrefix)) {
    return NextResponse.json(
      {
        error:
          "Invalid hashPrefix. Must provide the first 5 characters of a SHA-1 hash in hexadecimal.",
      },
      { status: 400, headers: { ...PRIVACY_NO_STORE_HEADERS, ...rateLimitHeaders } }
    )
  }

  try {
    const response = await fetch(
      `https://api.pwnedpasswords.com/range/${hashPrefix.toUpperCase()}`,
      {
        headers: {
          "User-Agent": "Fenntrace-Password-Checker/1.0",
          "Add-Padding": "true", // Mitigate side-channel response size attacks
        },
        cache: "no-store",
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to query password breach intelligence registry." },
        { status: 502, headers: { ...PRIVACY_NO_STORE_HEADERS, ...rateLimitHeaders } }
      )
    }

    const text = await response.text()
    const lines = text.split("\r\n")

    let count = 0
    let found = false

    // If a full hash suffix is supplied, match directly on server and return count
    if (hashSuffix && /^[0-9A-Fa-f]{35}$/.test(hashSuffix)) {
      const targetSuffix = hashSuffix.toUpperCase()
      for (const line of lines) {
        const [suffix, rawCount] = line.split(":")
        if (suffix && suffix.toUpperCase() === targetSuffix) {
          count = parseInt(rawCount, 10) || 0
          found = count > 0
          break
        }
      }

      return NextResponse.json(
        {
          found,
          occurrences: count,
          kAnonymityPrefix: hashPrefix.toUpperCase(),
        },
        { status: 200, headers: { ...PRIVACY_NO_STORE_HEADERS, ...rateLimitHeaders } }
      )
    }

    // Otherwise return list of suffixes for client-side local comparison
    return NextResponse.json(
      {
        kAnonymityPrefix: hashPrefix.toUpperCase(),
        suffixes: lines.map((l) => l.split(":")[0]).filter(Boolean),
      },
      { status: 200, headers: { ...PRIVACY_NO_STORE_HEADERS, ...rateLimitHeaders } }
    )
  } catch (error) {
    console.error("[Fenntrace API] Password check error:", error)
    return NextResponse.json(
      { error: "Internal error processing password check." },
      { status: 500, headers: { ...PRIVACY_NO_STORE_HEADERS, ...rateLimitHeaders } }
    )
  }
}
