/**
 * Fenntrace — Design & Feature Preview Lab
 *
 * Localhost preview lab demonstrating proposed enhancements:
 *
 * [A] ADVANCED ANIMATIONS & MICRO-INTERACTIONS:
 * 1. 3D Holographic Parallax Tilt Cards (Dynamic Glare & Physics)
 * 2. Web Audio API Cyber Soundboard (Synthesized Audio Feedback)
 * 3. Matrix Digital Hex Rain Canvas Stream
 * 4. Global Telemetry Mesh & Threat Arcs Visualizer
 * 5. Magnetic Physics CTA Buttons
 *
 * [B] FUNCTIONAL UX & SECURITY FEATURES:
 * 6. Global Intelligence Stats Ribbon
 * 7. 1-Click "Demo Try" Inboxes
 * 8. High-Entropy Password Generator & Complexity Lab
 * 9. Company Domain Exposure Lookup (Enterprise Prototype)
 * 10. Interactive Security Architecture FAQ Accordion
 *
 * Accessible locally at: http://localhost:3000/lab
 */

"use client"

import { useState, useTransition, useMemo } from "react"
import Link from "next/link"
import {
  Sparkles,
  ArrowLeft,
  KeyRound,
  RefreshCw,
  Copy,
  Check,
  Building2,
  HelpCircle,
  ChevronDown,
  Shield,
  Layers,
  Search,
  Volume2,
  VolumeX,
  Radio,
  Zap,
  Activity,
  Cpu,
  ShieldCheck,
  Waves,
  Fingerprint,
  Lock,
  Terminal,
  MousePointerClick,
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button, buttonVariants } from "@/components/ui/button"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { DecryptText } from "@/components/ui/decrypt-text"
import { TiltCard } from "@/components/ui/tilt-card"
import { MatrixRain } from "@/components/ui/matrix-rain"
import { CyberNodes } from "@/components/ui/cyber-nodes"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { cyberAudio } from "@/components/ui/cyber-audio"
import { cn } from "@/lib/utils"

