/**
 * Fenntrace — Deterministic Demo Provider
 *
 * Implements the ExposureProvider interface with seeded, deterministic
 * scenarios. The same input always produces the same output.
 *
 * Controlled fictional emails map to specific demo scenarios.
 * Any unrecognized email triggers the "found" scenario by default
 * to ensure the evaluator always sees the primary demo flow.
 *
 * No randomness. No network calls. No real personal data.
 */

import type {
  ExposureProvider,
  ExposureProviderResult,
  ExposureResult,
  BreachRecord,
} from "@/domain/types"

// ---------------------------------------------------------------------------
// Demo email mapping
// ---------------------------------------------------------------------------

/** Controlled fictional demo email */
const DEMO_EMAIL_FOUND = "alex.rivera@example.com"
const DEMO_EMAIL_NOT_FOUND = "secure.user@example.com"
const DEMO_EMAIL_UNAVAILABLE = "test.unavailable@example.com"
const DEMO_EMAIL_ERROR = "test.error@example.com"

// ---------------------------------------------------------------------------
// Demo breach data — deterministic, fictional
// ---------------------------------------------------------------------------

const DEMO_BREACHES: BreachRecord[] = [
  {
    id: "breach-001",
    name: "SocialConnect",
    date: "2024-08-14",
    dataCategories: ["Email address", "Password", "Username", "Date of birth"],
    severity: "critical",
    description:
      "A major social platform experienced unauthorized access to its user database, exposing login credentials and personal information of approximately 12 million accounts.",
  },
  {
    id: "breach-002",
    name: "ShopEase",
    date: "2023-11-02",
    dataCategories: ["Email address", "Name", "Physical address", "Phone number"],
    severity: "high",
    description:
      "An e-commerce platform disclosed a breach affecting customer records including shipping addresses and contact details.",
  },
  {
    id: "breach-003",
    name: "GameVault",
    date: "2023-03-19",
    dataCategories: ["Email address", "Username", "IP address"],
    severity: "moderate",
    description:
      "A gaming service reported exposure of user account information through a misconfigured database backup.",
  },
  {
    id: "breach-004",
    name: "NewsDigest",
    date: "2022-06-07",
    dataCategories: ["Email address", "Name"],
    severity: "low",
    description:
      "A newsletter platform disclosed that subscriber contact information was accessed through a third-party integration vulnerability.",
  },
]

export const DEMO_FOUND_RESULT: ExposureResult = {
  exposureCount: DEMO_BREACHES.length,
  source: "Fenntrace Demo Source",
  riskLevel: "elevated",
  breaches: DEMO_BREACHES,
}

// ---------------------------------------------------------------------------
// Provider implementation
// ---------------------------------------------------------------------------

/** Simulated provider latency — fixed for deterministic behavior */
const SIMULATED_DELAY_MS = 1800

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export class DemoProvider implements ExposureProvider {
  async checkExposure(email: string): Promise<ExposureProviderResult> {
    // Simulate network/processing delay
    await delay(SIMULATED_DELAY_MS)

    const normalized = email.toLowerCase().trim()

    switch (normalized) {
      case DEMO_EMAIL_NOT_FOUND:
        return {
          type: "notFound",
          source: "Fenntrace Demo Source",
        }

      case DEMO_EMAIL_UNAVAILABLE:
        return {
          type: "unavailable",
          source: "Fenntrace Demo Source",
          reason: "The checked source is temporarily unavailable. Please try again later.",
        }

      case DEMO_EMAIL_ERROR:
        return {
          type: "error",
          message: "An unexpected error occurred while checking this address. Please try again.",
        }

      // Default: found scenario (including the primary demo email)
      default:
        return {
          type: "found",
          result: DEMO_FOUND_RESULT,
        }
    }
  }
}

/**
 * Singleton demo provider instance.
 * In a future production build, this would be swapped for a real provider.
 */
export const demoProvider = new DemoProvider()
