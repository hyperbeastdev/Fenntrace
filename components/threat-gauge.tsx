/**
 * Fenntrace — Animated Threat Score Radial Gauge
 *
 * Visualizes exposure risk percentage with a smooth circular SVG stroke
 * and real-time numeric counter.
 */

"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import type { RiskLevel } from "@/domain/types"

interface ThreatGaugeProps {
  level: RiskLevel
  score?: number // 0 to 100
  className?: string
}

const SCORE_MAP: Record<RiskLevel, { score: number; color: string; label: string }> = {
  severe: { score: 92, color: "#F85149", label: "Severe Risk" },
  elevated: { score: 68, color: "#D29922", label: "Elevated" },
  moderate: { score: 44, color: "#D29922", label: "Moderate" },
  low: { score: 18, color: "#3FB950", label: "Low Impact" },
}

export function ThreatGauge({ level, score: overrideScore, className }: ThreatGaugeProps) {
  const config = SCORE_MAP[level]
  const targetScore = overrideScore ?? config.score
  const [currentScore, setCurrentScore] = useState(0)

  useEffect(() => {
    let start = 0
    const duration = 1200 // ms
    const stepTime = 20
    const totalSteps = duration / stepTime
    const stepIncrement = targetScore / totalSteps

    const timer = setInterval(() => {
      start += stepIncrement
      if (start >= targetScore) {
        setCurrentScore(targetScore)
        clearInterval(timer)
      } else {
        setCurrentScore(Math.floor(start))
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [targetScore])

  // SVG dimensions
  const radius = 38
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (currentScore / 100) * circumference

  return (
    <div className={cn("relative flex flex-col items-center justify-center", className)}>
      <div className="relative h-24 w-24">
        <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth="7"
            className="text-secondary"
            fill="transparent"
          />
          {/* Animated progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={config.color}
            strokeWidth="7"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-300 ease-out"
            style={{
              filter: `drop-shadow(0 0 6px ${config.color}80)`,
            }}
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xl font-bold tracking-tight text-foreground tabular-nums">
            {currentScore}%
          </span>
          <span className="text-[9px] uppercase font-mono tracking-wider text-muted-foreground">
            Threat
          </span>
        </div>
      </div>
    </div>
  )
}
