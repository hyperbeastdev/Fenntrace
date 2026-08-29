/**
 * Fenntrace — Action Plan
 *
 * 3–5 ordered concrete actions based on the exposure result.
 * Each action has a clear imperative + one-line rationale.
 * The user should know what to do first.
 */

import { cn } from "@/lib/utils"
import type { ActionItem } from "@/domain/types"

interface ActionPlanProps {
  actions: ActionItem[]
  className?: string
}

export function ActionPlan({ actions, className }: ActionPlanProps) {
  return (
    <section className={cn("flex flex-col gap-5", className)} aria-label="Recommended actions">
      <h2 className="text-lg font-semibold tracking-[-0.01em] text-foreground">
        Recommended actions
      </h2>

      <ol className="flex flex-col gap-3">
        {actions.map((item, index) => (
          <li
            key={item.order}
            className={cn(
              "flex gap-4 rounded-xl border p-5 transition-colors",
              index === 0
                ? "border-primary/40 bg-primary/5 shadow-sm"
                : "border-border/60 bg-card hover:bg-card/60 hover:border-border"
            )}
          >
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold tabular-nums",
                index === 0
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              )}
              aria-hidden="true"
            >
              {item.order < 10 ? `0${item.order}` : item.order}
            </span>
            <div className="flex flex-col gap-1.5 min-w-0 mt-0.5">
              <p className={cn(
                "font-semibold text-foreground tracking-tight",
                index === 0 ? "text-base text-primary" : "text-[15px]"
              )}>
                {item.action}
              </p>
              <p className={cn(
                "leading-relaxed",
                index === 0 ? "text-sm text-foreground/80" : "text-[13px] text-muted-foreground/90"
              )}>
                {item.rationale}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
