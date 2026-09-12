/**
 * Fenntrace — XposedOrNot Live Free Breach Intelligence Provider
 *
 * Connects to the open-access XposedOrNot live breach database API.
 * Performs real-time internet-wide breach lookups for any email address
 * without requiring a paid API key.
 */

import type {
  ExposureProvider,
  ExposureProviderResult,
  ExposureResult,
  BreachRecord,
} from "@/domain/types"
import { deriveRiskLevel } from "@/domain/helpers"
import {
  mapDataClassesToCategories,
  calculateBreachSeverity,
  stripHtml,
} from "@/lib/server/mapper"
import { maskEmail } from "@/lib/server/privacy"

interface XonBreachDetail {
  breach?: string
  description?: string
  details?: string
  domain?: string
  industry?: string
  logo?: string
  password_risk?: string
  searchable?: string
  verified?: string
  xexposed_data?: string
  xexposed_date?: string
  xexposed_records?: number
}

interface XonAnalyticsResponse {
  ExposedBreaches?: {
    breaches_details?: XonBreachDetail[]
  }
  BreachesSummary?: {
    site?: string
  }
  Error?: string
  status?: string
}

export class XposedOrNotProvider implements ExposureProvider {
  private baseUrl = "https://api.xposedornot.com/v1"

  async checkExposure(email: string): Promise<ExposureProviderResult> {
    const normalized = email.trim().toLowerCase()
    const masked = maskEmail(normalized)

    try {
      const url = `${this.baseUrl}/breach-analytics?email=${encodeURIComponent(normalized)}`
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent": "Fenntrace-Data-Exposure-Checker/1.0",
          Accept: "application/json",
        },
        cache: "no-store",
      })

      // 404: No breaches found (Clean)
      if (response.status === 404) {
        return {
          type: "notFound",
          source: "XposedOrNot Open Breach Intelligence",
        }
      }

      if (!response.ok) {
        return {
          type: "error",
          message: `Breach service returned status ${response.status}`,
        }
      }

      const data: XonAnalyticsResponse = await response.json()

      // Handle not found error message from API
      if (
        data.Error?.toLowerCase().includes("not found") ||
        data.status === "fail" ||
        !data.ExposedBreaches?.breaches_details
      ) {
        return {
          type: "notFound",
          source: "XposedOrNot Open Breach Intelligence",
        }
      }

      const rawBreaches = data.ExposedBreaches.breaches_details
      if (!Array.isArray(rawBreaches) || rawBreaches.length === 0) {
        return {
          type: "notFound",
          source: "XposedOrNot Open Breach Intelligence",
        }
      }

      // Map raw breaches into Fenntrace domain BreachRecord
      const breaches: BreachRecord[] = rawBreaches.map((item, idx) => {
        const rawDataClasses = item.xexposed_data
          ? item.xexposed_data.split(/[;,]/).map((s) => s.trim()).filter(Boolean)
          : ["Email addresses"]

        const categories = mapDataClassesToCategories(rawDataClasses)
        const severity = calculateBreachSeverity(categories)
        const name = item.breach || `Breach #${idx + 1}`
        const rawDesc = item.details || item.description || `Data exposure reported for ${name}.`

        return {
          id: `xon-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${idx}`,
          name,
          date: item.xexposed_date || "2023-01-01",
          dataCategories: categories,
          severity,
          description: stripHtml(rawDesc),
        }
      })

      // Sort breaches by date descending (newest first)
      breaches.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      const partialResult: ExposureResult = {
        exposureCount: breaches.length,
        source: "XposedOrNot Open Breach Intelligence",
        riskLevel: "low",
        breaches,
      }

      const riskInfo = deriveRiskLevel(partialResult)
      partialResult.riskLevel = riskInfo.level

      return {
        type: "found",
        result: partialResult,
      }
    } catch (error) {
      console.warn(`[XposedOrNotProvider] Live query failed for ${masked}:`, error)
      return {
        type: "error",
        message: "Failed to connect to live breach intelligence registry.",
      }
    }
  }
}
