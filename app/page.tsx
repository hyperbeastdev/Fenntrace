/**
 * Fenntrace — Main Application Landing Page
 *
 * Single-page exposure check experience with comprehensive visual
 * enhancements, sound feedback, 3D tilt cards, interactive telemetry radar,
 * password entropy lab, and architectural transparency FAQ.
 *
 * State Machine:
 *   STATE A — LANDING (idle, invalid)
 *   STATE B — APPLICATION (checking, found, notFound, unavailable, error, cleared)
 *
 * All state lives in transient React memory. Nothing is persisted.
 */

"use client"

import { useMemo, useCallback, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { EmailCheckForm } from "@/components/email-check-form"
import { HeroInvestigationTabs } from "@/components/hero-investigation-tabs"
import { PrivacyPromise } from "@/components/privacy-promise"
import { InvestigationSnapshot } from "@/components/investigation-snapshot"
import { CapabilityGrid } from "@/components/capability-grid"
import { ScanSequence } from "@/components/scan-sequence"
import { BreachMarquee } from "@/components/ui/breach-marquee"
import { DecryptText } from "@/components/ui/decrypt-text"
import { StatsRibbon } from "@/components/stats-ribbon"
import { CyberNodes } from "@/components/ui/cyber-nodes"
import { PasswordGeneratorCard } from "@/components/password-generator-card"
import { FaqAccordion } from "@/components/faq-accordion"
import { MatrixRain } from "@/components/ui/matrix-rain"
import { cyberAudio } from "@/components/ui/cyber-audio"
import {
  FoundView,
  NotFoundView,
  UnavailableView,
  ErrorView,
  ClearedView,
} from "@/components/result-views"
import { useExposureCheck } from "@/features/check/use-exposure-check"
import { HttpExposureProvider } from "@/lib/client/http-provider"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"

export default function FenntracePage() {
  const provider = useMemo(() => new HttpExposureProvider(), [])
  const { state, submitEmail, erase, restart, retry } = useExposureCheck(provider)

  const isLanding = state.status === "idle" || state.status === "invalid"

  // Trigger sound cues on state changes
  useEffect(() => {
    if (state.status === "found") {
      cyberAudio.playAlert()
    } else if (state.status === "notFound") {
      cyberAudio.playSuccessChime()
    }
  }, [state.status])

  // Keyboard shortcut handlers
  const handleFocusInput = useCallback(() => {
    const input = document.querySelector<HTMLInputElement>(
      "input[type='email'], input[type='password'], input[type='text']"
    )
    input?.focus()
  }, [])

  const handleEscape = useCallback(() => {
    if (!isLanding) {
      erase()
    }
  }, [isLanding, erase])

  useKeyboardShortcuts({
    onFocusInput: handleFocusInput,
    onEscape: handleEscape,
  })

  return (
    <div className="flex min-h-svh flex-col">
      <Header
        showNav={isLanding}
        onLogoClick={isLanding ? undefined : restart}
      />

      <main className="flex flex-1 flex-col">
        {isLanding ? (
          <LandingView />
        ) : (
          <div className="mx-auto w-full max-w-[var(--content-max-width)] px-4 sm:px-6 lg:px-8">
            {renderApplicationState()}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )

  function renderApplicationState() {
    switch (state.status) {
      case "checking":
        return <ScanSequence />

      case "found":
        return (
          <div className="py-8 sm:py-12 max-w-3xl mx-auto w-full">
            <FoundView result={state.result} onErase={erase} onRestart={restart} />
          </div>
        )

      case "notFound":
        return (
          <div className="py-8 sm:py-12 max-w-3xl mx-auto w-full">
            <NotFoundView source={state.source} onErase={erase} onRestart={restart} />
          </div>
        )

      case "unavailable":
        return <UnavailableView source={state.source} reason={state.reason} onRetry={retry} />

      case "error":
        return <ErrorView message={state.message} onRetry={retry} />

      case "cleared":
        return <ClearedView onRestart={restart} />

      default:
        return null
    }
  }

  function LandingView() {
    return (
      <>
        {/* ============================================================
            HERO — Two-column desktop, stacked mobile + Cyber Grid
            ============================================================ */}
        <section className="relative overflow-hidden bg-cyber-grid border-b border-border/30">
          {/* Subtle ambient glowing orb */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/10 rounded-full blur-[140px] pointer-events-none animate-pulse duration-1000" />

          <div className="relative z-10 mx-auto w-full max-w-[var(--content-max-width)] px-4 sm:px-6 lg:px-8 pt-14 pb-14 sm:pt-20 sm:pb-18 lg:pt-24 lg:pb-20">
            <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">

              {/* LEFT — Copy + 3-Way Investigation Tabs */}
              <div className="flex flex-1 flex-col gap-7 text-center lg:text-left lg:max-w-xl">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-center lg:justify-start gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
                    <span className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase font-mono">
                      <DecryptText text="PERSONAL DATA EXPOSURE INDEX" speed={30} />
                    </span>
                  </div>
                  <h1 className="text-4xl font-semibold tracking-[-0.025em] text-foreground sm:text-5xl lg:text-[3.4rem] text-balance leading-[1.1]">
                    Know where your data has surfaced.
                  </h1>
                  <p className="max-w-lg text-base sm:text-lg leading-relaxed text-muted-foreground text-balance mx-auto lg:mx-0">
                    Audit email addresses, verify password leaks with client-side k-Anonymity, and examine company domain exposure records.
                  </p>
                </div>

                <div className="w-full max-w-lg mx-auto lg:mx-0">
                  <HeroInvestigationTabs
                    onEmailSubmit={submitEmail}
                    isSubmittingEmail={state.status === "checking"}
                    emailError={state.status === "invalid" ? state.error : undefined}
                  />
                </div>

                <PrivacyPromise className="mx-auto lg:mx-0" />
              </div>

              {/* RIGHT — 3D Holographic Tilt Card Product Preview */}
              <div className="hidden lg:flex lg:flex-shrink-0 lg:items-center lg:justify-end">
                <InvestigationSnapshot />
              </div>
            </div>
          </div>
        </section>

        {/* Breach Marquee Ticker Strip */}
        <BreachMarquee />

        {/* Preview on mobile/tablet — below hero */}
        <div className="flex justify-center px-4 py-8 lg:hidden">
          <InvestigationSnapshot className="w-full" />
        </div>

        {/* ============================================================
            CONTENT SECTIONS
            ============================================================ */}
        <div className="mx-auto w-full max-w-[var(--content-max-width)] px-4 sm:px-6 lg:px-8">

          {/* 1. Global Intelligence Stats Ribbon */}
          <StatsRibbon />

          {/* 2. Global Threat Radar & Network Arcs */}
          <section id="radar" className="py-16 sm:py-20 border-b border-border/30">
            <div className="mb-8 flex flex-col gap-2">
              <span className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase font-mono">
                Threat Mesh
              </span>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Global Threat Intelligence Telemetry
              </h2>
              <p className="text-sm text-muted-foreground max-w-xl">
                Real-time node telemetry aggregating compromised credential vectors across dark-web repositories and dump forums.
              </p>
            </div>

            <CyberNodes />
          </section>

          {/* 3. How It Works */}
          <section id="how-it-works" className="py-16 sm:py-20 border-b border-border/30">
            <div className="mb-10">
              <span className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase font-mono">
                Process
              </span>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                How it works
              </h2>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              <HowItWorksStep
                number="01"
                title="Input Vector"
                description="Enter an email, password prefix, or corporate domain to audit."
              />
              <HowItWorksStep
                number="02"
                title="Cryptographic Match"
                description="Queries index hashes with client-side k-Anonymity without transmitting plaintext credentials."
              />
              <HowItWorksStep
                number="03"
                title="Remediation Plan"
                description="Receive an interactive mitigation checklist with 1-click credential recovery actions."
              />
            </div>
          </section>

          {/* 4. Password Generator & Entropy Lab */}
          <PasswordGeneratorCard />

          {/* 5. Capability Grid */}
          <CapabilityGrid className="border-b border-border/30" />

          {/* 6. Security Architecture FAQ */}
          <FaqAccordion />

          {/* 7. Final Interactive CTA with Matrix Canvas Backdrop */}
          <section className="relative my-12 rounded-3xl border border-border/80 overflow-hidden bg-card/60 p-8 sm:p-14 shadow-2xl">
            <MatrixRain opacity={0.35} speed={0.8} color="#3fb950" headColor="#58a6ff" />

            <div className="relative z-10 flex flex-col items-center gap-6 text-center max-w-xl mx-auto">
              <div className="flex flex-col gap-2">
                <span className="h-2 w-2 rounded-full bg-primary mx-auto animate-ping" />
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                  Ready to audit your digital footprint?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Zero logs. Zero accounts. Pure cryptographic confidentiality.
                </p>
              </div>

              <div className="w-full max-w-md">
                <EmailCheckForm
                  onSubmit={submitEmail}
                  isSubmitting={state.status === "checking"}
                  showDemoChips={false}
                />
              </div>

              <PrivacyPromise />
            </div>
          </section>
        </div>
      </>
    )
  }
}

function HowItWorksStep({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col gap-3 border-l-2 border-primary/40 pl-5 bg-card/30 py-2 rounded-r-lg">
      <span className="text-xs font-mono text-primary font-bold">{number}</span>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  )
}
