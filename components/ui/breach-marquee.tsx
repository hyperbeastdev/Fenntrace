/**
 * Fenntrace — Breach Intelligence Marquee
 *
 * Smooth infinite ticker tape displaying live breach data points
 * and cryptographic privacy metrics.
 */

import { ShieldCheck, AlertCircle, Database, Lock, Radio } from "lucide-react"
import { cn } from "@/lib/utils"

const MARQUEE_ITEMS = [
  { icon: ShieldCheck, text: "Zero Data Retention Guarantee", highlight: "100% Ephemeral" },
  { icon: AlertCircle, text: "Adobe Systems Incident", highlight: "153M Passwords" },
  { icon: Lock, text: "k-Anonymity Cryptographic Range Check", highlight: "SHA-1 Standard" },
  { icon: Database, text: "Canva Breach Archive", highlight: "137M Records" },
  { icon: Radio, text: "Live Intelligence Registry", highlight: "Active Engine" },
  { icon: AlertCircle, text: "LinkedIn Historical Leak", highlight: "164M Accounts" },
]

export function BreachMarquee({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden border-y border-border/40 bg-background/50 py-3 select-none backdrop-blur-sm",
        className
      )}
      aria-hidden="true"
    >
      {/* Left/Right Edge Fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

      {/* Marquee Track */}
      <div className="animate-marquee flex items-center gap-8">
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, index) => {
          const Icon = item.icon
          return (
            <div
              key={index}
              className="inline-flex items-center gap-2.5 rounded-full border border-border/50 bg-card/60 px-3.5 py-1 text-xs text-muted-foreground whitespace-nowrap"
            >
              <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>{item.text}</span>
              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-mono font-medium text-primary">
                {item.highlight}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
