/**
 * Fenntrace — External Data Mapper
 *
 * Translates external breach intelligence sources (HIBP, raw threat feeds)
 * into standardized Fenntrace domain types, data categories, and severity tiers.
 */

import type { BreachRecord, DataCategory, Severity } from "@/domain/types"

/**
 * Mapping table from external DataClasses (e.g. HIBP) to Fenntrace DataCategory
 */
const DATA_CLASS_MAP: Record<string, DataCategory> = {
  // Passwords / Credentials
  passwords: "Password",
  "password hashes": "Password",
  "password hints": "Security questions",
  "security questions and answers": "Security questions",
  pins: "Password",
  "auth tokens": "Password",

  // Email & Names
  "email addresses": "Email address",
  "email messages": "Email address",
  names: "Name",
  usernames: "Username",
  "screen names": "Username",
  nicknames: "Username",

  // Contact & Location
  "phone numbers": "Phone number",
  "cell phone numbers": "Phone number",
  "physical addresses": "Physical address",
  "geographic locations": "Physical address",
  "ip addresses": "IP address",
  "mac addresses": "IP address",

  // Identity & Demographics
  "dates of birth": "Date of birth",
  dob: "Date of birth",
  genders: "Employment info",
  "nationalities": "Employment info",
  "government issued ids": "Financial data",
  "passport numbers": "Financial data",
  "social security numbers": "Financial data",

  // Financial & Payment
  "credit cards": "Financial data",
  "bank account numbers": "Financial data",
  "payment histories": "Financial data",
  "purchases": "Financial data",
  "credit card cvv": "Financial data",
  "account balances": "Financial data",

  // Social & Work
  "social media profiles": "Social media profile",
  "website activity": "Social media profile",
  "job titles": "Employment info",
  employers: "Employment info",
  "career information": "Employment info",
}

/**
 * Map an array of external data class strings to unique Fenntrace DataCategory values.
 */
export function mapDataClassesToCategories(dataClasses: string[]): DataCategory[] {
  const categories = new Set<DataCategory>()

  for (const dc of dataClasses) {
    const normalized = dc.toLowerCase().trim()
    const mapped = DATA_CLASS_MAP[normalized]
    if (mapped) {
      categories.add(mapped)
    } else if (normalized.includes("password") || normalized.includes("hash")) {
      categories.add("Password")
    } else if (normalized.includes("phone") || normalized.includes("mobile")) {
      categories.add("Phone number")
    } else if (normalized.includes("address") || normalized.includes("location")) {
      categories.add("Physical address")
    } else if (normalized.includes("financial") || normalized.includes("card") || normalized.includes("bank") || normalized.includes("ssn")) {
      categories.add("Financial data")
    } else if (normalized.includes("name")) {
      categories.add("Name")
    } else {
      categories.add("Email address")
    }
  }

  // Ensure "Email address" is always included for email lookups
  categories.add("Email address")

  return Array.from(categories)
}

/**
 * Determine breach severity based on categories exposed
 */
export function calculateBreachSeverity(categories: DataCategory[]): Severity {
  if (categories.includes("Password") || categories.includes("Financial data")) {
    return "critical"
  }
  if (
    categories.includes("Physical address") ||
    categories.includes("Phone number") ||
    categories.includes("Date of birth") ||
    categories.includes("Security questions")
  ) {
    return "high"
  }
  if (categories.includes("Username") || categories.includes("IP address")) {
    return "moderate"
  }
  return "low"
}

/**
 * Strip HTML tags from external breach descriptions (e.g. HIBP includes <a> and <p> tags)
 */
export function stripHtml(html: string): string {
  if (!html) return ""
  return html
    .replace(/<[^>]*>?/gm, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()
}

/**
 * Interface representing Have I Been Pwned v3 Breach model
 */
export interface HibpBreachResponse {
  Name: string
  Title: string
  Domain: string
  BreachDate: string
  AddedDate: string
  ModifiedDate: string
  PwnCount: number
  Description: string
  LogoPath: string
  DataClasses: string[]
  IsVerified: boolean
  IsFabricated: boolean
  IsSensitive: boolean
  IsRetired: boolean
  IsSpamList: boolean
  IsMalware: boolean
  IsSubscriptionFree?: boolean
}

/**
 * Convert an HIBP breach response item into a Fenntrace BreachRecord
 */
export function mapHibpToBreachRecord(item: HibpBreachResponse, index: number): BreachRecord {
  const categories = mapDataClassesToCategories(item.DataClasses || [])
  const severity = calculateBreachSeverity(categories)
  const cleanDescription = stripHtml(item.Description)

  return {
    id: `hibp-${item.Name.toLowerCase()}-${index}`,
    name: item.Title || item.Name,
    date: item.BreachDate || new Date().toISOString().split("T")[0],
    dataCategories: categories,
    severity,
    description: cleanDescription || `Data breach reported at ${item.Title || item.Name}.`,
  }
}
