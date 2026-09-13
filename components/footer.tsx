/**
 * Fenntrace — Site Footer
 *
 * Complete product footer displayed on all pages.
 * Contains product links, legal links, and prototype disclaimer.
 */

import Link from "next/link"
import { cn } from "@/lib/utils"

export function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "border-t border-border/30",
        className
      )}
    >
      <div className="mx-auto w-full max-w-[var(--content-max-width)] px-4 sm:px-6 lg:px-8">
        {/* Main footer grid */}
        <div className="grid gap-8 py-10 sm:grid-cols-3 sm:py-12">
          {/* Brand column */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-foreground">Fenntrace</span>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Privacy-first exposure investigation.
            </p>
          </div>

          {/* Product column */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-bold tracking-[0.15em] text-muted-foreground uppercase">
              Product
            </span>
            <nav className="flex flex-col gap-1.5" aria-label="Product links">
              <Link
                href="/breaches"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground w-fit"
              >
                Breach Directory
              </Link>
              <a
                href="/#how-it-works"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground w-fit"
              >
                How it works
              </a>
              <a
                href="/#radar"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground w-fit"
              >
                Telemetry Radar
              </a>
              <a
                href="/#password-generator"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground w-fit"
              >
                Password Generator
              </a>
              <a
                href="/"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground w-fit"
              >
                Check exposure
              </a>
            </nav>
          </div>

          {/* Legal column */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-bold tracking-[0.15em] text-muted-foreground uppercase">
              Legal
            </span>
            <nav className="flex flex-col gap-1.5" aria-label="Legal links">
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground w-fit"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground w-fit"
              >
                Terms of Use
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-2 border-t border-border/20 py-6 text-xs text-muted-foreground sm:flex-row">
          <span>© 2026 Fenntrace</span>
          <span>Hackathon prototype — not a commercial service</span>
        </div>
      </div>
    </footer>
  )
}