export default function FeaturePreviewLabPage() {
  const [activeTab, setActiveTab] = useState<"animations" | "features">("animations")

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          {/* Lab Header */}
          <div className="flex flex-col gap-4 mb-8 border-b border-border/40 pb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Main Application</span>
            </Link>

            <div className="flex items-center gap-2 mt-2">
              <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
              <span className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase font-mono">
                <DecryptText text="LOCAL_PREVIEW_SANDBOX" />
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  Experimental Design & Animation Lab
                </h1>
                <p className="max-w-2xl text-sm text-muted-foreground leading-relaxed mt-1">
                  Interactive prototypes of suggested cutting-edge animations, sound effects, and UI components running in isolation on localhost.
                </p>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex items-center p-1 rounded-xl bg-card border border-border/80 self-start sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("animations")
                    cyberAudio.playClick()
                  }}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium font-mono transition-all",
                    activeTab === "animations"
                      ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Zap className="h-3.5 w-3.5" />
                  <span>FX & Animations</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("features")
                    cyberAudio.playClick()
                  }}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium font-mono transition-all",
                    activeTab === "features"
                      ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>Feature Prototypes</span>
                </button>
              </div>
            </div>
          </div>

          {/* TAB 1: ANIMATIONS & MICRO-INTERACTIONS */}
          {activeTab === "animations" && (
            <div className="flex flex-col gap-16 animate-in fade-in duration-300">
              {/* 1. 3D Holographic Tilt Card */}
              <section className="flex flex-col gap-4">
                <SectionHeader
                  badge="FX · 01"
                  title="3D Holographic Parallax Tilt Card"
                  description="Mouse-tracking 3D perspective with dynamic specular holographic glare overlay. Move your cursor over the card."
                />
                <TiltCardPreview />
              </section>

              {/* 2. Cyber Soundboard Synthesizer */}
              <section className="flex flex-col gap-4">
                <SectionHeader
                  badge="FX · 02"
                  title="Web Audio API Cyber Sound Synthesizer"
                  description="Zero-asset, ultra-lightweight micro-sound design synthesized in real-time in the browser for tactile user feedback."
                />
                <SoundboardPreview />
              </section>

              {/* 3. Global Mesh Threat Arcs */}
              <section className="flex flex-col gap-4">
                <SectionHeader
                  badge="FX · 03"
                  title="Interactive Global Telemetry & Threat Arcs"
                  description="Live SVG vector arcs and pulsing nodes mapping synthetic dark web intelligence packets."
                />
                <CyberNodes />
              </section>

              {/* 4. Matrix Digital Hex Rain */}
              <section className="flex flex-col gap-4">
                <SectionHeader
                  badge="FX · 04"
                  title="Matrix Digital Hex Stream Canvas"
                  description="High-performance HTML5 Canvas matrix rain cascade with luminous head glyphs."
                />
                <MatrixStreamPreview />
              </section>

              {/* 5. Magnetic Physics CTA */}
              <section className="flex flex-col gap-4">
                <SectionHeader
                  badge="FX · 05"
                  title="Magnetic Physics Buttons"
                  description="Buttons with spring dampening physics that pull towards the cursor when hovered."
                />
                <MagneticButtonPreview />
              </section>
            </div>
          )}

          {/* TAB 2: FUNCTIONAL UI & FEATURE PROTOTYPES */}
          {activeTab === "features" && (
            <div className="flex flex-col gap-16 animate-in fade-in duration-300">
              {/* 1. STATS RIBBON */}
              <section className="flex flex-col gap-4">
                <SectionHeader
                  badge="FEATURE · 01"
                  title="Global Intelligence Stats Ribbon"
                  description="Hero ribbon displaying live telemetry and cryptographic privacy metrics."
                />
                <StatsRibbonPreview />
              </section>

              {/* 2. DEMO PILLS */}
              <section className="flex flex-col gap-4">
                <SectionHeader
                  badge="FEATURE · 02"
                  title="1-Click 'Demo Try' Inboxes"
                  description="Allows instant testing without forcing users to type custom email addresses."
                />
                <DemoPillsPreview />
              </section>

              {/* 3. PASSWORD GENERATOR */}
              <section className="flex flex-col gap-4">
                <SectionHeader
                  badge="FEATURE · 03"
                  title="High-Entropy Password Generator & Lab"
                  description="Generates cryptographically random passwords with immediate k-Anonymity verification."
                />
                <PasswordGeneratorPreview />
              </section>

              {/* 4. DOMAIN LOOKUP */}
              <section className="flex flex-col gap-4">
                <SectionHeader
                  badge="FEATURE · 04"
                  title="Company Domain Exposure Lookup"
                  description="Aggregates breach incidents affecting corporate domains without exposing individual mailboxes."
                />
                <DomainLookupPreview />
              </section>

              {/* 5. FAQ ACCORDION */}
              <section className="flex flex-col gap-4">
                <SectionHeader
                  badge="FEATURE · 05"
                  title="Interactive Security Architecture FAQ"
                  description="Comprehensive expandable accordion addressing zero-data retention and k-anonymity math."
                />
                <FaqAccordionPreview />
              </section>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

function SectionHeader({
  badge,
  title,
  description,
}: {
  badge: string
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-mono uppercase tracking-wider text-primary font-semibold">
        {badge}
      </span>
      <h2 className="text-xl font-semibold text-foreground tracking-tight">{title}</h2>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// FX 1. 3D Holographic Tilt Card Preview
// ---------------------------------------------------------------------------
function TiltCardPreview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <TiltCard className="p-6 border-border/80 bg-gradient-to-br from-card via-card/90 to-card/60">
        <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-semibold text-foreground tracking-wider">
              FENNTRACE SENTINEL PASS
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
            CLASS 1 ENCRYPTION
          </span>
        </div>

        <div className="flex items-center gap-4 my-4">
          <div className="h-16 w-16 rounded-2xl bg-secondary/80 border border-border flex items-center justify-center text-primary shadow-inner">
            <Fingerprint className="h-9 w-9 text-primary animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground font-mono">AUTHORIZED OPERATOR</span>
            <span className="text-base font-semibold text-foreground">Zero-Trust Terminal</span>
            <span className="text-xs font-mono text-emerald-400 mt-1">● ID: FENN-9942-X7</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs font-mono text-muted-foreground">
          <span>SHA-256 k-ANON</span>
          <span className="text-foreground font-bold">100% EPHEMERAL</span>
        </div>
      </TiltCard>

      <TiltCard className="p-6 border-border/80 bg-gradient-to-br from-card via-card/90 to-card/60">
        <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-xs font-mono font-semibold text-foreground tracking-wider">
              ZERO-KNOWLEDGE VAULT
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            ACTIVE
          </span>
        </div>

        <div className="space-y-3 font-mono text-xs">
          <div className="flex justify-between p-2.5 rounded-lg bg-background/60 border border-border/50">
            <span className="text-muted-foreground">k-Anon Truncation</span>
            <span className="text-primary font-bold">5-Hex Prefix</span>
          </div>
          <div className="flex justify-between p-2.5 rounded-lg bg-background/60 border border-border/50">
            <span className="text-muted-foreground">Query Persistence</span>
            <span className="text-emerald-400 font-bold">0ms / In-Memory</span>
          </div>
          <div className="flex justify-between p-2.5 rounded-lg bg-background/60 border border-border/50">
            <span className="text-muted-foreground">Global Registry</span>
            <span className="text-foreground font-bold">14.8B+ Records</span>
          </div>
        </div>
      </TiltCard>
    </div>
  )
}

// ---------------------------------------------------------------------------
// FX 2. Soundboard Preview (Web Audio API)
// ---------------------------------------------------------------------------
function SoundboardPreview() {
  const [soundEnabled, setSoundEnabled] = useState(true)

  const toggleSound = () => {
    const newState = !soundEnabled
    setSoundEnabled(newState)
    cyberAudio.enabled = newState
    if (newState) {
      cyberAudio.playClick()
    }
  }

  return (
    <SpotlightCard className="p-6 flex flex-col gap-5 bg-card/80 border border-border/80">
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-2">
          <Waves className="h-4 w-4 text-primary" />
          <span className="text-xs font-mono font-semibold text-foreground">
            TACTICAL AUDIO SYNTHESIZER (WEB AUDIO API)
          </span>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={toggleSound}
          className={cn(
            "h-8 px-3 text-xs gap-1.5 font-mono",
            soundEnabled ? "border-primary/50 text-primary" : "border-border text-muted-foreground"
          )}
        >
          {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
          <span>{soundEnabled ? "Audio Enabled" : "Muted"}</span>
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => cyberAudio.playClick(900)}
          className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/80 bg-secondary/40 hover:bg-primary/10 hover:border-primary/50 transition-all text-center group"
        >
          <MousePointerClick className="h-5 w-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-mono font-semibold text-foreground">UI Click</span>
          <span className="text-[10px] text-muted-foreground font-mono mt-0.5">800Hz Pitch Drop</span>
        </button>

        <button
          type="button"
          onClick={() => cyberAudio.playSonarPing()}
          className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/80 bg-secondary/40 hover:bg-primary/10 hover:border-primary/50 transition-all text-center group"
        >
          <Radio className="h-5 w-5 text-sky-400 mb-2 group-hover:scale-110 transition-transform animate-pulse" />
          <span className="text-xs font-mono font-semibold text-foreground">Sonar Sweep</span>
          <span className="text-[10px] text-muted-foreground font-mono mt-0.5">1200Hz Resonance</span>
        </button>

        <button
          type="button"
          onClick={() => cyberAudio.playSuccessChime()}
          className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/80 bg-secondary/40 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all text-center group"
        >
          <ShieldCheck className="h-5 w-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-mono font-semibold text-foreground">Clean / Success</span>
          <span className="text-[10px] text-muted-foreground font-mono mt-0.5">4-Chord Harmonic</span>
        </button>

        <button
          type="button"
          onClick={() => cyberAudio.playAlert()}
          className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/80 bg-secondary/40 hover:bg-rose-500/10 hover:border-rose-500/50 transition-all text-center group"
        >
          <Zap className="h-5 w-5 text-rose-400 mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-mono font-semibold text-foreground">Threat Alert</span>
          <span className="text-[10px] text-muted-foreground font-mono mt-0.5">Sawtooth Ramp</span>
        </button>
      </div>

      <p className="text-[11px] font-mono text-muted-foreground">
        Synthesizes audio through mathematical oscillators in 0.04s without requiring MP3 network requests.
      </p>
    </SpotlightCard>
  )
}

// ---------------------------------------------------------------------------
// FX 4. Matrix Rain Stream Preview
// ---------------------------------------------------------------------------
function MatrixStreamPreview() {
  const [speed, setSpeed] = useState(1)
  const [colorScheme, setColorScheme] = useState<"emerald" | "cyan">("emerald")

  return (
    <div className="relative h-64 sm:h-72 w-full rounded-2xl border border-border/80 overflow-hidden bg-[#070a13]">
      <MatrixRain
        speed={speed}
        color={colorScheme === "emerald" ? "#3fb950" : "#38bdf8"}
        headColor={colorScheme === "emerald" ? "#7ee787" : "#a5f3fc"}
        opacity={0.8}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />

      {/* Floating Control Overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-card/80 border border-border/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-emerald-400" />
          <span className="text-xs font-mono font-semibold text-foreground">CANVAS_HEX_CASCADE</span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">Speed:</span>
            <button
              onClick={() => {
                setSpeed((s) => (s === 1 ? 2 : 1))
                cyberAudio.playClick()
              }}
              className="px-2 py-0.5 rounded bg-secondary text-foreground hover:bg-primary/20 border border-border"
            >
              {speed}x
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">Palette:</span>
            <button
              onClick={() => {
                setColorScheme((c) => (c === "emerald" ? "cyan" : "emerald"))
                cyberAudio.playClick()
              }}
              className="px-2 py-0.5 rounded bg-secondary text-foreground hover:bg-primary/20 border border-border capitalize"
            >
              {colorScheme}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// FX 5. Magnetic Physics Buttons Preview
// ---------------------------------------------------------------------------
function MagneticButtonPreview() {
  return (
    <SpotlightCard className="p-8 flex flex-col items-center justify-center gap-6 bg-card/80 border border-border/80 text-center">
      <div className="flex flex-col gap-1 max-w-md">
        <h4 className="text-sm font-semibold text-foreground">Interactive Magnetic Surface</h4>
        <p className="text-xs text-muted-foreground">
          Hover near the buttons below. The elements fluidly magnetically pull towards the pointer with smooth spring dampening physics.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <MagneticButton
          onClick={() => cyberAudio.playClick(900)}
          className="bg-primary text-primary-foreground font-semibold text-xs shadow-lg shadow-primary/20 hover:shadow-primary/40 border border-primary/40"
        >
          <Zap className="h-3.5 w-3.5 mr-2" />
          <span>Magnetic Primary Action</span>
        </MagneticButton>

        <MagneticButton
          onClick={() => cyberAudio.playSonarPing()}
          className="bg-secondary text-foreground font-semibold text-xs border border-border hover:border-primary/50"
        >
          <Radio className="h-3.5 w-3.5 mr-2 text-primary" />
          <span>Magnetic Radar Sweep</span>
        </MagneticButton>

        <MagneticButton
          onClick={() => cyberAudio.playSuccessChime()}
          className="bg-emerald-500/10 text-emerald-400 font-semibold text-xs border border-emerald-500/30 hover:bg-emerald-500/20"
        >
          <ShieldCheck className="h-3.5 w-3.5 mr-2" />
          <span>Verify Integrity</span>
        </MagneticButton>
      </div>
    </SpotlightCard>
  )
}

// ---------------------------------------------------------------------------
// FEATURE 1. Stats Ribbon Component
// ---------------------------------------------------------------------------
function StatsRibbonPreview() {
  const stats = [
    { value: "14.8B+", label: "Records Indexed", sub: "Global Breach Registry" },
    { value: "100%", label: "Zero Retention", sub: "Ephemeral Sessions" },
    { value: "< 45ms", label: "Query Latency", sub: "Sub-second Pipeline" },
    { value: "k-Anon", label: "Privacy Standard", sub: "Cryptographic SHA-1" },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((item, index) => (
        <SpotlightCard
          key={index}
          className="p-5 flex flex-col gap-1 bg-card/80 border border-border/80"
        >
          <span className="text-2xl font-bold tracking-tight text-foreground font-mono tabular-nums">
            {item.value}
          </span>
          <span className="text-xs font-semibold text-foreground">{item.label}</span>
          <span className="text-[10px] text-muted-foreground font-mono">{item.sub}</span>
        </SpotlightCard>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// FEATURE 2. 1-Click Demo Inboxes
// ---------------------------------------------------------------------------
function DemoPillsPreview() {
  const [selectedEmail, setSelectedEmail] = useState("alex@example.com")
  const [copied, setCopied] = useState(false)

  const DEMO_EMAILS = [
    { email: "alex@example.com", label: "Multiple Breaches", count: "4 Breaches" },
    { email: "clean.user@example.com", label: "Clean / 0 Leaks", count: "0 Breaches" },
    { email: "sarah.dev@corporate.io", label: "High Risk Incident", count: "2 Breaches" },
  ]

  const handleSelect = (email: string) => {
    setSelectedEmail(email)
    navigator.clipboard.writeText(email)
    cyberAudio.playClick()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <SpotlightCard className="p-6 flex flex-col gap-4 bg-card/80 border border-border/80">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-foreground">Interactive Search Bar with Quick Chips:</label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              readOnly
              value={selectedEmail}
              className="w-full h-11 rounded-lg border border-border bg-background/80 px-3.5 text-sm text-foreground font-mono"
            />
          </div>
          <Button
            size="sm"
            onClick={() => handleSelect(selectedEmail)}
            className="h-11 px-4 gap-1.5"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? "Copied" : "Use Email"}</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/40">
        <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-primary" /> Try Demo Accounts:
        </span>
        {DEMO_EMAILS.map((item) => (
          <button
            key={item.email}
            type="button"
            onClick={() => handleSelect(item.email)}
            className={cn(
              "flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs border transition-all",
              selectedEmail === item.email
                ? "border-primary bg-primary/10 text-primary font-semibold"
                : "border-border/60 bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            <span>{item.email}</span>
            <span className="text-[10px] font-mono px-1 rounded bg-background/60 opacity-80">
              {item.count}
            </span>
          </button>
        ))}
      </div>
    </SpotlightCard>
  )
}

// ---------------------------------------------------------------------------
// FEATURE 3. Password Generator & Lab
// ---------------------------------------------------------------------------
function PasswordGeneratorPreview() {
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

    // Cryptographically secure RNG using Web Crypto API
    const array = new Uint32Array(length)
    crypto.getRandomValues(array)
    let result = ""
    for (let i = 0; i < length; i++) {
      result += charset[array[i] % charset.length]
    }

    setGeneratedPassword(result)
  }

  useMemo(() => {
    if (!generatedPassword) generate()
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPassword)
    cyberAudio.playSuccessChime()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <SpotlightCard className="p-6 flex flex-col gap-6 bg-card/80 border border-border/80">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground flex items-center gap-1.5 font-mono">
            <KeyRound className="h-4 w-4 text-primary" /> Generated Output (Entropy: ~{Math.round(length * 5.8)} bits):
          </span>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-ft-success-muted text-ft-success border border-ft-success/30 font-semibold">
            High Entropy
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              readOnly
              value={generatedPassword}
              className="w-full h-12 rounded-lg border border-border bg-background px-4 text-sm text-foreground font-mono tracking-wider font-semibold"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              generate()
              cyberAudio.playClick()
            }}
            className="h-12 px-3.5 border-border"
            title="Regenerate password"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            onClick={handleCopy}
            className="h-12 px-4 gap-1.5 font-semibold"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-border/40 text-xs">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Length:</span>
            <span className="font-bold text-foreground font-mono">{length} characters</span>
          </div>
          <input
            type="range"
            min={12}
            max={32}
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
            <span className="text-foreground">Include Special Symbols (!@#$)</span>
          </label>
        </div>
      </div>
    </SpotlightCard>
  )
}

// ---------------------------------------------------------------------------
// FEATURE 4. Domain Lookup Component
// ---------------------------------------------------------------------------
function DomainLookupPreview() {
  const [domain, setDomain] = useState("adobe.com")
  const [queried, setQueried] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleQuery = (e: React.FormEvent) => {
    e.preventDefault()
    if (!domain) return
    cyberAudio.playSonarPing()
    startTransition(() => {
      setQueried(true)
    })
  }

  return (
    <SpotlightCard className="p-6 flex flex-col gap-6 bg-card/80 border border-border/80">
      <form onSubmit={handleQuery} className="flex flex-col gap-3">
        <label className="text-xs font-medium text-foreground">Investigate Organization / Corporate Domain:</label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="e.g. acme-corp.com or startup.io"
              value={domain}
              onChange={(e) => {
                setDomain(e.target.value)
                setQueried(false)
              }}
              className="w-full h-11 rounded-lg border border-border bg-background px-3.5 text-sm text-foreground font-mono"
            />
          </div>
          <Button type="submit" disabled={isPending} className="h-11 px-5 font-semibold gap-1.5">
            <Search className="h-4 w-4" />
            <span>Audit Domain</span>
          </Button>
        </div>
      </form>

      {queried && (
        <div className="rounded-xl border border-ft-caution/40 bg-ft-caution-muted/20 p-5 flex flex-col gap-3 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-ft-caution" />
              <h3 className="text-sm font-semibold text-foreground">Domain Telemetry: {domain}</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-ft-caution-muted text-ft-caution font-bold border border-ft-caution/30">
              Historical Exposure Detected
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center pt-2 border-t border-border/30">
            <div className="p-2.5 rounded bg-background/50 border border-border/40">
              <span className="text-[10px] text-muted-foreground uppercase font-mono block">Known Incidents</span>
              <span className="text-lg font-bold text-foreground font-mono tabular-nums">2</span>
            </div>
            <div className="p-2.5 rounded bg-background/50 border border-border/40">
              <span className="text-[10px] text-muted-foreground uppercase font-mono block">Exposed Accounts</span>
              <span className="text-lg font-bold text-ft-danger font-mono tabular-nums">153M</span>
            </div>
            <div className="p-2.5 rounded bg-background/50 border border-border/40">
              <span className="text-[10px] text-muted-foreground uppercase font-mono block">Zero PII Leak</span>
              <span className="text-lg font-bold text-ft-success font-mono">Guaranteed</span>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Aggregate domain queries return high-level threat metrics without querying individual employee addresses.
          </p>
        </div>
      )}
    </SpotlightCard>
  )
}

// ---------------------------------------------------------------------------
// FEATURE 5. FAQ Accordion
// ---------------------------------------------------------------------------
function FaqAccordionPreview() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const FAQS = [
    {
      q: "How does Fenntrace guarantee zero data retention?",
      a: "Every investigation runs entirely in transient memory during your active browser tab session. We have no user accounts, no query logging databases, and send standard 'no-store, no-cache' headers to prevent intermediary proxies from logging your email.",
    },
    {
      q: "What is k-Anonymity and why is it safer than typical hash checks?",
      a: "With k-Anonymity, your browser hashes the password locally with SHA-1 and sends only the first 5 hexadecimal characters (e.g. 5BAA6). The server returns thousands of candidate hashes that share that prefix. Your browser then performs the match locally, ensuring neither Fenntrace nor any network snooper ever learns your password or its full hash.",
    },
    {
      q: "What is the immediate priority if my password appeared in a breach?",
      a: "First, change that password immediately on the affected service. Second, update any other accounts where you might have reused that password. Third, enable Two-Factor Authentication (2FA) wherever supported.",
    },
    {
      q: "Where does Fenntrace source its breach intelligence?",
      a: "Fenntrace combines offline historical breach intelligence datasets with real-time API integrations (such as Have I Been Pwned v3) depending on your runtime environment configuration.",
    },
  ]

  return (
    <div className="flex flex-col gap-2.5">
      {FAQS.map((item, index) => {
        const isOpen = openIndex === index
        return (
          <div
            key={index}
            className="rounded-xl border border-border/70 bg-card/70 overflow-hidden transition-colors"
          >
            <button
              type="button"
              onClick={() => {
                setOpenIndex(isOpen ? null : index)
                cyberAudio.playClick()
              }}
              className="w-full flex items-center justify-between p-4 text-left text-sm font-medium text-foreground hover:text-primary transition-colors select-none"
            >
              <span className="flex items-center gap-2.5">
                <HelpCircle className="h-4 w-4 text-primary shrink-0" />
                {item.q}
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform duration-200 shrink-0",
                  isOpen && "rotate-180 text-primary"
                )}
              />
            </button>
            {isOpen && (
              <div className="px-4 pb-4 pt-1 text-xs leading-relaxed text-muted-foreground border-t border-border/30 bg-background/30 animate-in fade-in duration-200">
                {item.a}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
