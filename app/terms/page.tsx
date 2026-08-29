/**
 * Fenntrace — Terms of Use
 *
 * Prototype terms of use page. Clearly marked as hackathon documentation.
 * Visually consistent with the rest of the Fenntrace design system.
 */

import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Terms of Use — Fenntrace",
  description: "Terms of use for the Fenntrace prototype.",
}

export default function TermsPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <Header showNav={false} />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
          {/* Page header */}
          <div className="mb-10">
            <Link
              href="/"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground mb-6 inline-block"
            >
              ← Back to Fenntrace
            </Link>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Terms of Use
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Hackathon prototype — last updated August 2026
            </p>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-8">
            <TermsSection title="Prototype status">
              <p>
                Fenntrace is a hackathon prototype built to demonstrate
                a privacy-first data exposure investigation concept.
                It is not a commercial service, and these terms reflect
                its prototype status.
              </p>
            </TermsSection>

            <TermsSection title="Nature of results">
              <p>
                Results provided by Fenntrace are <strong>informational only</strong> and
                are based on the currently configured demonstration data source.
              </p>
              <p>
                Results should not be interpreted as a comprehensive assessment
                of data breach exposure across the internet. The absence of
                records does not guarantee that an email address has never been
                involved in a data breach.
              </p>
            </TermsSection>

            <TermsSection title="No professional advice">
              <p>
                Fenntrace does not provide professional cybersecurity, legal,
                or identity theft protection advice. Recommended actions are
                general best practices and should not replace consultation
                with qualified professionals.
              </p>
            </TermsSection>

            <TermsSection title="Data source limitations">
              <p>
                The current prototype uses the <strong>Fenntrace Demo Source</strong>,
                which contains simulated records for demonstration purposes.
                The service should not be relied upon for actual security
                decisions without independent verification.
              </p>
            </TermsSection>

            <TermsSection title="User responsibility">
              <p>
                Users should independently verify important security decisions
                and take appropriate action based on their own assessment of
                risk, including consulting relevant security tools and services.
              </p>
            </TermsSection>

            <TermsSection title="No warranty">
              <p>
                This prototype is provided &ldquo;as is&rdquo; without warranty
                of any kind, express or implied, including but not limited to
                accuracy, completeness, or fitness for a particular purpose.
              </p>
            </TermsSection>

            <TermsSection title="Changes">
              <p>
                As a prototype, these terms may be updated without notice.
                The current version reflects the state of the project at
                the time of the hackathon submission.
              </p>
            </TermsSection>

            <TermsSection title="Contact">
              <p>
                For questions about this prototype, please contact the Fenntrace
                team through the hackathon submission.
              </p>
            </TermsSection>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function TermsSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-[11px] font-bold tracking-[0.15em] text-muted-foreground uppercase">
        {title}
      </h2>
      <div className="flex flex-col gap-2 text-sm leading-relaxed text-muted-foreground [&_strong]:text-foreground [&_strong]:font-medium">
        {children}
      </div>
    </section>
  )
}
