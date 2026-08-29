/**
 * Fenntrace — Capability Grid
 *
 * Shows 4 focused product capabilities on the landing page.
 * Communicates what the user gets from an investigation
 * without rendering the actual results.
 */

import { cn } from "@/lib/utils"

const CAPABILITIES = [
  {
    title: "Exposure timeline",
    description: "Know when and where exposure occurred across known breach records.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M3 4h14M3 10h10M3 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-primary" />
      </svg>
    ),
  },
  {
    title: "Data types exposed",
    description: "Understand whether email, passwords, usernames, or other data appeared.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" className="text-primary" />
        <rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" className="text-primary" />
        <rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" className="text-primary" />
        <rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" className="text-primary" opacity="0.4" />
      </svg>
    ),
  },
  {
    title: "Severity assessment",
    description: "Prioritize the most serious exposure with clear risk levels.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" className="text-primary" />
        <path d="M10 6v5M10 13.5v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-primary" />
      </svg>
    ),
  },
  {
    title: "Recommended actions",
    description: "Turn findings into concrete, prioritized next steps.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M6 10l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary" />
        <rect x="2" y="2" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" className="text-primary" opacity="0.5" />
      </svg>
    ),
  },
] as const

export function CapabilityGrid({ className }: { className?: string }) {
  return (
    <section className={cn("py-20 sm:py-24", className)}>
      <div className="mb-12">
        <span className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase">
          What you get
        </span>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          A complete exposure report
        </h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {CAPABILITIES.map((cap) => (
          <div
            key={cap.title}
            className="flex flex-col gap-3 rounded-xl border border-border/40 bg-card/40 p-5 transition-colors hover:border-border hover:bg-card/60"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              {cap.icon}
            </div>
            <h3 className="text-[15px] font-semibold text-foreground">
              {cap.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {cap.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
