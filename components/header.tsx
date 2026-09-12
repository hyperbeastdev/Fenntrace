/**
 * Fenntrace — Site Header
 *
 * Minimal navigation bar with the original Fenntrace landscape logo
 * on the left and restrained navigation on the right.
 *
 * Logo is always clickable and navigates home.
 */

"use client"

import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ProviderStatusBadge } from "@/components/provider-status-badge"

interface HeaderProps {
  className?: string
  /** Whether to show the "How it works" / "Privacy" nav links (landing only) */
  showNav?: boolean
  /** Called when logo is clicked to reset app state (results → landing) */
  onLogoClick?: () => void
}

export function Header({ className, showNav = true, onLogoClick }: HeaderProps) {
  const logoElement = (
    <Image
      src="/fenntrace-logo.svg"
      alt="Fenntrace"
      width={140}
      height={53}
      className="h-9 w-auto sm:h-12"
      priority
    />
  )

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md",
        className
      )}
    >
      <div className="mx-auto flex h-16 lg:h-20 w-full max-w-[var(--content-max-width)] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo — always clickable */}
        <div className="flex items-center gap-4">
          {onLogoClick ? (
            <button
              type="button"
              onClick={onLogoClick}
              className="flex items-center transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-md"
              aria-label="Fenntrace — return to home"
            >
              {logoElement}
            </button>
          ) : (
            <Link
              href="/"
              className="flex items-center transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-md"
              aria-label="Fenntrace — return to home"
            >
              {logoElement}
            </Link>
          )}

          <ProviderStatusBadge className="hidden sm:inline-flex" />
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-5 sm:gap-7" aria-label="Main navigation">
          <Link
            href="/breaches"
            className="text-xs sm:text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:text-foreground"
          >
            Breach Directory
          </Link>

          {showNav && (
            <>
              <a
                href="/#how-it-works"
                className="hidden sm:inline text-xs sm:text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:text-foreground"
              >
                How it works
              </a>
              <a
                href="/#privacy"
                className="hidden sm:inline text-xs sm:text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:text-foreground"
              >
                Privacy
              </a>
            </>
          )}

          <ProviderStatusBadge className="inline-flex sm:hidden" />
        </nav>
      </div>
    </header>
  )
}

