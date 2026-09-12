/**
 * Fenntrace — High-Tech Radar Scan Sequence
 *
 * Displayed during the "checking" state.
 * Features:
 * - Concentric sonar pulse circles
 * - Rotating radar sweep beam
 * - Live terminal log stream with simulated verification events
 * - Smooth progress bar
 */

"use client"

import { useEffect, useState } from "react"
import { Shield, Terminal } from "lucide-react"
import { cn } from "@/lib/utils"

const LOG_MESSAGES = [
  "Initializing zero-retention ephemeral session...",
  "Querying breach intelligence registry...",
  "Cross-referencing compromised credential hashes...",
  "Evaluating multi-vector threat risk matrix...",
  "Formulating prioritized remediation action plan...",
]

export function ScanSequence({ className }: { className?: string }) {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev < LOG_MESSAGES.length - 1 ? prev + 1 : prev))
    }, 450)

    return () => clearInterval(timer)
  }, [])

  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-8 py-20 sm:py-28 max-w-lg mx-auto w-full",
        className
      )}
      role="status"
      aria-live="polite"
      aria-label="Checking email for known exposures"
    >
      {/* Radar Sonar Visualizer */}
      <div className="relative flex h-36 w-36 items-center justify-center">
        {/* Pulsing Sonar Waves */}
        <div className="animate-sonar absolute inset-0 rounded-full border border-primary/40 bg-primary/5" />
        <div
          className="animate-sonar absolute inset-0 rounded-full border border-primary/20"
          style={{ animationDelay: "0.8s" }}
        />

        {/* Static concentric grid rings */}
        <div className="absolute h-32 w-32 rounded-full border border-border/60" />
        <div className="absolute h-20 w-20 rounded-full border border-border/40" />

        {/* Crosshair axis lines */}
        <div className="absolute h-full w-px bg-border/40" />
        <div className="absolute h-px w-full bg-border/40" />

        {/* Rotating Radar Sweep Cone */}
        <div className="animate-radar absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0_300deg,oklch(0.68_0.12_240/25%)_360deg)] pointer-events-none" />

        {/* Center Shield Icon */}
        <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-primary/50 bg-background shadow-lg shadow-primary/20">
          <Shield className="h-5 w-5 text-primary animate-pulse" />
        </div>
      </div>

      {/* Headline & Progress */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
          <span>Active Investigation in Progress</span>
          <span className="inline-block h-2 w-2 rounded-full bg-primary animate-ping" />
        </h2>
        <p className="text-xs text-muted-foreground">
          Querying indexed breach archives with zero data retention
        </p>
      </div>

      {/* High-Tech Terminal Log Stream */}
      <div className="w-full rounded-xl border border-border/70 bg-card/90 p-4 font-mono text-[11px] shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/40 text-muted-foreground text-[10px]">
          <span className="flex items-center gap-1.5">
            <Terminal className="h-3 w-3 text-primary" />
            FENNTRACE_ENGINE_V1
          </span>
          <span className="text-ft-success">SECURE_PIPE</span>
        </div>

        <div className="flex flex-col gap-1.5">
          {LOG_MESSAGES.slice(0, currentStep + 1).map((msg, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center gap-2 transition-all duration-200",
                index === currentStep ? "text-primary font-medium" : "text-muted-foreground/80"
              )}
            >
              <span className="text-[10px] text-muted-foreground/60 select-none">
                0{index + 1}
              </span>
              <span className="text-primary/70 select-none">&gt;</span>
              <span className="truncate">{msg}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Smooth Progress Bar */}
      <div className="h-1 w-48 overflow-hidden rounded-full bg-secondary/80">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${((currentStep + 1) / LOG_MESSAGES.length) * 100}%` }}
        />
      </div>
    </div>
  )
}
