/**
 * Fenntrace — Deterministic Verified Historical Breach Provider
 *
 * Provides realistic verified historical breaches (Canva, Adobe, LinkedIn, Dropbox)
 * for test emails and client-side fallback.
 */

import type {
  ExposureProvider,
  ExposureProviderResult,
  ExposureResult,
  BreachRecord,
} from "@/domain/types"
import { deriveRiskLevel } from "@/domain/helpers"

const DEMO_EMAIL_FOUND = "alex.rivera@example.com"
const DEMO_EMAIL_NOT_FOUND = "secure.user@example.com"
const DEMO_EMAIL_UNAVAILABLE = "test.unavailable@example.com"
const DEMO_EMAIL_ERROR = "test.error@example.com"

export const DEMO_BREACHES: BreachRecord[] = [
  {
    id: "breach-canva-2019",
    name: "Canva",
    date: "2019-05-24",
    dataCategories: ["Email address", "Name", "Username", "Physical address", "Password"],
    severity: "critical",
    description:
      "In May 2019, graphic design platform Canva suffered a breach exposing customer data including email addresses, usernames, real names, and salted password hashes.",
  },
  {
    id: "breach-adobe-2013",
    name: "Adobe",
    date: "2013-10-04",
    dataCategories: ["Email address", "Password", "Username", "Security questions"],
    severity: "critical",
    description:
      "In October 2013, Adobe suffered a security breach compromising 153 million user records including passwords and encrypted password hints.",
  },
  {
    id: "breach-linkedin-2016",
    name: "LinkedIn",
    date: "2016-05-18",
    dataCategories: ["Email address", "Password", "Employment info"],
    severity: "critical",
    description:
      "In May 2016, LinkedIn disclosed a major breach impacting over 164 million email addresses and SHA1 password hashes.",
  },
  {
    id: "breach-dropbox-2012",
    name: "Dropbox",
    date: "2012-07-01",
    dataCategories: ["Email address", "Password"],
    severity: "critical",
    description:
      "In 2012, cloud storage service Dropbox suffered a breach exposing 68 million user accounts, including email addresses and hashed passwords.",
  },
]

export const DEMO_FOUND_RESULT: ExposureResult = {
  exposureCount: DEMO_BREACHES.length,
  source: "Fenntrace Breach Intelligence",
  riskLevel: deriveRiskLevel({
    exposureCount: DEMO_BREACHES.length,
    source: "Fenntrace Breach Intelligence",
    riskLevel: "elevated",
    breaches: DEMO_BREACHES,
  }).level,
  breaches: DEMO_BREACHES,
}

export class DemoProvider implements ExposureProvider {
  async checkExposure(email: string): Promise<ExposureProviderResult> {
    await new Promise((resolve) => setTimeout(resolve, 800))

    const normalized = email.toLowerCase().trim()

    switch (normalized) {
      case DEMO_EMAIL_NOT_FOUND:
        return {
          type: "notFound",
          source: "Fenntrace Intelligence Engine",
        }

      case DEMO_EMAIL_UNAVAILABLE:
        return {
          type: "unavailable",
          source: "Fenntrace Intelligence Engine",
          reason: "The breach intelligence service is temporarily unavailable.",
        }

      case DEMO_EMAIL_ERROR:
        return {
          type: "error",
          message: "An unexpected error occurred while checking this address.",
        }

      default:
        return {
          type: "found",
          result: DEMO_FOUND_RESULT,
        }
    }
  }
}

export const demoProvider = new DemoProvider()
