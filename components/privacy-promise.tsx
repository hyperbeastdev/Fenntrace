/**
 * Fenntrace — Privacy Promise
 *
 * Microcopy that communicates the transient nature of the check.
 * Displayed near the email input as part of the product UX,
 * not buried in a footer.
 */

import { cn } from "@/lib/utils"

export function PrivacyPromise({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "text-[13px] leading-relaxed text-muted-foreground",
        className
      )}
    >
      <span className="inline-flex items-center gap-1.5">
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
          className="shrink-0 opacity-60"
        >
          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
          <path
            d="M7 4v3.5M7 9.5v.01"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
        Your email is used for this check only. Nothing is stored in your browser.
        You can erase the results at any time.
      </span>
    </p>
  )
}
