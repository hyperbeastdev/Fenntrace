/**
 * Fenntrace — Hero Investigation Tabs
 *
 * Allows visitors to toggle seamlessly between:
 * 1. Email Exposure Investigation
 * 2. Password Exposure Check (k-Anonymity)
 * 3. Company Domain Exposure Audit (Enterprise)
 *
 * Features smooth sliding pill animation, sound effects, and zero-leak guarantees.
 */

"use client"

import { useState } from "react"
import { Mail, KeyRound, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { EmailCheckForm } from "@/components/email-check-form"
import { PasswordCheckForm } from "@/components/password-check-form"
import { DomainCheckForm } from "@/components/domain-check-form"
import { cyberAudio } from "@/components/ui/cyber-audio"

interface HeroInvestigationTabsProps {
  onEmailSubmit: (email: string) => void
  isSubmittingEmail: boolean
  emailError?: string
}

export function HeroInvestigationTabs({
  onEmailSubmit,
  isSubmittingEmail,
  emailError,
}: HeroInvestigationTabsProps) {
  const [activeTab, setActiveTab] = useState<"email" | "password" | "domain">("email")

  const handleTabChange = (tab: "email" | "password" | "domain") => {
    setActiveTab(tab)
    cyberAudio.playClick()
  }

  return (
    <div className="flex flex-col gap-5 w-full max-w-lg mx-auto lg:mx-0">
      {/* Tab Switcher with 3-way Sliding Pill */}
      <div className="relative flex p-1 rounded-xl bg-card/90 border border-border/80 shadow-inner">
        {/* Animated Sliding Pill */}
        <div
          className={cn(
            "absolute top-1 bottom-1 w-[calc(33.333%-4px)] rounded-lg bg-primary transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-md shadow-primary/20",
            activeTab === "email"
              ? "left-1"
              : activeTab === "password"
              ? "left-[calc(33.333%+2px)]"
              : "left-[calc(66.666%+3px)]"
          )}
          aria-hidden="true"
        />

        <button
          type="button"
          onClick={() => handleTabChange("email")}
          className={cn(
            "relative z-10 flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-colors duration-200",
            activeTab === "email"
              ? "text-primary-foreground font-bold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Mail className="h-3.5 w-3.5" />
          <span>Email Check</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("password")}
          className={cn(
            "relative z-10 flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-colors duration-200",
            activeTab === "password"
              ? "text-primary-foreground font-bold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <KeyRound className="h-3.5 w-3.5" />
          <span>Password</span>
          <span
            className={cn(
              "text-[8.5px] uppercase font-mono px-1 py-0.2 rounded border transition-colors hidden sm:inline-block",
              activeTab === "password"
                ? "border-primary-foreground/40 bg-black/10 text-primary-foreground"
                : "border-border text-muted-foreground"
            )}
          >
            k-Anon
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("domain")}
          className={cn(
            "relative z-10 flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-colors duration-200",
            activeTab === "domain"
              ? "text-primary-foreground font-bold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Building2 className="h-3.5 w-3.5" />
          <span>Domain</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="transition-all duration-300">
        {activeTab === "email" && (
          <div className="flex flex-col gap-2 animate-in fade-in duration-200">
            <EmailCheckForm
              onSubmit={onEmailSubmit}
              isSubmitting={isSubmittingEmail}
              showDemoChips={true}
            />
            {emailError && (
              <p role="alert" className="mt-2 text-xs text-destructive font-medium">
                {emailError}
              </p>
            )}
          </div>
        )}

        {activeTab === "password" && (
          <div className="animate-in fade-in duration-200">
            <PasswordCheckForm />
          </div>
        )}

        {activeTab === "domain" && (
          <div className="animate-in fade-in duration-200">
            <DomainCheckForm />
          </div>
        )}
      </div>
    </div>
  )
}
