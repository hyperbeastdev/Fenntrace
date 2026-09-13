/**
 * Fenntrace — Security Architecture FAQ Accordion
 *
 * Interactive expandable accordion answering core questions regarding
 * zero-data retention, k-Anonymity mathematical safety, and incident recovery.
 */

"use client"

import { useState } from "react"
import { HelpCircle, ChevronDown, ShieldCheck, Lock, EyeOff, Radio } from "lucide-react"
import { cyberAudio } from "@/components/ui/cyber-audio"
import { cn } from "@/lib/utils"

export function FaqAccordion({ className }: { className?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const FAQS = [
    {
      q: "How does Fenntrace guarantee zero data retention?",
      a: "Every investigation runs entirely in transient memory during your active browser tab session. We maintain no user accounts, no query logging databases, and send standard 'no-store, no-cache' HTTP headers to prevent intermediary proxies and caches from storing your email address.",
      icon: EyeOff,
    },
    {
      q: "What is k-Anonymity and why is it safer than typical hash checks?",
      a: "With k-Anonymity, your browser locally hashes your password using SHA-1 and transmits only the first 5 hexadecimal characters (e.g., 5BAA6). The server returns all candidate breach hashes matching that 5-character prefix. Your browser then checks for matches locally in memory, ensuring neither Fenntrace nor any network snooper ever learns your password or its full hash.",
      icon: Lock,
    },
    {
      q: "What is the immediate priority if my password appeared in a breach?",
      a: "First, change that password immediately on the affected service. Second, update any other accounts where you may have reused that password. Third, enable Two-Factor Authentication (2FA) via hardware security keys (FIDO2) or authenticator apps.",
      icon: ShieldCheck,
    },
    {
      q: "Where does Fenntrace source its breach intelligence?",
      a: "Fenntrace combines verified historical breach datasets with real-time API integrations (such as Have I Been Pwned v3 and internal cryptographic indexes) depending on runtime configuration.",
      icon: Radio,
    },
  ]

  return (
    <section id="faq" className={cn("py-16 sm:py-20 border-t border-border/30", className)}>
      <div className="mb-10 flex flex-col gap-2">
        <span className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase font-mono">
          Transparency & Security
        </span>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-muted-foreground max-w-xl">
          Learn how our client-side cryptographic protocols protect your identity throughout every query.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {FAQS.map((item, index) => {
          const isOpen = openIndex === index
          const Icon = item.icon
          return (
            <div
              key={index}
              className="rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => {
                  setOpenIndex(isOpen ? null : index)
                  cyberAudio.playClick()
                }}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm sm:text-base font-medium text-foreground hover:text-primary transition-colors select-none"
              >
                <span className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 border border-primary/20">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span>{item.q}</span>
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform duration-200 shrink-0 ml-3",
                    isOpen && "rotate-180 text-primary"
                  )}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm leading-relaxed text-muted-foreground border-t border-border/30 bg-background/30 animate-in fade-in duration-200">
                  {item.a}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
