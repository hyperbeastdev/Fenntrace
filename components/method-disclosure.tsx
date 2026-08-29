/**
 * Fenntrace — Method Disclosure
 *
 * Explains: what is checked, what is transmitted, what is not stored,
 * source/provider boundary, and limitations.
 *
 * Privacy is product UX — not a legal footnote.
 */

import { cn } from "@/lib/utils"

interface MethodDisclosureProps {
  source: string
  className?: string
}

export function MethodDisclosure({ source, className }: MethodDisclosureProps) {
  return (
    <section
      className={cn("flex flex-col gap-4", className)}
      aria-label="How this check works"
    >
      <h2 className="text-lg font-semibold tracking-[-0.01em] text-foreground">
        How this check works
      </h2>

      <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 text-sm leading-relaxed text-muted-foreground">
        <DisclosureItem
          label="What is checked"
          text="Your email address is checked against known records of data breaches compiled by the checked source."
        />
        <DisclosureItem
          label="Checked source"
          text={source}
          isMono
        />
        <DisclosureItem
          label="What is transmitted"
          text="Only the email address is used for the lookup. No additional personal information is collected or transmitted."
        />
        <DisclosureItem
          label="What is not stored"
          text="This prototype does not persist your email address or results in browser storage. All data exists only in the active session."
        />
        <DisclosureItem
          label="Limitations"
          text="This check queries a single source and does not establish complete internet-wide exposure. The absence of records does not guarantee that the email has never appeared in a breach."
        />
      </div>
    </section>
  )
}

function DisclosureItem({
  label,
  text,
  isMono = false,
}: {
  label: string
  text: string
  isMono?: boolean
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs font-medium uppercase tracking-wider text-ft-text-muted">
        {label}
      </dt>
      <dd className={cn(isMono && "font-mono text-[13px]")}>
        {text}
      </dd>
    </div>
  )
}
