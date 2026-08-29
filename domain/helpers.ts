/**
 * Fenntrace — Domain Helpers
 *
 * Pure functions for severity mapping, risk derivation, copy helpers,
 * and email validation.
 *
 * No React imports. No side effects.
 */

import type {
  BreachRecord,
  Severity,
  SeverityInfo,
  RiskLevel,
  RiskInfo,
  ActionItem,
  ExposureResult,
} from "./types"

// ---------------------------------------------------------------------------
// Email validation
// ---------------------------------------------------------------------------

/**
 * Basic email format validation.
 * Not a full RFC 5322 implementation — just enough to prevent
 * obviously invalid submissions.
 */
export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false
  // Must have exactly one @, non-empty local and domain parts,
  // domain must have at least one dot
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return pattern.test(email)
}

// ---------------------------------------------------------------------------
// Severity
// ---------------------------------------------------------------------------

const SEVERITY_INFO: Record<Severity, SeverityInfo> = {
  critical: {
    level: "critical",
    label: "Critical",
    description: "Passwords or financial data exposed — immediate action required",
  },
  high: {
    level: "high",
    label: "High",
    description: "Personal identity data exposed with significant risk of misuse",
  },
  moderate: {
    level: "moderate",
    label: "Moderate",
    description: "Contact information or usernames exposed",
  },
  low: {
    level: "low",
    label: "Low",
    description: "Limited data exposed with lower immediate risk",
  },
}

export function getSeverityInfo(severity: Severity): SeverityInfo {
  return SEVERITY_INFO[severity]
}

// ---------------------------------------------------------------------------
// Risk derivation
// ---------------------------------------------------------------------------

/**
 * Derives the overall risk level from a set of breach records.
 * Uses the highest individual severity as the primary signal,
 * with exposure count as a secondary factor.
 */
export function deriveRiskLevel(result: ExposureResult): RiskInfo {
  const { breaches } = result

  const hasCritical = breaches.some((b) => b.severity === "critical")
  const hasHigh = breaches.some((b) => b.severity === "high")
  const hasModerate = breaches.some((b) => b.severity === "moderate")

  if (hasCritical || (hasHigh && breaches.length >= 3)) {
    return {
      level: "severe",
      headline: "Significant exposure detected",
      explanation:
        "Sensitive data including passwords or financial information appeared in multiple breaches. Immediate action is recommended.",
    }
  }

  if (hasHigh) {
    return {
      level: "elevated",
      headline: "Elevated exposure detected",
      explanation:
        "Personal identity data appeared in known breaches. Review the exposed categories and take the recommended actions.",
    }
  }

  if (hasModerate || breaches.length >= 2) {
    return {
      level: "moderate",
      headline: "Moderate exposure detected",
      explanation:
        "Some personal data appeared in known breaches. While the immediate risk is limited, reviewing your account security is recommended.",
    }
  }

  return {
    level: "low",
    headline: "Limited exposure detected",
    explanation:
      "A small amount of data appeared in a known breach. The exposure is limited, but basic precautions are still recommended.",
    }
}

// ---------------------------------------------------------------------------
// Action plan
// ---------------------------------------------------------------------------

/**
 * Generates a prioritized action plan based on the exposure result.
 * Actions are ordered by impact — the most critical step comes first.
 */
export function getActionPlan(result: ExposureResult): ActionItem[] {
  const hasPasswords = result.breaches.some((b) =>
    b.dataCategories.includes("Password")
  )
  const hasFinancial = result.breaches.some((b) =>
    b.dataCategories.includes("Financial data")
  )
  const hasPhone = result.breaches.some((b) =>
    b.dataCategories.includes("Phone number")
  )

  const actions: ActionItem[] = []
  let order = 1

  if (hasPasswords) {
    actions.push({
      order: order++,
      action: "Change affected passwords immediately",
      rationale:
        "Exposed passwords can be used to access your accounts, especially if reused across services.",
    })
  }

  actions.push({
    order: order++,
    action: "Enable two-factor authentication",
    rationale:
      "A second verification step significantly reduces the risk of unauthorized access, even if a password is compromised.",
  })

  if (hasFinancial) {
    actions.push({
      order: order++,
      action: "Monitor financial accounts for unauthorized activity",
      rationale:
        "Exposed financial data may be used for fraudulent transactions or identity theft.",
    })
  }

  if (hasPhone) {
    actions.push({
      order: order++,
      action: "Be cautious of unexpected calls or messages",
      rationale:
        "Exposed phone numbers may be used for phishing attempts or social engineering.",
    })
  }

  actions.push({
    order: order++,
    action: "Review accounts associated with this email",
    rationale:
      "Check services where you used this email address and update any shared or weak credentials.",
  })

  // Cap at 5 actions as per the blueprint (3–5 ordered actions)
  return actions.slice(0, 5)
}

// ---------------------------------------------------------------------------
// Copy helpers
// ---------------------------------------------------------------------------

/**
 * Returns the appropriate status headline for a found result.
 */
export function getStatusHeadline(result: ExposureResult): string {
  const count = result.exposureCount
  if (count === 1) {
    return "1 exposure record found"
  }
  return `${count} exposure records found`
}

/**
 * Formats a date string into a human-readable format.
 * Assumes ISO date strings (YYYY-MM-DD).
 */
export function formatBreachDate(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    })
  } catch {
    return dateStr
  }
}
