/**
 * Fenntrace — Email Check Form
 *
 * The hero interaction — email input + CTA with quick 1-click Demo Chips.
 * Handles empty, focused, invalid, valid/ready, and submitting states.
 */

"use client"

import { useCallback, useRef, useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { cyberAudio } from "@/components/ui/cyber-audio"
import { cn } from "@/lib/utils"
import { isValidEmail } from "@/domain/helpers"

interface EmailCheckFormProps {
  onSubmit: (email: string) => void
  isSubmitting?: boolean
  className?: string
  showDemoChips?: boolean
}

const DEMO_EMAILS = [
  { email: "alex@example.com", label: "4 Breaches" },
  { email: "clean.user@example.com", label: "0 Breaches" },
  { email: "sarah.dev@corporate.io", label: "Corporate" },
]

export function EmailCheckForm({
  onSubmit,
  isSubmitting = false,
  className,
  showDemoChips = true,
}: EmailCheckFormProps) {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [touched, setTouched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const validate = useCallback((value: string): string | null => {
    if (!value.trim()) return null
    if (!isValidEmail(value.trim())) return "Enter a valid email address"
    return null
  }, [])

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      const trimmed = email.trim()

      if (!trimmed) {
        setError("Enter a valid email address")
        setTouched(true)
        inputRef.current?.focus()
        return
      }

      const validationError = validate(trimmed)
      if (validationError) {
        setError(validationError)
        setTouched(true)
        inputRef.current?.focus()
        return
      }

      setError(null)
      cyberAudio.playSonarPing()
      onSubmit(trimmed)
    },
    [email, onSubmit, validate]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setEmail(value)

      if (touched && error) {
        const newError = validate(value)
        setError(newError)
      }
    },
    [touched, error, validate]
  )

  const handleBlur = useCallback(() => {
    if (email.trim()) {
      setTouched(true)
      setError(validate(email))
    }
  }, [email, validate])

  const handleDemoClick = (demoEmail: string) => {
    setEmail(demoEmail)
    setError(null)
    cyberAudio.playClick()
    onSubmit(demoEmail)
  }

  const hasError = touched && !!error
  const inputId = "email-check-input"
  const errorId = "email-check-error"

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={cn("w-full max-w-md", className)}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>

        <div className="flex flex-col gap-1.5 sm:flex-row sm:gap-0">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              id={inputId}
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="Enter your email address"
              value={email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              aria-invalid={hasError || undefined}
              aria-describedby={hasError ? errorId : undefined}
              className={cn(
                "h-12 w-full rounded-lg border bg-card pl-4 pr-9 text-[15px] text-foreground",
                "placeholder:text-muted-foreground/60 font-mono",
                "outline-none transition-colors duration-150",
                "focus:border-primary focus:ring-2 focus:ring-primary/25",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "sm:rounded-r-none sm:border-r-0",
                hasError
                  ? "border-destructive focus:border-destructive focus:ring-destructive/25"
                  : "border-border"
              )}
            />
            {!email && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:flex items-center">
                <kbd className="text-[11px] font-mono text-muted-foreground/60 border border-border/60 bg-background/50 px-1.5 py-0.5 rounded">
                  /
                </kbd>
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className={cn(
              "h-12 shrink-0 rounded-lg px-6 text-[15px] font-medium",
              "sm:rounded-l-none",
              "bg-primary text-primary-foreground font-semibold",
              "hover:bg-primary/85",
              "transition-colors duration-150 shadow-md shadow-primary/20"
            )}
          >
            {isSubmitting ? "Scanning…" : "Check Exposure"}
          </Button>
        </div>

        {/* Inline error */}
        {hasError && (
          <p
            id={errorId}
            role="alert"
            className="text-[13px] leading-tight text-destructive"
          >
            {error}
          </p>
        )}

        {/* 1-Click Quick Demo Inboxes */}
        {showDemoChips && !isSubmitting && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 text-xs">
            <span className="text-muted-foreground flex items-center gap-1 text-[11px] font-mono">
              <Sparkles className="h-3 w-3 text-primary" /> Try Demo:
            </span>
            {DEMO_EMAILS.map((item) => (
              <button
                key={item.email}
                type="button"
                onClick={() => handleDemoClick(item.email)}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-border/60 bg-secondary/40 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-secondary transition-all font-mono text-[11px]"
              >
                <span>{item.email}</span>
                <span className="text-[9px] px-1 rounded bg-background/60 text-primary font-semibold">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </form>
  )
}
