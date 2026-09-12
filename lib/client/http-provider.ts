/**
 * Fenntrace — Client HTTP Exposure Provider
 *
 * Implements ExposureProvider interface on the frontend.
 * Calls the Next.js /api/check backend endpoint and falls back
 * to local demo provider if running in an isolated or offline demo environment.
 */

import type {
  ExposureProvider,
  ExposureProviderResult,
} from "@/domain/types"
import { DemoProvider } from "@/demo/provider"

export class HttpExposureProvider implements ExposureProvider {
  private fallbackProvider: DemoProvider

  constructor() {
    this.fallbackProvider = new DemoProvider()
  }

  async checkExposure(email: string): Promise<ExposureProviderResult> {
    try {
      const response = await fetch("/api/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email }),
      })

      // 429: Rate limited
      if (response.status === 429) {
        const errorData = await response.json().catch(() => ({}))
        return {
          type: "unavailable",
          source: errorData.source || "Fenntrace Security Gateway",
          reason:
            errorData.reason ||
            "You have made too many requests. Please wait a few moments before trying again.",
        }
      }

      // 400: Validation error
      if (response.status === 400) {
        const errorData = await response.json().catch(() => ({}))
        return {
          type: "error",
          message: errorData.message || "Invalid email address entered.",
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          type: "error",
          message:
            errorData.message ||
            `Server returned status ${response.status}. Please try again later.`,
        }
      }

      const data: ExposureProviderResult = await response.json()
      return data
    } catch (networkError) {
      console.warn(
        "[Fenntrace Client] API route unreachable or offline. Falling back to client demo engine.",
        networkError
      )
      // Fall back seamlessly to client demo provider in offline/sandbox mode
      return this.fallbackProvider.checkExposure(email)
    }
  }
}

export const httpExposureProvider = new HttpExposureProvider()
