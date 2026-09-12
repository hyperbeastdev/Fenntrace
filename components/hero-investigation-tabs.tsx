/**
 * Fenntrace — Hero Investigation Tabs
 *
 * Allows visitors to toggle seamlessly between:
 * 1. Email Exposure Investigation
 * 2. Password Exposure Check (k-Anonymity)
 *
 * Features a smooth sliding pill animation on tab switches.
 */

"use client"

import { useState } from "react"
import { Mail, KeyRound } from "lucide-react"
import { cn } from "@/lib/utils"
import { EmailCheckForm } from "@/components/email-check-form"
import { PasswordCheckForm } from "@/components/password-check-form"

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
  const [activeTab, setActiveTab] = useState<"email" | "password">("email")

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto lg:mx-0">
      {/* Tab Switcher with Sliding Pill */}
      <div className="relative flex p-1 rounded-xl bg-card/90 border border-border/80 shadow-inner">
        {/* Animated Sliding Pill */}
        <div
          className={cn(
            "absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-primary transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-md shadow-primary/20",
            activeTab === "email" ? "left-1" : "left-[calc(50%+2px)]"
          )}
          aria-hidden="true"
        />

        <button
          type="button"
          onClick={() => setActiveTab("email")}
          className={cn(
            "relative z-10 flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-colors duration-200",
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
          onClick={() => setActiveTab("password")}
          className={cn(
            "relative z-10 flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-colors duration-200",
            activeTab === "password"
              ? "text-primary-foreground font-bold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <KeyRound className="h-3.5 w-3.5" />
          <span>Password Check</span>
          <span
            className={cn(
              "text-[9px] uppercase font-mono px-1.5 py-0.2 rounded border transition-colors",
              activeTab === "password"
                ? "border-primary-foreground/40 bg-black/10 text-primary-foreground"
                : "border-border text-muted-foreground"
            )}
          >
            k-Anon
          </span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="transition-all duration-300">
        {activeTab === "email" ? (
          <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-left-2 duration-200">
            <EmailCheckForm
              onSubmit={onEmailSubmit}
              isSubmitting={isSubmittingEmail}
            />
            {emailError && (
              <p role="alert" className="mt-2 text-xs text-destructive font-medium">
                {emailError}
              </p>
            )}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-2 duration-200">
            <PasswordCheckForm />
          </div>
        )}
      </div>
    </div>
  )
}
