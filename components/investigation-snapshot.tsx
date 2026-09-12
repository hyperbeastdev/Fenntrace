/**
 * Fenntrace — Investigation Snapshot
 *
 * A STATIC product preview card for the landing hero.
 * Enhanced with interactive Spotlight cursor illumination,
 * animated Border Beam, and subtle float physics.
 */

"use client"

import { cn } from "@/lib/utils"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { BorderBeam } from "@/components/ui/border-beam"
import { DecryptText } from "@/components/ui/decrypt-text"

export function InvestigationSnapshot({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-full max-w-sm animate-float select-none", className)}>
      <SpotlightCard className="p-5 shadow-2xl shadow-black/40 backdrop-blur-md bg-card/90">
        {/* Animated Border Beam */}
        <BorderBeam size={160} duration={8} colorFrom="#58A6FF" colorTo="#3FB950" />

        {/* Top Banner — Explicit Sample Labeling */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/40">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary/70 animate-pulse" />
            <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase font-mono">
              Sample Report
            </span>
          </div>
          <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium text-primary tracking-wide">
            Interactive Preview
          </span>
        </div>

        {/* Header with Risk Level */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <DecryptText text="THREAT_ANALYSIS_V2" />
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md border border-ft-danger/30 bg-ft-danger-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ft-danger shadow-sm shadow-ft-danger/10">
            Elevated risk
          </span>
        </div>

        {/* Metrics row */}
        <div className="flex items-center gap-3 mb-5 bg-background/50 rounded-lg p-3 border border-border/40">
          <div className="flex flex-col gap-0.5 flex-1">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">Breaches</span>
            <span className="text-xl font-bold tabular-nums text-foreground">4</span>
          </div>
          <div className="h-8 w-px bg-border/50" />
          <div className="flex flex-col gap-0.5 flex-1">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">Severity</span>
            <span className="text-xs font-bold text-ft-danger">Critical</span>
          </div>
          <div className="h-8 w-px bg-border/50" />
          <div className="flex flex-col gap-0.5 flex-1">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">Latest</span>
            <span className="text-xs font-medium text-foreground tabular-nums">2024</span>
          </div>
        </div>

        {/* Data exposed */}
        <div className="mb-5">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-2 font-mono">
            Compromised Attributes
          </span>
          <div className="flex flex-wrap gap-1.5">
            {["Email", "Password", "Username", "Phone", "Address"].map((item) => (
              <span
                key={item}
                className="inline-flex items-center rounded-md border border-border/60 bg-secondary/70 px-2 py-0.5 text-[11px] font-medium text-secondary-foreground"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Mini timeline */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">
            Incident Chronology
          </span>
          <div className="flex flex-col gap-1.5">
            {[
              { name: "Canva Dump", severity: "critical" as const, year: "2019" },
              { name: "Adobe Systems", severity: "critical" as const, year: "2013" },
              { name: "LinkedIn Corp", severity: "high" as const, year: "2016" },
            ].map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-md border border-border/40 bg-elevated/70 px-3 py-1.5 hover:border-primary/40 transition-colors"
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

        {/* Explanatory Footer Note */}
        <div className="mt-4 pt-3 border-t border-border/30 flex items-center gap-1.5 text-[10.5px] text-muted-foreground/80 leading-tight">
          <span>✨</span>
          <span>Sample data mockup. Enter your email above to run a live check.</span>
        </div>
      </SpotlightCard>
    </div>
  )
}

function SeverityDot({ severity }: { severity: "critical" | "high" | "moderate" | "low" }) {
  const colors = {
    critical: "bg-ft-danger shadow-sm shadow-ft-danger/50",
    high: "bg-ft-caution",
    moderate: "bg-ft-caution/60",
    low: "bg-muted-foreground",
  }
  return <div className={cn("h-1.5 w-1.5 rounded-full", colors[severity])} />
}
