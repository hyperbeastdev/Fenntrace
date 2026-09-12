/**
 * Fenntrace — Backend Health & Status API Route
 *
 * GET /api/health
 */

import { NextResponse } from "next/server"
import { getExposureProvider } from "@/lib/server/providers"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  const { name, mode } = getExposureProvider()

  return NextResponse.json(
    {
      status: "healthy",
      service: "Fenntrace Exposure Intelligence API",
      timestamp: new Date().toISOString(),
      provider: {
        name,
        mode,
        isLiveHibp: mode === "hibp-live",
      },
      features: {
        emailExposureCheck: true,
        passwordKAnonymityCheck: true,
        breachCatalog: true,
        slidingWindowRateLimiting: true,
        zeroDataRetention: true,
      },
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    }
  )
}
