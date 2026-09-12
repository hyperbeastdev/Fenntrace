/**
 * Fenntrace — Exposure Check API Route
 *
 * POST /api/check
 *
 * Investigates whether a given email address appears in breach databases.
 * Applies rate limiting, privacy-preserving zero-log measures, and returns
 * structured breach data.
 */

import { NextResponse } from "next/server"
import { isValidEmail } from "@/domain/helpers"
import { getExposureProvider } from "@/lib/server/providers"
import {
  rateLimiter,
  getClientIp,
  getRateLimitHeaders,
} from "@/lib/server/rate-limiter"
import { maskEmail, PRIVACY_NO_STORE_HEADERS } from "@/lib/server/privacy"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(req: Request) {
  const clientIp = getClientIp(req)
  const rateLimitResult = rateLimiter.check(clientIp)
  const rateLimitHeaders = getRateLimitHeaders(rateLimitResult)

  // 1. Rate Limiting Check
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      {
        type: "unavailable",
        source: "Fenntrace Security Gateway",
        reason: "Too many requests. Please wait a moment before trying again.",
      },
      {
        status: 429,
        headers: {
          ...PRIVACY_NO_STORE_HEADERS,
          ...rateLimitHeaders,
          "Retry-After": Math.ceil(
            (rateLimitResult.resetTimeMs - Date.now()) / 1000
          ).toString(),
        },
      }
    )
  }

  // 2. Parse & Validate Body
  let body: { email?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      {
        type: "error",
        message: "Invalid JSON request body.",
      },
      {
        status: 400,
        headers: {
          ...PRIVACY_NO_STORE_HEADERS,
          ...rateLimitHeaders,
        },
      }
    )
  }

  const { email } = body

  if (!email || typeof email !== "string" || !isValidEmail(email)) {
    return NextResponse.json(
      {
        type: "error",
        message: "Please enter a valid email address.",
      },
      {
        status: 400,
        headers: {
          ...PRIVACY_NO_STORE_HEADERS,
          ...rateLimitHeaders,
        },
      }
    )
  }

  // 3. Mask email for privacy-safe execution log
  const masked = maskEmail(email)
  console.info(`[Fenntrace API] Query received for ${masked} (IP: ${clientIp})`)

  // 4. Query configured provider
  try {
    const { provider } = getExposureProvider()
    const result = await provider.checkExposure(email.trim().toLowerCase())

    return NextResponse.json(result, {
      status: 200,
      headers: {
        ...PRIVACY_NO_STORE_HEADERS,
        ...rateLimitHeaders,
      },
    })
  } catch (error) {
    console.error("[Fenntrace API] Exposure check failed:", error)
    return NextResponse.json(
      {
        type: "error",
        message: "An unexpected error occurred while checking this address.",
      },
      {
        status: 500,
        headers: {
          ...PRIVACY_NO_STORE_HEADERS,
          ...rateLimitHeaders,
        },
      }
    )
  }
}
