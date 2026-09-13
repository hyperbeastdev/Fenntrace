/**
 * Fenntrace — Global Intelligence Stats Ribbon
 *
 * Real-time trust metrics strip displaying global breach record indexing,
 * zero-retention verification, low-latency pipeline, and k-Anonymity standard.
 */

"use client"

import { SpotlightCard } from "@/components/ui/spotlight-card"
import { Database, ShieldCheck, Zap, Lock } from "lucide-react"

export function StatsRibbon() {
  const stats = [
    {
      value: "14.8B+",
      label: "Indexed Records",
      sub: "Global Breach Registry",
      icon: Database,
      accent: "text-primary",
    },
    {
      value: "100%",
      label: "Zero Retention",
      sub: "Ephemeral In-Memory",
      icon: ShieldCheck,
      accent: "text-emerald-400",
    },
    {
      value: "< 45ms",
      label: "Query Latency",
      sub: "Sub-second Pipeline",
      icon: Zap,
      accent: "text-amber-400",
    },
    {
      value: "k-Anon",
      label: "Privacy Standard",
      sub: "Cryptographic SHA-1",
      icon: Lock,
      accent: "text-sky-400",
    },
  ]

  return (
    <section className="py-8 sm:py-10 border-b border-border/30">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
        {stats.map((item, index) => {
          const Icon = item.icon
          return (
            <SpotlightCard
              key={index}
              className="p-5 flex flex-col gap-2 bg-card/80 border border-border/80 shadow-md transition-all hover:border-primary/40 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono tabular-nums">
                  {item.value}
                </span>
                <div className={`p-2 rounded-lg bg-secondary/80 border border-border/60 ${item.accent} group-hover:scale-110 transition-transform`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-semibold text-foreground">{item.label}</span>
                <span className="text-[10.5px] text-muted-foreground font-mono mt-0.5">{item.sub}</span>
              </div>
            </SpotlightCard>
          )
        })}
      </div>
    </section>
  )
}
