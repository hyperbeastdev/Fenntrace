/**
 * Fenntrace — Email Check Form
 *
 * The hero interaction — email input + CTA.
 * Handles empty, focused, invalid, valid/ready, and submitting states.
 *
 * Uses shadcn Input + Button primitives underneath,
 * customized into the Fenntrace visual language.
 */

"use client"

import { useCallback, useRef, useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { isValidEmail } from "@/domain/helpers"

interface EmailCheckFormProps {
  onSubmit: (email: string) => void
  isSubmitting?: boolean
  className?: string
}

export function EmailCheckForm({
  onSubmit,
  isSubmitting = false,
  className,
}: EmailCheckFormProps) {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [touched, setTouched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const validate = useCallback((value: string): string | null => {
    if (!value.trim()) return null // Don't show error on empty until submit
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
      onSubmit(trimmed)
    },
    [email, onSubmit, validate]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setEmail(value)

      // Clear error as user types if previously touched
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
                "h-12 w-full rounded-lg border bg-card px-4 text-[15px] text-foreground",
                "placeholder:text-muted-foreground/60",
                "outline-none transition-colors duration-150",
                "focus:border-primary focus:ring-2 focus:ring-primary/25",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "sm:rounded-r-none sm:border-r-0",
                hasError
                  ? "border-destructive focus:border-destructive focus:ring-destructive/25"
                  : "border-border"
              )}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className={cn(
              "h-12 shrink-0 rounded-lg px-6 text-[15px] font-medium",
              "sm:rounded-l-none",
              "bg-primary text-primary-foreground",
              "hover:bg-primary/85",
              "transition-colors duration-150"
            )}
          >
            {isSubmitting ? "Checking…" : "Check exposure"}
          </Button>
        </div>

        {/* Inline error — accessible, connected to input */}
        {hasError && (
          <p
            id={errorId}
            role="alert"
            className="text-[13px] leading-tight text-destructive"
          >
            {error}
          </p>
        )}
      </div>
    </form>
  )
}
