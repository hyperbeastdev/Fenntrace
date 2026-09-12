/**
 * Fenntrace — Interactive Action Plan & Remediation Checklist
 *
 * 3–5 ordered concrete actions based on the exposure result.
 * Features:
 * - Interactive checkable tasks with persistent progress in active session
 * - Live progress bar & completion celebration
 * - Direct 1-click links to major security settings pages
 * - Export Briefing (Copy Markdown & Print / PDF)
 */

"use client"

import { useState } from "react"
import {
  CheckCircle2,
  Circle,
  Copy,
  Check,
  Printer,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ConfettiBurst } from "@/components/confetti-burst"
import type { ActionItem, ExposureResult } from "@/domain/types"

interface ActionPlanProps {
  actions: ActionItem[]
  result?: ExposureResult
  className?: string
}

const SECURITY_PORTALS = [
  { name: "Google Security", url: "https://myaccount.google.com/security" },
  { name: "Microsoft Security", url: "https://account.microsoft.com/security" },
  { name: "Apple ID & Passwords", url: "https://appleid.apple.com" },
  { name: "Bitwarden Vault", url: "https://vault.bitwarden.com" },
]

export function ActionPlan({ actions, result, className }: ActionPlanProps) {
  const [completedItems, setCompletedItems] = useState<Record<number, boolean>>({})
  const [copied, setCopied] = useState(false)

  const toggleItem = (order: number) => {
    setCompletedItems((prev) => ({
      ...prev,
      [order]: !prev[order],
    }))
  }

  const completedCount = actions.filter((a) => completedItems[a.order]).length
  const totalCount = actions.length
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  const isAllCompleted = totalCount > 0 && completedCount === totalCount

  const handleCopyMarkdown = () => {
    if (!result) return

    const dateStr = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })

    const markdown = [
      `# Fenntrace Exposure Incident Briefing`,
      `**Generated on:** ${dateStr}`,
      `**Source:** ${result.source}`,
      `**Risk Level:** ${result.riskLevel.toUpperCase()}`,
      `**Total Exposure Records:** ${result.exposureCount}`,
      ``,
      `## Compromised Services & Breaches`,
      ...result.breaches.map(
        (b) =>
          `- **${b.name}** (${b.date.slice(0, 4)}): Exposed ${b.dataCategories.join(", ")} [Severity: ${b.severity}]`
      ),
      ``,
      `## Prioritized Remediation Plan`,
      ...actions.map(
        (a) =>
          `- [${completedItems[a.order] ? "x" : " "}] **${a.action}**: ${a.rationale}`
      ),
      ``,
      `---\n*Report generated with Fenntrace zero-storage privacy engine.*`,
    ].join("\n")

    navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <section className={cn("flex flex-col gap-6", className)} aria-label="Recommended actions">
      {/* Header with Title + Export Tools */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold tracking-[-0.01em] text-foreground">
              Remediation Action Plan
            </h2>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-mono text-muted-foreground">
              {completedCount}/{totalCount}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Check off steps as you complete them to secure your accounts.
          </p>
        </div>

        {/* Export / Print Buttons */}
        <div className="flex items-center gap-2 print:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyMarkdown}
            className="h-8 gap-1.5 text-xs border-border/70"
            title="Copy sanitized markdown summary for your records"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-ft-success" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Briefing</span>
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="h-8 gap-1.5 text-xs border-border/70"
            title="Print or save as PDF"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print / PDF</span>
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Remediation Progress</span>
          <span className="font-medium text-foreground tabular-nums">{progressPercent}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary/80">
          <div
            className={cn(
              "h-full transition-all duration-500 rounded-full",
              isAllCompleted ? "bg-ft-success" : "bg-primary"
            )}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* All completed celebratory banner with particle burst */}
      {isAllCompleted && (
        <div className="relative overflow-hidden flex items-center gap-3 rounded-xl border border-ft-success/40 bg-ft-success-muted/30 p-4 text-xs text-foreground animate-in fade-in duration-300">
          <ConfettiBurst trigger={isAllCompleted} />
          <Sparkles className="h-5 w-5 text-ft-success shrink-0" />
          <div className="flex flex-col gap-0.5 relative z-10">
            <span className="font-semibold text-ft-success">All recommended actions completed!</span>
            <span className="text-muted-foreground">
              You have mitigated the highest risk vulnerabilities associated with this exposure.
            </span>
          </div>
        </div>
      )}

      {/* Interactive Action List */}
      <ol className="flex flex-col gap-3">
        {actions.map((item, index) => {
          const isDone = Boolean(completedItems[item.order])
          return (
            <li
              key={item.order}
              onClick={() => toggleItem(item.order)}
              className={cn(
                "group flex cursor-pointer select-none items-start gap-4 rounded-xl border p-4 sm:p-5 transition-all duration-200",
                isDone
                  ? "border-border/30 bg-card/40 opacity-75 line-through decoration-muted-foreground/50"
                  : index === 0
                  ? "border-primary/40 bg-primary/5 hover:border-primary/60 hover:bg-primary/10 shadow-sm"
                  : "border-border/60 bg-card hover:bg-card/70 hover:border-border"
              )}
            >
              {/* Checkbox trigger */}
              <button
                type="button"
                aria-label={isDone ? `Mark step ${item.order} incomplete` : `Mark step ${item.order} complete`}
                className="mt-0.5 shrink-0 transition-transform active:scale-95 focus-visible:outline-none"
              >
                {isDone ? (
                  <CheckCircle2 className="h-5 w-5 text-ft-success transition-colors" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground/60 group-hover:text-foreground transition-colors" />
                )}
              </button>

              <div className="flex flex-1 flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground/70">
                    Step {item.order < 10 ? `0${item.order}` : item.order}
                  </span>
                </div>
                <p
                  className={cn(
                    "font-semibold tracking-tight text-foreground",
                    index === 0 && !isDone ? "text-base text-primary" : "text-sm",
                    isDone && "text-muted-foreground"
                  )}
                >
                  {item.action}
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground no-underline">
                  {item.rationale}
                </p>
              </div>
            </li>
          )
        })}
      </ol>

      {/* Quick Security Portals Shortcut Strip */}
      <div className="flex flex-col gap-2.5 rounded-xl border border-border/40 bg-card/50 p-4 print:hidden">
        <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          Direct Security Center Portals:
        </span>
        <div className="flex flex-wrap gap-2">
          {SECURITY_PORTALS.map((portal) => (
            <a
              key={portal.name}
              href={portal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-secondary/50 px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary hover:border-border transition-colors"
            >
              <span>{portal.name}</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
