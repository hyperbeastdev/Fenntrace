/**
 * Fenntrace — Breaches Catalog API Route
 *
 * GET /api/breaches
 *
 * Returns catalog of known breaches, counts, and metadata.
 */

import { NextResponse } from "next/server"
import { HISTORICAL_BREACH_CATALOG } from "@/lib/server/providers/local-breach-provider"
import {
  rateLimiter,
  getClientIp,
  getRateLimitHeaders,
} from "@/lib/server/rate-limiter"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(req: Request) {
  const clientIp = getClientIp(req)
  const rateLimitResult = rateLimiter.check(clientIp)
  const rateLimitHeaders = getRateLimitHeaders(rateLimitResult)

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: rateLimitHeaders }
    )
  }

  const breaches = HISTORICAL_BREACH_CATALOG

  const totalIndexedBreaches = breaches.length
  const criticalCount = breaches.filter((b) => b.severity === "critical").length
  const highCount = breaches.filter((b) => b.severity === "high").length

  return NextResponse.json(
    {
      totalIndexedBreaches,
      stats: {
        critical: criticalCount,
        high: highCount,
        moderate: breaches.filter((b) => b.severity === "moderate").length,
      },
      breaches,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        ...rateLimitHeaders,
      },
    }
  )
}
