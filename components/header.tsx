/**
 * Fenntrace — Site Header
 *
 * Minimal navigation bar with the original Fenntrace landscape logo
 * on the left, audio synthesizer toggle, and navigation on the right.
 *
 * Logo is always clickable and navigates home.
 */

"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Volume2, VolumeX } from "lucide-react"
import { cn } from "@/lib/utils"
import { ProviderStatusBadge } from "@/components/provider-status-badge"
import { cyberAudio } from "@/components/ui/cyber-audio"

interface HeaderProps {
  className?: string
  /** Whether to show the "How it works" / "Privacy" nav links (landing only) */
  showNav?: boolean
  /** Called when logo is clicked to reset app state (results → landing) */
  onLogoClick?: () => void
}

export function Header({ className, showNav = true, onLogoClick }: HeaderProps) {
  const [audioActive, setAudioActive] = useState(true)

  const toggleAudio = () => {
    const next = !audioActive
    setAudioActive(next)
    cyberAudio.enabled = next
    if (next) {
      cyberAudio.playClick()
    }
  }

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
        <nav className="flex items-center gap-3 sm:gap-5" aria-label="Main navigation">
          {/* Audio Synthesizer Toggle */}
          <button
            type="button"
            onClick={toggleAudio}
            title={audioActive ? "Mute cyber audio effects" : "Enable cyber audio effects"}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg border transition-colors",
              audioActive
                ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20"
                : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
            )}
            aria-label={audioActive ? "Mute audio" : "Unmute audio"}
          >
            {audioActive ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>

          <Link
            href="/breaches"
            className="text-xs sm:text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:text-foreground"
          >
            Breach Directory
          </Link>

          {showNav && (
            <>
              <a
                href="/#radar"
                className="hidden md:inline text-xs sm:text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:text-foreground"
              >
                Telemetry
              </a>
              <a
                href="/#password-generator"
                className="hidden lg:inline text-xs sm:text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:text-foreground"
              >
                Password Generator
              </a>
              <a
                href="/#faq"
                className="hidden sm:inline text-xs sm:text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:text-foreground"
              >
                FAQ
              </a>
            </>
          )}

          <ProviderStatusBadge className="inline-flex sm:hidden" />
        </nav>
      </div>
    </header>
  )
}
