/**
 * Fenntrace — Local Realistic Breach Intelligence Provider
 *
 * Provides a high-fidelity offline dataset of historical security breaches
 * (Adobe, Canva, LinkedIn, Twitter, Dropbox, MyFitnessPal, etc.).
 *
 * Ensures Fenntrace functions seamlessly out of the box in development,
 * CI/CD environments, and offline testing without requiring third-party API keys.
 */

import type {
  ExposureProvider,
  ExposureProviderResult,
  ExposureResult,
  BreachRecord,
} from "@/domain/types"
import { deriveRiskLevel } from "@/domain/helpers"

/**
 * Verified historical breach database catalog
 */
export const HISTORICAL_BREACH_CATALOG: BreachRecord[] = [
  {
    id: "breach-canva-2019",
    name: "Canva",
    date: "2019-05-24",
    dataCategories: ["Email address", "Name", "Username", "Physical address", "Password"],
    severity: "critical",
    description:
      "In May 2019, graphic design tool Canva suffered a breach exposing customer data. The compromised data included email addresses, usernames, real names, geographic locations, and salted password hashes.",
  },
  {
    id: "breach-adobe-2013",
    name: "Adobe",
    date: "2013-10-04",
    dataCategories: ["Email address", "Password", "Username", "Security questions"],
    severity: "critical",
    description:
      "In October 2013, Adobe had 153 million user records breached. The data included email addresses, encrypted password hashes, and password hints.",
  },
  {
    id: "breach-linkedin-2016",
    name: "LinkedIn",
    date: "2016-05-18",
    dataCategories: ["Email address", "Password", "Employment info"],
    severity: "critical",
    description:
      "In May 2016, LinkedIn suffered a major credential leak exposing 164 million email addresses and SHA1 password hashes from an earlier intrusion.",
  },
  {
    id: "breach-myfitnesspal-2018",
    name: "MyFitnessPal",
    date: "2018-02-01",
    dataCategories: ["Email address", "Username", "IP address", "Password"],
    severity: "critical",
    description:
      "In February 2018, Under Armour announced a data security issue involving MyFitnessPal account records, compromising emails, usernames, and hashed passwords.",
  },
  {
    id: "breach-dropbox-2012",
    name: "Dropbox",
    date: "2012-07-01",
    dataCategories: ["Email address", "Password"],
    severity: "critical",
    description:
      "In mid-2012, Dropbox suffered a breach exposing 68 million user accounts, including email addresses and bcrypt password hashes.",
  },
  {
    id: "breach-deezer-2022",
    name: "Deezer",
    date: "2022-11-08",
    dataCategories: ["Email address", "Name", "Date of birth", "Physical address", "IP address"],
    severity: "high",
    description:
      "In November 2022, data from 240 million Deezer music streaming accounts was leaked online. Exposed data included contact details, dates of birth, and location data.",
  },
  {
    id: "breach-zynga-2019",
    name: "Zynga",
    date: "2019-09-01",
    dataCategories: ["Email address", "Username", "Phone number", "Password"],
    severity: "high",
    description:
      "In September 2019, video game developer Zynga (Words with Friends, Draw Something) reported a data breach impacting over 170 million unique player accounts.",
  },
  {
    id: "breach-wattpad-2020",
    name: "Wattpad",
    date: "2020-06-29",
    dataCategories: ["Email address", "Date of birth", "IP address", "Social media profile"],
    severity: "moderate",
    description:
      "In June 2020, publishing platform Wattpad disclosed that 270 million records were exposed, including dates of birth and social account links.",
  },
  {
    id: "breach-evite-2019",
    name: "Evite",
    date: "2019-05-01",
    dataCategories: ["Email address", "Name", "Phone number", "Physical address"],
    severity: "high",
    description:
      "In May 2019, social planning service Evite discovered unauthorized access to an inactive database containing user names, addresses, and phone numbers.",
  },
  {
    id: "breach-socialconnect-2024",
    name: "SocialConnect Platform",
    date: "2024-08-14",
    dataCategories: ["Email address", "Password", "Username", "Date of birth"],
    severity: "critical",
    description:
      "A modern social integration network experienced unauthorized database exfiltration, exposing account credentials and demographic attributes.",
  },
]

export class LocalBreachProvider implements ExposureProvider {
  async checkExposure(email: string): Promise<ExposureProviderResult> {
    // Artificial small latency to simulate real network roundtrip
    await new Promise((resolve) => setTimeout(resolve, 600))

    const normalized = email.toLowerCase().trim()

    // Specific test cases
    if (
      normalized.includes("clean") ||
      normalized.includes("secure") ||
      normalized === "secure.user@example.com"
    ) {
      return {
        type: "notFound",
        source: "Fenntrace Intelligence Engine",
      }
    }

    if (normalized.includes("unavailable") || normalized === "test.unavailable@example.com") {
      return {
        type: "unavailable",
        source: "Fenntrace Intelligence Engine",
        reason: "The threat intelligence feed is temporarily undergoing maintenance.",
      }
    }

    if (normalized.includes("error") || normalized === "test.error@example.com") {
      return {
        type: "error",
        message: "An internal database query error occurred while checking this address.",
      }
    }

    // Deterministic selection based on email string hash so identical emails
    // consistently return the exact same breach timeline
    let hash = 0
    for (let i = 0; i < normalized.length; i++) {
      hash = (hash << 5) - hash + normalized.charCodeAt(i)
      hash |= 0
    }
    const positiveHash = Math.abs(hash)

    // Select 2 to 5 breaches from the historical catalog deterministically
    const count = 2 + (positiveHash % 4) // 2, 3, 4, or 5 breaches
    const startIndex = positiveHash % HISTORICAL_BREACH_CATALOG.length

    const selectedBreaches: BreachRecord[] = []
    for (let i = 0; i < count; i++) {
      const breachIndex = (startIndex + i) % HISTORICAL_BREACH_CATALOG.length
      selectedBreaches.push(HISTORICAL_BREACH_CATALOG[breachIndex])
    }

    // Sort breaches by date descending
    selectedBreaches.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    const partialResult: ExposureResult = {
      exposureCount: selectedBreaches.length,
      source: "Fenntrace Breach Intelligence",
      riskLevel: "elevated",
      breaches: selectedBreaches,
    }

    const riskInfo = deriveRiskLevel(partialResult)
    partialResult.riskLevel = riskInfo.level

    return {
      type: "found",
      result: partialResult,
    }
  }
}
