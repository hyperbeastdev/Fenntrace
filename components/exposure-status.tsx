/**
 * Fenntrace — Exposure Status
 *
 * The headline answer for the found state.
 * Communicates: what happened, how many, how serious.
 *
 * Progressive disclosure: headline first, then metric, then evidence.
 */

import { cn } from "@/lib/utils"
import type { ExposureResult, RiskLevel } from "@/domain/types"
import { getStatusHeadline, deriveRiskLevel } from "@/domain/helpers"

interface ExposureStatusProps {
  result: ExposureResult
  className?: string
}

const RISK_STYLES: Record<RiskLevel, { ring: string; bg: string; text: string }> = {
  severe: {
    ring: "border-ft-danger/40",
    bg: "bg-ft-danger-muted",
    text: "text-ft-danger",
  },
  elevated: {
    ring: "border-ft-caution/40",
    bg: "bg-ft-caution-muted",
    text: "text-ft-caution",
  },
  moderate: {
    ring: "border-ft-caution/30",
    bg: "bg-ft-caution-muted",
    text: "text-ft-caution",
  },
  low: {
    ring: "border-muted-foreground/30",
    bg: "bg-muted",
    text: "text-muted-foreground",
  },
}

export function ExposureStatus({ result, className }: ExposureStatusProps) {
  const riskInfo = deriveRiskLevel(result)
  const headline = getStatusHeadline(result)
  const styles = RISK_STYLES[riskInfo.level]

  return (
    <section
      className={cn("flex flex-col gap-6", className)}
      aria-label="Exposure status"
    >
      {/* Status headline */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <RiskIndicator level={riskInfo.level} />
          <h1 className="text-xl font-semibold tracking-[-0.015em] text-foreground sm:text-2xl">
            {headline}
          </h1>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {riskInfo.explanation}
        </p>
      </div>

      {/* Key metrics */}
      <div className="flex flex-wrap items-center gap-3">
        <MetricPill label="Records" value={String(result.exposureCount)} />
        <MetricPill label="Source" value={result.source} />
        <div
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium",
            styles.ring, styles.bg, styles.text
          )}
        >
          {riskInfo.level.charAt(0).toUpperCase() + riskInfo.level.slice(1)} risk
        </div>
      </div>
    </section>
  )
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground tabular-nums">{value}</span>
    </div>
  )
}

function RiskIndicator({ level }: { level: RiskLevel }) {
  const colorMap: Record<RiskLevel, string> = {
    severe: "bg-ft-danger",
    elevated: "bg-ft-caution",
    moderate: "bg-ft-caution",
    low: "bg-muted-foreground",
  }

  return (
    <div
      className={cn(
        "h-2.5 w-2.5 shrink-0 rounded-full",
        colorMap[level]
      )}
      aria-hidden="true"
    />
  )
}
