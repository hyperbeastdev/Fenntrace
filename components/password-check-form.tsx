/**
 * Fenntrace — Password Exposure Check Form (k-Anonymity)
 *
 * Checks if a password has been compromised in known data breaches
 * using the mathematical guarantee of k-Anonymity.
 *
 * 1. Password is hashed locally with SHA-1 in the browser.
 * 2. Only the first 5 characters (e.g., "5BAA6") are sent to /api/check-password.
 * 3. The server queries HIBP range API and returns candidate suffixes.
 * 4. The match occurs purely on the client. The plain password NEVER leaves the device.
 */

"use client"

import { useState, useTransition, useCallback, type ChangeEvent } from "react"
import { Eye, EyeOff, KeyRound, ShieldAlert, ShieldCheck, HelpCircle, ArrowRight, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getKAnonymityParts, evaluatePasswordStrength } from "@/lib/client/crypto"

interface PasswordCheckResult {
  found: boolean
  occurrences: number
  prefix: string
  suffix: string
}

export function PasswordCheckForm({ className }: { className?: string }) {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [result, setResult] = useState<PasswordCheckResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showExplainer, setShowExplainer] = useState(false)
  const [isPending, startTransition] = useTransition()

  const strength = evaluatePasswordStrength(password)

  const handleCheck = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!password) return

      setError(null)
      setResult(null)

      startTransition(async () => {
        try {
          // 1. Client-side hashing with Web Crypto API
          const { fullHash: _fullHash, prefix, suffix } = await getKAnonymityParts(password)

          // 2. Transmit ONLY 5-char prefix & 35-char suffix
          const response = await fetch("/api/check-password", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ hashPrefix: prefix, hashSuffix: suffix }),
          })

          if (response.status === 429) {
            setError("Rate limit reached. Please wait a few seconds before trying again.")
            return
          }

          if (!response.ok) {
            const data = await response.json().catch(() => ({}))
            setError(data.error || "Unable to complete password check. Please try again.")
            return
          }

          const data = await response.json()
          setResult({
            found: data.found ?? false,
            occurrences: data.occurrences ?? 0,
            prefix,
            suffix,
          })
        } catch (err) {
          console.error("Password check error:", err)
          setError("Network error while checking password. Please check your connection.")
        }
      })
    },
    [password]
  )

  const handleClear = () => {
    setPassword("")
    setResult(null)
    setError(null)
  }

  return (
    <div className={cn("flex flex-col gap-6 w-full max-w-lg mx-auto", className)}>
      <form onSubmit={handleCheck} className="flex flex-col gap-4">
        <div className="relative">
          <div className="relative flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setPassword(e.target.value)
                if (result) setResult(null)
                if (error) setError(null)
              }}
              placeholder="Enter password to check exposure..."
              className="w-full pr-24 pl-4 h-12 text-sm bg-card border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none font-mono tracking-wide text-foreground"
              autoComplete="off"
              spellCheck={false}
              disabled={isPending}
            />
            <div className="absolute right-2 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-lg focus-visible:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <Button
                type="submit"
                size="sm"
                disabled={!password || isPending}
                className="h-8 rounded-lg px-3 bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
              >
                {isPending ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <ArrowRight className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <div className="mt-2.5 flex flex-col gap-1.5 px-1 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Complexity:</span>
                <span className={cn("font-medium", {
                  "text-ft-danger": strength.score <= 1,
                  "text-ft-caution": strength.score === 2,
                  "text-primary": strength.score === 3,
                  "text-ft-success": strength.score === 4,
                })}>
                  {strength.label}
                </span>
              </div>
              <div className="flex h-1.5 w-full gap-1 overflow-hidden rounded-full bg-secondary">
                {[0, 1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={cn(
                      "h-full flex-1 transition-all duration-300 rounded-full",
                      step <= strength.score ? strength.color : "bg-transparent"
                    )}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {error && (
          <p className="text-xs text-destructive font-medium px-1" role="alert">
            {error}
          </p>
        )}
      </form>

      {/* Result Card */}
      {result && (
        <div
          className={cn(
            "rounded-xl border p-5 animate-in fade-in slide-in-from-bottom-2 duration-300",
            result.found
              ? "border-ft-danger/40 bg-ft-danger-muted/30"
              : "border-ft-success/40 bg-ft-success-muted/30"
          )}
        >
          <div className="flex items-start gap-3.5">
            <div
              className={cn(
                "p-2 rounded-lg shrink-0 mt-0.5",
                result.found ? "bg-ft-danger/10 text-ft-danger" : "bg-ft-success/10 text-ft-success"
              )}
            >
              {result.found ? <ShieldAlert className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
            </div>

            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-foreground">
                {result.found ? "Password found in known breaches" : "No known breach records found"}
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {result.found ? (
                  <>
                    This password has surfaced{" "}
                    <span className="font-semibold text-ft-danger tabular-nums">
                      {result.occurrences.toLocaleString()} times
                    </span>{" "}
                    in public breach datasets. Attackers use automated credential-stuffing tools to test this password across popular websites.
                  </>
                ) : (
                  <>
                    This exact password does not appear in our indexed breach databases. Continue practicing strong, unique passwords for every account.
                  </>
                )}
              </p>

              {result.found && (
                <div className="mt-2 pt-2 border-t border-border/40 flex flex-col gap-1 text-[11px] text-ft-danger font-medium">
                  <span>⚠️ Recommendation: Change this password everywhere it is used.</span>
                </div>
              )}

              {/* Cryptographic verification badge */}
              <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground bg-background/60 rounded-md px-2.5 py-1.5 border border-border/40 font-mono">
                <span>k-Anonymity Prefix: <strong className="text-primary">{result.prefix}</strong></span>
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-muted-foreground hover:text-foreground underline font-sans"
                >
                  Clear check
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* k-Anonymity Explainer Collapsible */}
      <div className="border border-border/40 rounded-xl bg-card/40 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowExplainer(!showExplainer)}
          className="w-full flex items-center justify-between p-3.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium text-left"
        >
          <span className="flex items-center gap-2">
            <KeyRound className="h-3.5 w-3.5 text-primary" />
            How is checking a password safe here? (k-Anonymity)
          </span>
          <HelpCircle className="h-3.5 w-3.5 opacity-70" />
        </button>

        {showExplainer && (
          <div className="p-4 pt-1 border-t border-border/30 text-xs leading-relaxed text-muted-foreground flex flex-col gap-3 bg-background/40">
            <p>
              Fenntrace uses <strong className="text-foreground">k-Anonymity</strong>, a mathematical privacy standard:
            </p>
            <div className="grid gap-2 text-[11px] font-mono">
              <div className="p-2 rounded bg-card border border-border/60">
                1. <strong>Local SHA-1 Hashing:</strong> Your password is converted to a 40-character hash directly inside your browser.
              </div>
              <div className="p-2 rounded bg-card border border-border/60">
                2. <strong>Prefix Transmission:</strong> Only the first 5 characters (e.g. <code>5BAA6</code>) are sent over HTTPS.
              </div>
              <div className="p-2 rounded bg-card border border-border/60">
                3. <strong>Client-Side Matching:</strong> The server returns hundreds of candidate hashes that share that prefix. Your browser tests for matches locally.
              </div>
            </div>
            <p className="text-[11px] text-ft-text-muted">
              Because trillions of combinations share the same 5 characters, neither Fenntrace nor any network snooper can ever reverse or reconstruct your original password.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
