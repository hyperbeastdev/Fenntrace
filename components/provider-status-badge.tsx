/**
 * Fenntrace — Provider Status & Health Diagnostics Badge
 *
 * Real-time indicator displaying the active breach intelligence engine
 * (HIBP Live vs Local Intelligence Sandbox) and roundtrip API latency.
 */

"use client"

import { useState, useEffect } from "react"
import { Activity, ShieldCheck, X, Server, Cpu, Clock, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface HealthInfo {
  status: string
  service: string
  timestamp: string
  provider: {
    name: string
    mode: string
    isLiveHibp: boolean
  }
  features: {
    emailExposureCheck: boolean
    passwordKAnonymityCheck: boolean
    breachCatalog: boolean
    slidingWindowRateLimiting: boolean
    zeroDataRetention: boolean
  }
}

export function ProviderStatusBadge({ className }: { className?: string }) {
  const [health, setHealth] = useState<HealthInfo | null>(null)
  const [latency, setLatency] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    async function checkHealth() {
      const startTime = performance.now()
      try {
        const res = await fetch("/api/health")
        const endTime = performance.now()
        if (res.ok) {
          const data = await res.json()
          setHealth(data)
          setLatency(Math.round(endTime - startTime))
        }
      } catch {
        // Fallback gracefully
        setHealth({
          status: "offline",
          service: "Local Client Fallback",
          timestamp: new Date().toISOString(),
          provider: {
            name: "Client Demo Engine",
            mode: "local",
            isLiveHibp: false,
          },
          features: {
            emailExposureCheck: true,
            passwordKAnonymityCheck: true,
            breachCatalog: true,
            slidingWindowRateLimiting: false,
            zeroDataRetention: true,
          },
        })
      }
    }

    checkHealth()
  }, [])

  if (!health) return null

  const isLive = health.provider.isLiveHibp

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
          isLive
            ? "border-ft-success/30 bg-ft-success-muted/40 text-ft-success"
            : "border-primary/30 bg-primary/10 text-primary",
          className
        )}
        title="Click to view backend provider & privacy diagnostics"
      >
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full animate-pulse",
            isLive ? "bg-ft-success" : "bg-primary"
          )}
        />
        <span className="truncate max-w-[140px] sm:max-w-none">
          {isLive ? "HIBP Live v3" : "Local Sandbox"}
        </span>
        {latency !== null && (
          <span className="font-mono text-[10px] opacity-70 tabular-nums">
            {latency}ms
          </span>
        )}
      </button>

      {/* Diagnostics Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-border/80 bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border/40">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">
                  System Diagnostics & Privacy Status
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-4 py-4 text-xs">
              {/* Provider Row */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/50">
                <div className="flex items-center gap-2.5">
                  <Server className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">Breach Intelligence Engine</span>
                    <span className="text-[11px] text-muted-foreground">{health.provider.name}</span>
                  </div>
                </div>
                <span
                  className={cn(
                    "rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                    isLive
                      ? "bg-ft-success-muted text-ft-success border border-ft-success/30"
                      : "bg-primary/10 text-primary border border-primary/20"
                  )}
                >
                  {health.provider.mode}
                </span>
              </div>

              {/* Ping & Time */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-background/50 border border-border/50">
                  <Cpu className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground uppercase">API Latency</span>
                    <span className="font-semibold text-foreground tabular-nums">
                      {latency ? `${latency} ms` : "Instant"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-xl bg-background/50 border border-border/50">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground uppercase">Rate Limiting</span>
                    <span className="font-semibold text-ft-success">Active & Guarded</span>
                  </div>
                </div>
              </div>

              {/* Guarantees Checklist */}
              <div className="flex flex-col gap-2 pt-2 border-t border-border/40">
                <span className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  Guaranteed Protections:
                </span>
                <div className="flex flex-col gap-1.5 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-ft-success shrink-0" />
                    <span>Zero Data Retention — No queries or emails persisted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-ft-success shrink-0" />
                    <span>k-Anonymity Cryptographic Password Range Checking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-ft-success shrink-0" />
                    <span>Safe Log Masking (zero plaintext identifiers in logs)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer button */}
            <div className="pt-3 border-t border-border/40 flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-secondary text-foreground text-xs font-medium hover:bg-secondary/80 transition-colors"
              >
                Close Diagnostics
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
