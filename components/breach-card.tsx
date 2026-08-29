/**
 * Fenntrace — Breach Card
 *
 * Individual breach record display.
 * Shows: name, date, severity, data categories, description.
 *
 * Cards use the shadcn Card primitive underneath,
 * customized with Fenntrace severity left-border accent.
 */

import { cn } from "@/lib/utils"
import type { BreachRecord, Severity } from "@/domain/types"
import { getSeverityInfo, formatBreachDate } from "@/domain/helpers"

interface BreachCardProps {
  breach: BreachRecord
  className?: string
}

const SEVERITY_BORDER: Record<Severity, string> = {
  critical: "border-l-ft-danger",
  high: "border-l-ft-caution",
  moderate: "border-l-ft-caution/60",
  low: "border-l-muted-foreground/40",
}

const SEVERITY_BADGE_STYLES: Record<Severity, string> = {
  critical: "bg-ft-danger-muted text-ft-danger border-ft-danger/30",
  high: "bg-ft-caution-muted text-ft-caution border-ft-caution/30",
  moderate: "bg-ft-caution-muted/60 text-ft-caution/80 border-ft-caution/20",
  low: "bg-muted text-muted-foreground border-border",
}

export function BreachCard({ breach, className }: BreachCardProps) {
  const severityInfo = getSeverityInfo(breach.severity)

  return (
    <article
      className={cn(
        "group relative rounded-xl border border-border/60 bg-card p-5 sm:p-6",
        "transition-all duration-200 hover:border-border hover:shadow-sm hover:bg-card/60",
        "border-l-4",
        SEVERITY_BORDER[breach.severity],
        className
      )}
    >
      <div className="flex flex-col gap-4">
        {/* Header: name + severity + date */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            <h3 className="text-base font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
              {breach.name}
            </h3>
            <time
              dateTime={breach.date}
              className="text-xs font-medium text-muted-foreground tabular-nums uppercase tracking-wider"
            >
              {formatBreachDate(breach.date)}
            </time>
          </div>

          <span
            className={cn(
              "inline-flex shrink-0 items-center rounded-md border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest",
              SEVERITY_BADGE_STYLES[breach.severity]
            )}
          >
            {severityInfo.label}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed text-muted-foreground/90 max-w-2xl">
          {breach.description}
        </p>

        {/* Data categories */}
        <div className="mt-2 flex flex-wrap gap-2">
          {breach.dataCategories.map((category) => (
            <span
              key={category}
              className="inline-flex items-center rounded-md border border-border/50 bg-secondary/50 px-2.5 py-1 text-xs font-medium text-secondary-foreground transition-colors group-hover:bg-secondary group-hover:border-border"
            >
              {category}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}
