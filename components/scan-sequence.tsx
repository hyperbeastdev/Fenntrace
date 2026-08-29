/**
 * Fenntrace — Scan Sequence
 *
 * Displayed during the "checking" state.
 * Calm, branded investigation loading experience.
 *
 * Uses the Fenntrace F mark as a visual anchor with a subtle
 * rotating ring and calm stage text progression.
 *
 * Respects prefers-reduced-motion.
 * Architecture supports future Lottie replacement without restructuring.
 */

"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const SCAN_STAGES = [
  { label: "Validating", description: "Checking email format." },
  { label: "Querying", description: "Checking known exposure records." },
  { label: "Interpreting", description: "Analyzing exposure results." },
  { label: "Complete", description: "Preparing your report." },
] as const

const STAGE_DURATION = 550

export function ScanSequence({ className }: { className?: string }) {
  const [activeStage, setActiveStage] = useState(0)

  useEffect(() => {
    if (activeStage >= SCAN_STAGES.length - 1) return
    const timer = setTimeout(() => {
      setActiveStage((prev) => Math.min(prev + 1, SCAN_STAGES.length - 1))
    }, STAGE_DURATION)
    return () => clearTimeout(timer)
  }, [activeStage])

  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-8 py-24 sm:py-32",
        className
      )}
      role="status"
      aria-live="polite"
      aria-label="Checking your email for known exposures"
    >
      {/* F mark with subtle ring — Lottie-replaceable container */}
      <div className="relative flex items-center justify-center" data-lottie-target="scan-loader">
        {/* Outer ring */}
        <div className="absolute h-20 w-20 rounded-full border border-border/40 motion-safe:animate-[spin_4s_linear_infinite]" />

        {/* Inner F mark */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary"
        >
          <path d="M6 4h12v2H8v4h8v2H8v8H6V4z" fill="currentColor" />
        </svg>
      </div>

      {/* Stage text */}
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-lg font-medium text-foreground tracking-tight">
          Investigating
        </p>
        <p className="text-sm text-muted-foreground transition-opacity duration-300">
          {SCAN_STAGES[activeStage].description}
        </p>
      </div>

      {/* Progress bar */}
      <div className="h-px w-32 overflow-hidden rounded-full bg-border/40">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${((activeStage + 1) / SCAN_STAGES.length) * 100}%` }}
        />
      </div>
    </div>
  )
}
