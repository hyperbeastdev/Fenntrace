/**
 * Fenntrace — Threat Exposure Matrix
 *
 * Visualizes the 3 primary data exposure vectors:
 * 1. Credential Risk (Passwords, PINs, Security Questions)
 * 2. Identity Risk (Names, DOB, Employment, Social Profiles)
 * 3. Contact & Location Risk (Emails, Phones, Physical Addresses, IPs)
 */

import { Key, UserCheck, MapPin, AlertCircle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ExposureResult, DataCategory } from "@/domain/types"

interface ThreatMatrixProps {
  result: ExposureResult
  className?: string
}

interface VectorConfig {
  title: string
  icon: typeof Key
  categories: DataCategory[]
  description: string
}

const VECTORS: VectorConfig[] = [
  {
    title: "Credential Risk",
    icon: Key,
    categories: ["Password", "Security questions"],
    description: "Passwords or authentication secrets that allow direct account takeover.",
  },
  {
    title: "Identity & PII",
    icon: UserCheck,
    categories: ["Name", "Date of birth", "Social media profile", "Employment info", "Financial data"],
    description: "Personal identifying info usable for social engineering or identity theft.",
  },
  {
    title: "Contact & Location",
    icon: MapPin,
    categories: ["Email address", "Phone number", "Physical address", "IP address"],
    description: "Direct contact vectors usable for targeted phishing, SMS spam, or tracking.",
  },
]

export function ThreatMatrix({ result, className }: ThreatMatrixProps) {
  return (
    <section className={cn("flex flex-col gap-4", className)} aria-label="Threat exposure matrix">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold tracking-[-0.01em] text-foreground">
          Threat Exposure Matrix
        </h2>
        <p className="text-xs text-muted-foreground">
          Breakdown of compromised data across three attack vectors.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {VECTORS.map((vector) => {
          const Icon = vector.icon
          // Find exposed items in this vector
          const exposedInVector = new Set<DataCategory>()
          let affectedBreachCount = 0

          result.breaches.forEach((breach) => {
            const hasCategory = breach.dataCategories.some((cat) => {
              if (vector.categories.includes(cat)) {
                exposedInVector.add(cat)
                return true
              }
              return false
            })
            if (hasCategory) affectedBreachCount++
          })

          const isExposed = exposedInVector.size > 0
          const isCredential = vector.title === "Credential Risk"

          return (
            <div
              key={vector.title}
              className={cn(
                "flex flex-col justify-between rounded-xl border p-4.5 transition-all",
                isExposed
                  ? isCredential
                    ? "border-ft-danger/40 bg-ft-danger-muted/20"
                    : "border-ft-caution/40 bg-ft-caution-muted/20"
                  : "border-border/60 bg-card/60"
              )}
            >
              <div className="flex flex-col gap-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "p-2 rounded-lg",
                        isExposed
                          ? isCredential
                            ? "bg-ft-danger/10 text-ft-danger"
                            : "bg-ft-caution/10 text-ft-caution"
                          : "bg-secondary text-muted-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">{vector.title}</h3>
                  </div>

                  {isExposed ? (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                        isCredential
                          ? "bg-ft-danger-muted text-ft-danger border border-ft-danger/30"
                          : "bg-ft-caution-muted text-ft-caution border border-ft-caution/30"
                      )}
                    >
                      <AlertCircle className="h-3 w-3" />
                      Exposed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground border border-border/50">
                      <CheckCircle2 className="h-3 w-3 text-ft-success" />
                      No data
                    </span>
                  )}
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {vector.description}
                </p>
              </div>

              {/* Footer / Categories exposed */}
              <div className="mt-4 pt-3 border-t border-border/30 flex flex-col gap-1.5">
                <span className="text-[10px] uppercase font-mono text-muted-foreground/80">
                  {isExposed ? `Impacted Attributes (${exposedInVector.size}):` : "Status:"}
                </span>
                {isExposed ? (
                  <div className="flex flex-wrap gap-1">
                    {Array.from(exposedInVector).map((cat) => (
                      <span
                        key={cat}
                        className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium bg-secondary text-secondary-foreground border border-border/40"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-ft-success font-medium">
                    No leaked records in this category
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
