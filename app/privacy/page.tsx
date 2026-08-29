/**
 * Fenntrace — Privacy Policy
 *
 * Prototype privacy policy page. Clearly marked as hackathon documentation.
 * Visually consistent with the rest of the Fenntrace design system.
 */

import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Privacy Policy — Fenntrace",
  description: "How Fenntrace handles your data during an exposure check.",
}

export default function PrivacyPolicyPage() {
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
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Hackathon prototype — last updated August 2026
            </p>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-8">
            <PolicySection title="About this document">
              <p>
                Fenntrace is a hackathon prototype demonstrating a privacy-first
                exposure investigation product. This privacy policy describes
                how the prototype handles data during an exposure check.
              </p>
              <p>
                This document does not constitute a legally binding commercial
                privacy policy. Fenntrace is not currently a commercial service.
              </p>
            </PolicySection>

            <PolicySection title="What data is collected">
              <p>
                When you use Fenntrace, the only personal information involved in
                the check is the <strong>email address</strong> you enter.
              </p>
              <p>
                No additional personal information is collected, requested, or
                transmitted during the check process.
              </p>
            </PolicySection>

            <PolicySection title="How data is used">
              <p>
                The email address is used exclusively to query the configured
                exposure data source (currently the Fenntrace Demo Source) for
                matching breach records.
              </p>
              <p>
                The email address is not used for marketing, profiling, analytics,
                or any purpose beyond the exposure check.
              </p>
            </PolicySection>

            <PolicySection title="Data storage">
              <p>
                This prototype <strong>does not persist</strong> your email address
                or investigation results in any form of browser storage, including
                localStorage, sessionStorage, IndexedDB, or cookies.
              </p>
              <p>
                All data exists only in the active browser session memory and is
                cleared when the page is refreshed or closed. The &ldquo;Erase
                this check&rdquo; action immediately removes all investigation
                data from session memory.
              </p>
            </PolicySection>

            <PolicySection title="Data sources">
              <p>
                The current prototype queries the <strong>Fenntrace Demo Source</strong>,
                which contains simulated breach records for demonstration purposes.
              </p>
              <p>
                Results reflect only the configured source and do not represent
                complete internet-wide exposure detection.
              </p>
            </PolicySection>

            <PolicySection title="Third-party sharing">
              <p>
                No personal data is shared with, sold to, or transmitted to any
                third party as part of this prototype.
              </p>
            </PolicySection>

            <PolicySection title="Limitations">
              <p>
                The absence of records in a Fenntrace check does not guarantee
                that an email address has never appeared in a data breach. This
                prototype queries a single source and should not be relied upon
                as comprehensive breach detection.
              </p>
            </PolicySection>

            <PolicySection title="Contact">
              <p>
                For questions about this prototype, please contact the Fenntrace
                team through the hackathon submission.
              </p>
            </PolicySection>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function PolicySection({
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
