/**
 * Fenntrace — Domain Types
 *
 * Core domain model for the exposure check flow.
 * These types define the data contract between the UI, feature layer,
 * and provider boundary.
 *
 * No React imports. No side effects. Pure type definitions.
 */

// ---------------------------------------------------------------------------
// State Machine
// ---------------------------------------------------------------------------

/**
 * Discriminated union representing every possible state of an exposure check.
 * The UI renders exactly one of these states at any time.
 */
export type CheckState =
  | { status: "idle" }
  | { status: "invalid"; email: string; error: string }
  | { status: "checking"; email: string }
  | { status: "found"; email: string; result: ExposureResult }
  | { status: "notFound"; email: string; source: string }
  | { status: "unavailable"; source: string; reason: string }
  | { status: "error"; message: string }
  | { status: "cleared" }

// ---------------------------------------------------------------------------
// Exposure Result
// ---------------------------------------------------------------------------

export interface ExposureResult {
  /** Total number of breaches found */
  exposureCount: number
  /** The source/provider that was checked */
  source: string
  /** Overall risk level derived from breach data */
  riskLevel: RiskLevel
  /** Individual breach records */
  breaches: BreachRecord[]
}

// ---------------------------------------------------------------------------
// Breach Record
// ---------------------------------------------------------------------------

export interface BreachRecord {
  /** Unique identifier for this breach */
  id: string
  /** Organization or service that was breached */
  name: string
  /** Date the breach occurred or was discovered */
  date: string
  /** Categories of data exposed in this breach */
  dataCategories: DataCategory[]
  /** Severity assessment for this specific breach */
  severity: Severity
  /** Brief description of the breach */
  description: string
}

// ---------------------------------------------------------------------------
// Data Categories
// ---------------------------------------------------------------------------

/**
 * Plain-language categories of exposed data.
 * These map to the user-facing chips shown on breach cards.
 */
export type DataCategory =
  | "Email address"
  | "Password"
  | "Username"
  | "Phone number"
  | "Physical address"
  | "Date of birth"
  | "IP address"
  | "Security questions"
  | "Name"
  | "Social media profile"
  | "Financial data"
  | "Employment info"

// ---------------------------------------------------------------------------
// Severity
// ---------------------------------------------------------------------------

export type Severity = "critical" | "high" | "moderate" | "low"

export interface SeverityInfo {
  level: Severity
  label: string
  description: string
}

// ---------------------------------------------------------------------------
// Risk Level
// ---------------------------------------------------------------------------

export type RiskLevel = "severe" | "elevated" | "moderate" | "low"

export interface RiskInfo {
  level: RiskLevel
  headline: string
  explanation: string
}

// ---------------------------------------------------------------------------
// Action Plan
// ---------------------------------------------------------------------------

export interface ActionItem {
  /** Display order (1-based) */
  order: number
  /** Short imperative action */
  action: string
  /** One-line rationale */
  rationale: string
}

// ---------------------------------------------------------------------------
// Provider Interface
// ---------------------------------------------------------------------------

/**
 * The boundary between the frontend and any breach data source.
 *
 * The UI never calls this directly — it goes through the feature/state
 * orchestration layer (useExposureCheck).
 *
 * A future real provider (e.g., HIBP) would implement this interface.
 * The current prototype uses a deterministic DemoProvider.
 */
export interface ExposureProvider {
  checkExposure(email: string): Promise<ExposureProviderResult>
}

/**
 * Raw result from the provider before domain-level interpretation.
 * The feature layer maps this into the appropriate CheckState.
 */
export type ExposureProviderResult =
  | { type: "found"; result: ExposureResult }
  | { type: "notFound"; source: string }
  | { type: "unavailable"; source: string; reason: string }
  | { type: "error"; message: string }
