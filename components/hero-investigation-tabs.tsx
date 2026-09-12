/**
 * Fenntrace — Hero Investigation Tabs
 *
 * Allows visitors to toggle seamlessly between:
 * 1. Email Exposure Investigation
 * 2. Password Exposure Check (k-Anonymity)
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
      {/* Tab Switcher */}
      <div className="flex p-1 rounded-xl bg-card/90 border border-border/80 shadow-inner">
        <button
          type="button"
          onClick={() => setActiveTab("email")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200",
            activeTab === "email"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
          )}
        >
          <Mail className="h-3.5 w-3.5" />
          <span>Email Check</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("password")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200",
            activeTab === "password"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
          )}
        >
          <KeyRound className="h-3.5 w-3.5" />
          <span>Password Check</span>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded border border-current opacity-80">
            k-Anon
          </span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "email" ? (
        <div className="flex flex-col gap-2">
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
        <PasswordCheckForm />
      )}
    </div>
  )
}
