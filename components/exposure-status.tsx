/**
 * Fenntrace — Exposure Status
 *
 * The headline answer for the found state with an animated ThreatGauge
 * radial score dial and clean risk indicator.
 */

import { cn } from "@/lib/utils"
import type { ExposureResult, RiskLevel } from "@/domain/types"
import { getStatusHeadline, deriveRiskLevel } from "@/domain/helpers"
import { ThreatGauge } from "@/components/threat-gauge"

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
      className={cn(
        "relative rounded-2xl border border-border/70 bg-card p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl",
        className
      )}
      aria-label="Exposure status"
    >
      {/* Left Column: Headline & Metrics */}
      <div className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <RiskIndicator level={riskInfo.level} />
            <h1 className="text-xl font-semibold tracking-[-0.015em] text-foreground sm:text-2xl">
              {headline}
            </h1>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground max-w-xl">
            {riskInfo.explanation}
          </p>
        </div>

        {/* Key metrics */}
        <div className="flex flex-wrap items-center gap-2.5">
          <MetricPill label="Records Found" value={String(result.exposureCount)} />
          <MetricPill label="Verified Source" value={result.source} />
          <div
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold uppercase tracking-wider",
              styles.ring,
              styles.bg,
              styles.text
            )}
          >
            {riskInfo.level.toUpperCase()} THREAT
          </div>
        </div>
      </div>

      {/* Right Column: Animated Radial Threat Dial */}
      <div className="shrink-0 self-center sm:self-auto">
        <ThreatGauge level={riskInfo.level} />
      </div>
    </section>
  )
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-background/60 px-2.5 py-1 text-xs">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-semibold text-foreground tabular-nums">{value}</span>
    </div>
  )
}

function RiskIndicator({ level }: { level: RiskLevel }) {
  const colorMap: Record<RiskLevel, string> = {
    severe: "bg-ft-danger shadow-sm shadow-ft-danger/80",
    elevated: "bg-ft-caution shadow-sm shadow-ft-caution/80",
    moderate: "bg-ft-caution",
    low: "bg-ft-success shadow-sm shadow-ft-success/80",
  }

  return (
    <div
      className={cn(
        "h-2.5 w-2.5 shrink-0 rounded-full animate-pulse",
        colorMap[level]
      )}
      aria-hidden="true"
    />
  )
}
