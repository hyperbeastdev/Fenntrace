/**
 * Fenntrace — Password Generator & Entropy Lab
 *
 * Cryptographically secure pseudo-random number generator (CSPRNG)
 * using the browser Web Crypto API.
 */

"use client"

import { useState, useMemo } from "react"
import { KeyRound, RefreshCw, Copy, Check, ShieldCheck, Sparkles } from "lucide-react"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { Button } from "@/components/ui/button"
import { cyberAudio } from "@/components/ui/cyber-audio"
import { cn } from "@/lib/utils"

export function PasswordGeneratorCard({ className }: { className?: string }) {
  const [length, setLength] = useState(20)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [generatedPassword, setGeneratedPassword] = useState("")
  const [copied, setCopied] = useState(false)

  const generate = () => {
    const letters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
    const numbers = "23456789"
    const symbols = "!@#$%^&*()-_=+[]{}|;:,.<>?"

    let charset = letters + numbers
    if (includeSymbols) charset += symbols

    const array = new Uint32Array(length)
    crypto.getRandomValues(array)
    let result = ""
    for (let i = 0; i < length; i++) {
      result += charset[array[i] % charset.length]
    }

    setGeneratedPassword(result)
  }

  useMemo(() => {
    if (!generatedPassword && typeof window !== "undefined") generate()
  }, [])

  const handleCopy = () => {
    if (!generatedPassword) return
    navigator.clipboard.writeText(generatedPassword)
    cyberAudio.playSuccessChime()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const entropyBits = Math.round(length * (includeSymbols ? 6.55 : 5.95))

  return (
    <section id="password-lab" className={cn("py-16 sm:py-20 border-t border-border/30", className)}>
      <div className="mb-10 flex flex-col gap-2">
        <span className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase font-mono">
          Proactive Defense
        </span>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          High-Entropy Password Generator
        </h2>
        <p className="text-sm text-muted-foreground max-w-xl">
          Generate cryptographically strong, non-deterministic credentials directly on your machine with zero server communication.
        </p>
      </div>

      <SpotlightCard className="p-6 sm:p-8 bg-card/80 border border-border/80 shadow-xl">
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5 font-mono">
              <KeyRound className="h-4 w-4 text-primary" /> CSPRNG Entropy: ~{entropyBits} bits
            </span>
            <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
              ● Quantum-Resistant Entropy
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                readOnly
                value={generatedPassword}
                className="w-full h-12 rounded-lg border border-border bg-background px-4 text-sm text-foreground font-mono tracking-wider font-semibold select-all"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  generate()
                  cyberAudio.playClick()
                }}
                className="h-12 px-4 border-border shrink-0"
                title="Regenerate password"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                onClick={handleCopy}
                className="h-12 flex-1 sm:flex-initial px-6 gap-2 font-semibold bg-primary text-primary-foreground hover:bg-primary/85"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? "Copied!" : "Copy Credential"}</span>
              </Button>
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-border/40 text-xs">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground font-mono">Length:</span>
                <span className="font-bold text-foreground font-mono">{length} characters</span>
              </div>
              <input
                type="range"
                min={14}
                max={36}
                value={length}
                onChange={(e) => {
                  setLength(Number(e.target.value))
                  generate()
                }}
                className="w-full accent-primary cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 self-center">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => {
                    setIncludeSymbols(e.target.checked)
                    generate()
                  }}
                  className="h-4 w-4 rounded border-border accent-primary"
                />
                <span className="text-foreground font-medium">Include Special Symbols (!@#$%)</span>
              </label>
            </div>
          </div>
        </div>
      </SpotlightCard>
    </section>
  )
}
