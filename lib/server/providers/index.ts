/**
 * Fenntrace — Provider Factory
 *
 * Selects and instantiates the appropriate exposure provider based on
 * environment variables and available credentials.
 *
 * Priority:
 * 1. Have I Been Pwned (HIBP v3 Live API) if HIBP_API_KEY is configured.
 * 2. XposedOrNot Live Free API (Real internet-wide breaches, zero API key required).
 * 3. Local Historical Breach Engine (Offline/Fallback).
 */

import type {
  ExposureProvider,
  ExposureProviderResult,
} from "@/domain/types"
import { HibpExposureProvider } from "./hibp-provider"
import { XposedOrNotProvider } from "./xposedornot-provider"
import { LocalBreachProvider } from "./local-breach-provider"

/**
 * Hybrid provider that tries live intelligence first and falls back to local database
 * if the live network connection fails.
 */
class HybridLiveProvider implements ExposureProvider {
  private liveProvider: ExposureProvider
  private fallbackProvider: LocalBreachProvider

  constructor(liveProvider: ExposureProvider) {
    this.liveProvider = liveProvider
    this.fallbackProvider = new LocalBreachProvider()
  }

  async checkExposure(email: string): Promise<ExposureProviderResult> {
    const liveResult = await this.liveProvider.checkExposure(email)

    // If live provider succeeded or properly found/notFound/unavailable, return it
    if (liveResult.type !== "error") {
      return liveResult
    }

    // Only on communication/network failure, fall back to realistic offline engine
    console.warn(
      "[Fenntrace] Live breach query failed, falling back to local verified breach engine."
    )
    return this.fallbackProvider.checkExposure(email)
  }
}

export function getExposureProvider(): {
  provider: ExposureProvider
  name: string
  mode: "hibp-live" | "xposedornot-live" | "local-dataset"
} {
  const apiKey = process.env.HIBP_API_KEY?.trim()
  const explicitProvider = process.env.FENNTRACE_PROVIDER?.toLowerCase().trim()

  // 1. Explicit or auto HIBP if API key is provided
  if (explicitProvider === "hibp" || (apiKey && explicitProvider !== "local" && explicitProvider !== "xposedornot")) {
    if (!apiKey) {
      console.warn(
        "[Fenntrace Server] HIBP requested but HIBP_API_KEY is missing. Using XposedOrNot live free provider."
      )
      return {
        provider: new HybridLiveProvider(new XposedOrNotProvider()),
        name: "XposedOrNot Live Breach Intelligence",
        mode: "xposedornot-live",
      }
    }

    return {
      provider: new HibpExposureProvider(apiKey),
      name: "Have I Been Pwned (HIBP v3 Live API)",
      mode: "hibp-live",
    }
  }

  // 2. Explicit local mode
  if (explicitProvider === "local") {
    return {
      provider: new LocalBreachProvider(),
      name: "Fenntrace Local Breach Engine",
      mode: "local-dataset",
    }
  }

  // 3. Default: Live Free XposedOrNot Provider with hybrid fallback
  return {
    provider: new HybridLiveProvider(new XposedOrNotProvider()),
    name: "XposedOrNot Live Breach Intelligence (Free)",
    mode: "xposedornot-live",
  }
}
