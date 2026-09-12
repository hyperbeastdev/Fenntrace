/**
 * Fenntrace — Have I Been Pwned (HIBP v3) Live Provider
 *
 * Implements ExposureProvider by calling the official HIBP v3 BreachedAccount API.
 */

import type {
  ExposureProvider,
  ExposureProviderResult,
  ExposureResult,
} from "@/domain/types"
import { deriveRiskLevel } from "@/domain/helpers"
import {
  mapHibpToBreachRecord,
  type HibpBreachResponse,
} from "@/lib/server/mapper"
import { maskEmail } from "@/lib/server/privacy"

export class HibpExposureProvider implements ExposureProvider {
  private apiKey: string
  private baseUrl = "https://haveibeenpwned.com/api/v3"

  constructor(apiKey: string) {
    this.apiKey = apiKey.trim()
  }

  async checkExposure(email: string): Promise<ExposureProviderResult> {
    const masked = maskEmail(email)
    const encodedEmail = encodeURIComponent(email.trim().toLowerCase())
    const url = `${this.baseUrl}/breachedaccount/${encodedEmail}?truncateResponse=false`

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "hibp-api-key": this.apiKey,
          "user-agent": "Fenntrace-Data-Exposure-Checker/1.0",
          Accept: "application/json",
        },
        // Prevent next.js caching of individual email lookups
        cache: "no-store",
      })

      // 404: No breaches found for this email (Clean)
      if (response.status === 404) {
        return {
          type: "notFound",
          source: "Have I Been Pwned",
        }
      }

      // 429: Rate limit hit
      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After") || "2"
        return {
          type: "unavailable",
          source: "Have I Been Pwned",
          reason: `Breach intelligence service is currently rate limited. Please try again in ${retryAfter} seconds.`,
        }
      }

      // 401 / 403: Invalid or missing API key
      if (response.status === 401 || response.status === 403) {
        return {
          type: "error",
          message: "Breach intelligence service authentication failed. Please check server configuration.",
        }
      }

      // 400: Bad Request
      if (response.status === 400) {
        return {
          type: "error",
          message: "The provided email address format was rejected by the breach registry.",
        }
      }

      if (!response.ok) {
        return {
          type: "error",
          message: `Breach service returned unexpected status: ${response.status}`,
        }
      }

      const rawBreaches: HibpBreachResponse[] = await response.json()

      if (!Array.isArray(rawBreaches) || rawBreaches.length === 0) {
        return {
          type: "notFound",
          source: "Have I Been Pwned",
        }
      }

      // Map raw breach records to Fenntrace BreachRecord format
      const breaches = rawBreaches.map((item, idx) => mapHibpToBreachRecord(item, idx))

      // Sort by breach date descending (newest first)
      breaches.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      const partialResult: ExposureResult = {
        exposureCount: breaches.length,
        source: "Have I Been Pwned",
        riskLevel: "low", // Will be properly derived below
        breaches,
      }

      // Compute precise risk level using domain logic
      const riskInfo = deriveRiskLevel(partialResult)
      partialResult.riskLevel = riskInfo.level

      return {
        type: "found",
        result: partialResult,
      }
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : "Network error"
      return {
        type: "error",
        message: `Failed to communicate with breach intelligence service: ${errMessage}`,
      }
    }
  }
}
