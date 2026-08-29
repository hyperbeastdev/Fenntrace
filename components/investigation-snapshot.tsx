/**
 * Fenntrace — Investigation Snapshot
 *
 * A STATIC product visualization for the landing page hero.
 * This is NOT the live results component — it is a restrained visual preview
 * that communicates what the investigation experience looks like.
 *
 * Uses the Fenntrace design language (severity colors, metrics, chips)
 * but is completely inert and decorative.
 */

import { cn } from "@/lib/utils"

export function InvestigationSnapshot({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full max-w-sm rounded-xl border border-border/60 bg-card/80 p-5 select-none",
        className
      )}
      aria-hidden="true"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
          Report Preview
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-md border border-ft-danger/30 bg-ft-danger-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ft-danger">
          Elevated risk
        </span>
      </div>

      {/* Metrics row */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Records</span>
          <span className="text-2xl font-semibold tabular-nums text-foreground">4</span>
        </div>
        <div className="h-8 w-px bg-border/50" />
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Severity</span>
          <span className="text-sm font-medium text-ft-danger">Critical</span>
        </div>
        <div className="h-8 w-px bg-border/50" />
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Last detected</span>
          <span className="text-sm font-medium text-foreground tabular-nums">2024</span>
        </div>
      </div>

      {/* Data exposed */}
      <div className="mb-5">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-2">
          Data exposed
        </span>
        <div className="flex flex-wrap gap-1.5">
          {["Email", "Password", "Username", "Phone", "Address"].map((item) => (
            <span
              key={item}
              className="inline-flex items-center rounded-md border border-border/50 bg-secondary/50 px-2 py-0.5 text-[11px] font-medium text-secondary-foreground"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Mini timeline */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
          Timeline
        </span>
        <div className="flex flex-col gap-1.5">
          {[
            { name: "SocialConnect", severity: "critical" as const, year: "2024" },
            { name: "ShopEase", severity: "high" as const, year: "2023" },
            { name: "GameVault", severity: "moderate" as const, year: "2023" },
          ].map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-md border border-border/40 bg-elevated px-3 py-1.5"
            >
              <span className="text-xs font-medium text-foreground">{item.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground tabular-nums">{item.year}</span>
                <SeverityDot severity={item.severity} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SeverityDot({ severity }: { severity: "critical" | "high" | "moderate" | "low" }) {
  const colors = {
    critical: "bg-ft-danger",
    high: "bg-ft-caution",
    moderate: "bg-ft-caution/60",
    low: "bg-muted-foreground",
  }
  return <div className={cn("h-1.5 w-1.5 rounded-full", colors[severity])} />
}
