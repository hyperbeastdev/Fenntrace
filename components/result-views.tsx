/**
 * Fenntrace — Result Views
 *
 * State-specific result views for found, notFound, unavailable, error, and cleared.
 * Each view is a focused composition with interactive filtering, threat matrix,
 * and actionable remediation.
 */

"use client"

import { useState, useMemo } from "react"
import { Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { ExposureResult, BreachRecord } from "@/domain/types"
import { getActionPlan } from "@/domain/helpers"
import { ExposureStatus } from "./exposure-status"
import { BreachCard } from "./breach-card"
import { ActionPlan } from "./action-plan"
import { ThreatMatrix } from "./threat-matrix"
import { MethodDisclosure } from "./method-disclosure"

// ---------------------------------------------------------------------------
// Found
// ---------------------------------------------------------------------------

interface FoundViewProps {
  result: ExposureResult
  onErase: () => void
  onRestart: () => void
}

export function FoundView({ result, onErase, onRestart }: FoundViewProps) {
  const [filter, setFilter] = useState<"all" | "passwords" | "critical" | "recent">("all")
  const actions = getActionPlan(result)

  // Filter breaches based on selection
  const filteredBreaches = useMemo(() => {
    switch (filter) {
      case "passwords":
        return result.breaches.filter((b) => b.dataCategories.includes("Password"))
      case "critical":
        return result.breaches.filter((b) => b.severity === "critical" || b.severity === "high")
      case "recent":
        return result.breaches.filter((b) => {
          const year = parseInt(b.date.slice(0, 4), 10)
          return year >= 2018
        })
      case "all":
      default:
        return result.breaches
    }
  }, [result.breaches, filter])

  const passwordCount = result.breaches.filter((b) => b.dataCategories.includes("Password")).length
  const criticalCount = result.breaches.filter((b) => b.severity === "critical" || b.severity === "high").length

  return (
    <div className="flex flex-col gap-8">
      <ExposureStatus result={result} />

      {/* Threat Exposure Matrix */}
      <ThreatMatrix result={result} />

      {/* Breach timeline with Filter Chips */}
      <section className="flex flex-col gap-4" aria-label="Breach records">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-[-0.01em] text-foreground">
            Breach timeline
          </h2>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-muted-foreground mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Filter:
            </span>
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={cn(
                "px-2.5 py-1 rounded-md transition-colors",
                filter === "all"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              All ({result.breaches.length})
            </button>

            {passwordCount > 0 && (
              <button
                type="button"
                onClick={() => setFilter("passwords")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-colors",
                  filter === "passwords"
                    ? "bg-ft-danger text-white font-semibold"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                Passwords ({passwordCount})
              </button>
            )}

            {criticalCount > 0 && (
              <button
                type="button"
                onClick={() => setFilter("critical")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-colors",
                  filter === "critical"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                Critical / High ({criticalCount})
              </button>
            )}

            <button
              type="button"
              onClick={() => setFilter("recent")}
              className={cn(
                "px-2.5 py-1 rounded-md transition-colors",
                filter === "recent"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              2018+
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {filteredBreaches.length === 0 ? (
            <div className="p-6 text-center rounded-xl border border-border/50 bg-card text-xs text-muted-foreground">
              No breaches match the active filter.
            </div>
          ) : (
            filteredBreaches.map((breach) => (
              <BreachCard key={breach.id} breach={breach} />
            ))
          )}
        </div>
      </section>

      {/* Action Plan Checklist & Export */}
      <ActionPlan actions={actions} result={result} />

      <MethodDisclosure source={result.source} />

      <ResultActions onErase={onErase} onRestart={onRestart} />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Not Found
// ---------------------------------------------------------------------------

interface NotFoundViewProps {
  source: string
  onErase: () => void
  onRestart: () => void
}

export function NotFoundView({ source, onErase, onRestart }: NotFoundViewProps) {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4" aria-label="Check result">
        <div className="flex items-center gap-2.5">
          <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-ft-success" aria-hidden="true" />
          <h1 className="text-xl font-semibold tracking-[-0.015em] text-foreground sm:text-2xl">
            No matching records found
          </h1>
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            No records were returned by the checked source for this email address.
          </p>
          <p className="text-sm leading-relaxed text-ft-text-muted">
            This does not mean the email has never appeared in a breach.
            This check queries a single source and does not establish
            complete internet-wide exposure.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-xs">
          <span className="text-muted-foreground">Source</span>
          <span className="font-medium text-foreground">{source}</span>
        </div>
      </section>

      <MethodDisclosure source={source} />

      <ResultActions onErase={onErase} onRestart={onRestart} />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Unavailable
// ---------------------------------------------------------------------------

interface UnavailableViewProps {
  source: string
  reason: string
  onRetry: () => void
}

export function UnavailableView({ source, reason, onRetry }: UnavailableViewProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-12 text-center">
      <div className="flex flex-col gap-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" className="text-ft-caution" />
            <path d="M10 6v5M10 13v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-ft-caution" />
          </svg>
        </div>

        <h1 className="text-xl font-semibold text-foreground">
          Source unavailable
        </h1>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          {reason}
        </p>
        <p className="text-xs text-ft-text-muted">
          No conclusion about exposure should be drawn from this result.
        </p>
      </div>

      <Button
        variant="outline"
        size="lg"
        onClick={onRetry}
        className="rounded-lg"
      >
        Try again
      </Button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Error
// ---------------------------------------------------------------------------

interface ErrorViewProps {
  message: string
  onRetry: () => void
}

export function ErrorView({ message, onRetry }: ErrorViewProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-12 text-center">
      <div className="flex flex-col gap-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" className="text-destructive" />
            <path d="M7.5 7.5l5 5M12.5 7.5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-destructive" />
          </svg>
        </div>

        <h1 className="text-xl font-semibold text-foreground">
          Something went wrong
        </h1>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          {message}
        </p>
      </div>

      <Button
        variant="outline"
        size="lg"
        onClick={onRetry}
        className="rounded-lg"
      >
        Try again
      </Button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Cleared
// ---------------------------------------------------------------------------

interface ClearedViewProps {
  onRestart: () => void
}

export function ClearedView({ onRestart }: ClearedViewProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-12 text-center">
      <div className="flex flex-col gap-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" className="text-ft-success" />
            <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ft-success" />
          </svg>
        </div>

        <h1 className="text-xl font-semibold text-foreground">
          Check erased
        </h1>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          Your email and all exposure results have been cleared from this session.
          No data was stored in your browser.
        </p>
      </div>

      <Button
        variant="outline"
        size="lg"
        onClick={onRestart}
        className="rounded-lg"
      >
        Start a new check
      </Button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Result actions (reused in found + notFound)
// ---------------------------------------------------------------------------

function ResultActions({ onErase, onRestart }: { onErase: () => void; onRestart: () => void }) {
  return (
    <section className="flex flex-col gap-6 border-t border-border pt-8 print:hidden">
      {/* Primary action — check another */}
      <div className="flex flex-col items-center gap-2">
        <Button
          variant="outline"
          size="lg"
          onClick={onRestart}
          className="rounded-lg"
        >
          Check another email
        </Button>
      </div>

      {/* Secondary action — erase */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm text-muted-foreground">
          Done reviewing? Remove this check from your active session.
        </p>
        <Button
          variant="outline"
          onClick={onErase}
          className={cn(
            "rounded-lg border-destructive/30 text-destructive gap-2",
            "hover:bg-ft-danger-muted hover:text-destructive"
          )}
        >
          <span>Erase this check</span>
          <kbd className="hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 rounded bg-destructive/10 border border-destructive/20">
            Esc
          </kbd>
        </Button>
      </div>
    </section>
  )
}
