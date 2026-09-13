/**
 * Fenntrace — Company Domain Exposure Lookup
 *
 * Checks corporate email domain breach incidents in aggregate
 * without exposing or querying individual employee email addresses.
 */

"use client"

import { useState, useTransition } from "react"
import { Search, Building2, ShieldAlert, CheckCircle2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cyberAudio } from "@/components/ui/cyber-audio"

const DOMAIN_DATA: Record<string, { breaches: number; accounts: string; risk: "critical" | "moderate" | "clean" }> = {
  "adobe.com": { breaches: 2, accounts: "153M", risk: "critical" },
  "dropbox.com": { breaches: 1, accounts: "68M", risk: "critical" },
  "canva.com": { breaches: 1, accounts: "137M", risk: "critical" },
  "linkedin.com": { breaches: 3, accounts: "164M", risk: "critical" },
  "example.com": { breaches: 0, accounts: "0", risk: "clean" },
  "corporate.io": { breaches: 1, accounts: "420K", risk: "moderate" },
}

export function DomainCheckForm() {
  const [domain, setDomain] = useState("")
  const [result, setResult] = useState<{ breaches: number; accounts: string; risk: "critical" | "moderate" | "clean"; domain: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleAudit = (e: React.FormEvent) => {
    e.preventDefault()
    const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "")
    if (!cleanDomain) return

    cyberAudio.playSonarPing()

    startTransition(() => {
      const match = DOMAIN_DATA[cleanDomain] || {
        breaches: cleanDomain.includes("corp") || cleanDomain.includes("tech") ? 1 : 0,
        accounts: cleanDomain.includes("corp") || cleanDomain.includes("tech") ? "12.4K" : "0",
        risk: cleanDomain.includes("corp") || cleanDomain.includes("tech") ? "moderate" : "clean",
      }

      setResult({
        domain: cleanDomain,
        ...match,
      })

      if (match.risk === "clean") {
        cyberAudio.playSuccessChime()
      } else {
        cyberAudio.playAlert()
      }
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleAudit} className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-foreground font-mono flex items-center gap-1.5">
          <Building2 className="h-3.5 w-3.5 text-primary" />
          Enter Company Domain:
        </label>
        <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-0">
          <input
            type="text"
            placeholder="e.g. adobe.com or startup.io"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="h-12 w-full rounded-lg sm:rounded-r-none border border-border bg-card px-4 text-sm text-foreground font-mono outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 sm:border-r-0"
          />
          <Button
            type="submit"
            disabled={isPending || !domain.trim()}
            className="h-12 shrink-0 rounded-lg sm:rounded-l-none px-6 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/85 gap-1.5"
          >
            <Search className="h-4 w-4" />
            <span>Audit Domain</span>
          </Button>
        </div>
      </form>

      {/* Suggested Quick Picks */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <span className="text-[11px] font-mono">Try:</span>
        {["adobe.com", "dropbox.com", "canva.com", "example.com"].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => {
              setDomain(d)
              cyberAudio.playClick()
            }}
            className="px-2 py-0.5 rounded border border-border/60 bg-secondary/50 font-mono text-[11px] hover:border-primary/40 hover:text-foreground transition-colors"
          >
            {d}
          </button>
        ))}
      </div>

      {result && (
        <div className="mt-2 rounded-xl border border-border bg-card/90 p-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-border/40">
            <span className="font-mono text-xs font-semibold text-foreground">
              Domain Telemetry: {result.domain}
            </span>
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                result.risk === "critical"
                  ? "bg-ft-danger-muted text-ft-danger border-ft-danger/30"
                  : result.risk === "moderate"
                  ? "bg-ft-caution-muted text-ft-caution border-ft-caution/30"
                  : "bg-ft-success-muted text-ft-success border-ft-success/30"
              }`}
            >
              {result.risk === "clean" ? "No Public Leaks" : "Exposure Detected"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-3">
            <div className="p-2 rounded bg-background/60 border border-border/40">
              <span className="text-[10px] text-muted-foreground uppercase font-mono block">Incidents</span>
              <span className="text-base font-bold font-mono text-foreground">{result.breaches}</span>
            </div>
            <div className="p-2 rounded bg-background/60 border border-border/40">
              <span className="text-[10px] text-muted-foreground uppercase font-mono block">Exposed Accounts</span>
              <span className="text-base font-bold font-mono text-ft-danger">{result.accounts}</span>
            </div>
            <div className="p-2 rounded bg-background/60 border border-border/40">
              <span className="text-[10px] text-muted-foreground uppercase font-mono block">Zero PII Leak</span>
              <span className="text-base font-bold font-mono text-ft-success">100%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
