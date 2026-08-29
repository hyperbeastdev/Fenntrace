/**
 * Fenntrace — Main Page
 *
 * Single-page exposure check experience.
 * Renders exactly ONE of two product states:
 *
 *   STATE A — LANDING (idle, invalid)
 *     The product introduction page. The investigation report
 *     never appears here.
 *
 *   STATE B — APPLICATION (checking, found, notFound, unavailable, error, cleared)
 *     The investigation experience. The landing page disappears
 *     entirely when this state is active.
 *
 * All state lives in React memory. Nothing is persisted.
 */

"use client"

import { useMemo } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { EmailCheckForm } from "@/components/email-check-form"
import { PrivacyPromise } from "@/components/privacy-promise"
import { InvestigationSnapshot } from "@/components/investigation-snapshot"
import { CapabilityGrid } from "@/components/capability-grid"
import { ScanSequence } from "@/components/scan-sequence"
import {
  FoundView,
  NotFoundView,
  UnavailableView,
  ErrorView,
  ClearedView,
} from "@/components/result-views"
import { useExposureCheck } from "@/features/check/use-exposure-check"
import { DemoProvider } from "@/demo/provider"

export default function FenntracePage() {
  const provider = useMemo(() => new DemoProvider(), [])
  const { state, submitEmail, erase, restart, retry } = useExposureCheck(provider)

  const isLanding = state.status === "idle" || state.status === "invalid"

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
            HERO — Two-column desktop, stacked mobile
            ============================================================ */}
        <section className="relative overflow-hidden">
          {/* Subtle ambient glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 mx-auto w-full max-w-[var(--content-max-width)] px-4 sm:px-6 lg:px-8 pt-16 pb-16 sm:pt-24 sm:pb-20 lg:pt-28 lg:pb-24">
            <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">

              {/* LEFT — Copy + CTA */}
              <div className="flex flex-1 flex-col gap-8 text-center lg:text-left lg:max-w-xl">
                <div className="flex flex-col gap-5">
                  <span className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase">
                    Personal Data Exposure
                  </span>
                  <h1 className="text-4xl font-semibold tracking-[-0.025em] text-foreground sm:text-5xl lg:text-[3.5rem] text-balance leading-[1.1]">
                    Know where your data has surfaced.
                  </h1>
                  <p className="max-w-lg text-lg leading-relaxed text-muted-foreground text-balance mx-auto lg:mx-0">
                    Find out whether your email appears in known data breaches — and understand what was exposed and what to do next.
                  </p>
                </div>

                <div className="w-full max-w-md mx-auto lg:mx-0">
                  <EmailCheckForm
                    onSubmit={submitEmail}
                    isSubmitting={state.status === "checking"}
                  />
                  {state.status === "invalid" && (
                    <p role="alert" className="mt-3 text-sm text-destructive font-medium">
                      {state.error}
                    </p>
                  )}
                </div>

                <PrivacyPromise className="mx-auto lg:mx-0" />
              </div>

              {/* RIGHT — Static investigation preview */}
              <div className="hidden lg:flex lg:flex-shrink-0 lg:items-center lg:justify-end">
                <InvestigationSnapshot />
              </div>
            </div>
          </div>
        </section>

        {/* Preview on mobile/tablet — below hero */}
        <div className="flex justify-center px-4 pb-12 lg:hidden">
          <InvestigationSnapshot className="w-full" />
        </div>

        {/* ============================================================
            CONTENT SECTIONS
            ============================================================ */}
        <div className="mx-auto w-full max-w-[var(--content-max-width)] px-4 sm:px-6 lg:px-8">

          {/* Trust strip */}
          <section className="border-t border-border/30 py-12 sm:py-16">
            <p className="text-center text-lg font-medium tracking-tight text-muted-foreground sm:text-xl">
              Privacy should leave a trace, not a profile.
            </p>
          </section>

          {/* How it works */}
          <section id="how-it-works" className="py-16 sm:py-20 border-t border-border/30">
            <div className="mb-10">
              <span className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase">
                Process
              </span>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                How it works
              </h2>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              <HowItWorksStep
                number="01"
                title="Check"
                description="Enter the email address you want to investigate."
              />
              <HowItWorksStep
                number="02"
                title="Discover"
                description="Fenntrace checks known exposure records."
              />
              <HowItWorksStep
                number="03"
                title="Understand"
                description="See what was exposed, why it matters, and what to do next."
              />
            </div>
          </section>

          {/* Capability grid */}
          <CapabilityGrid className="border-t border-border/30" />

          {/* Privacy section */}
          <section id="privacy" className="py-16 sm:py-20 border-t border-border/30">
            <div className="mb-12">
              <span className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase">
                Privacy
              </span>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Privacy as a baseline
              </h2>
            </div>

            <div className="grid gap-10 sm:grid-cols-2">
              <PrivacyItem
                title="What is transmitted"
                description="Only the email address is used for the lookup. No additional personal information is collected or transmitted."
              />
              <PrivacyItem
                title="What is stored"
                description="This prototype does not persist your email address or results in browser storage. All data exists only in the active session."
              />
              <PrivacyItem
                title="What is checked"
                description="Your email address is checked against known records of data breaches compiled by the Fenntrace Demo Source."
              />
              <PrivacyItem
                title="Limitations"
                description="This check queries a single source and does not establish complete internet-wide exposure. The absence of records does not guarantee that the email has never appeared in a breach."
              />
            </div>
          </section>

          {/* Final CTA */}
          <section className="border-t border-border/30 py-16 sm:py-20">
            <div className="flex flex-col items-center gap-8 text-center">
              <div className="flex flex-col gap-3">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  Check your exposure
                </h2>
                <p className="text-muted-foreground">
                  Enter your email below to begin an investigation.
                </p>
              </div>

              <div className="w-full max-w-md">
                <EmailCheckForm
                  onSubmit={submitEmail}
                  isSubmitting={state.status === "checking"}
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

// ---------------------------------------------------------------------------
// Landing page sub-components (kept local to avoid over-abstraction)
// ---------------------------------------------------------------------------

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
    <div className="flex flex-col gap-3 border-l border-border/40 pl-5">
      <span className="text-xs font-mono text-primary/80">{number}</span>
      <h3 className="text-lg font-medium text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

function PrivacyItem({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
        {title}
      </h4>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  )
}
