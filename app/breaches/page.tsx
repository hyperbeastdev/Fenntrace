/**
 * Fenntrace — Breach Catalog & Explorer
 *
 * Public directory of indexed data breaches with real-time search,
 * severity filtering, and category breakdown.
 */

"use client"

import { useState, useEffect, useMemo, type ChangeEvent } from "react"
import Link from "next/link"
import { Search, ShieldAlert, AlertTriangle, Database, Filter, ArrowLeft, ArrowUpDown } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { buttonVariants } from "@/components/ui/button"
import { BreachCard } from "@/components/breach-card"
import { cn } from "@/lib/utils"
import type { BreachRecord, DataCategory } from "@/domain/types"

interface BreachesApiResponse {
  totalIndexedBreaches: number
  stats: {
    critical: number
    high: number
    moderate: number
  }
  breaches: BreachRecord[]
}

export default function BreachesPage() {
  const [data, setData] = useState<BreachesApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "name">("newest")

  useEffect(() => {
    async function fetchBreaches() {
      try {
        const res = await fetch("/api/breaches")
        if (res.ok) {
          const json = await res.json()
          setData(json)
        }
      } catch (err) {
        console.error("Failed to load breaches catalog:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchBreaches()
  }, [])

  // Extract all distinct categories
  const allCategories = useMemo(() => {
    if (!data?.breaches) return []
    const catSet = new Set<DataCategory>()
    data.breaches.forEach((b) => b.dataCategories.forEach((c) => catSet.add(c)))
    return Array.from(catSet)
  }, [data])

  // Filter and sort breaches
  const filteredBreaches = useMemo(() => {
    if (!data?.breaches) return []

    return data.breaches
      .filter((breach) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          const matchName = breach.name.toLowerCase().includes(q)
          const matchDesc = breach.description.toLowerCase().includes(q)
          const matchCat = breach.dataCategories.some((c) => c.toLowerCase().includes(q))
          if (!matchName && !matchDesc && !matchCat) return false
        }

        // Severity filter
        if (selectedSeverity !== "all" && breach.severity !== selectedSeverity) {
          return false
        }

        // Category filter
        if (selectedCategory !== "all" && !breach.dataCategories.includes(selectedCategory as DataCategory)) {
          return false
        }

        return true
      })
      .sort((a, b) => {
        if (sortOrder === "newest") {
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        }
        if (sortOrder === "oldest") {
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        }
        return a.name.localeCompare(b.name)
      })
  }, [data, searchQuery, selectedSeverity, selectedCategory, sortOrder])

  return (
    <div className="flex min-h-svh flex-col">
      <Header />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-[var(--content-max-width)] px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          {/* Breadcrumb / Back */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Exposure Investigation</span>
            </Link>
          </div>

          {/* Page Title & Intro */}
          <div className="flex flex-col gap-4 mb-10">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase">
                Breach Intelligence Directory
              </span>
            </div>
            <h1 className="text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl">
              Indexed Data Breaches
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground leading-relaxed">
              Explore documented security incidents and data leaks tracked in the Fenntrace intelligence registry. Understand what data was compromised and the potential risk level.
            </p>
          </div>

          {/* Stats Bar */}
          {data?.stats && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              <div className="flex items-center gap-4 rounded-xl border border-border/70 bg-card p-5">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <Database className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-foreground tabular-nums">
                    {data.totalIndexedBreaches}
                  </span>
                  <span className="text-xs text-muted-foreground">Total Indexed Incidents</span>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl border border-border/70 bg-card p-5">
                <div className="p-3 rounded-lg bg-ft-danger/10 text-ft-danger">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-ft-danger tabular-nums">
                    {data.stats.critical}
                  </span>
                  <span className="text-xs text-muted-foreground">Critical Severity (Passwords/Financial)</span>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl border border-border/70 bg-card p-5">
                <div className="p-3 rounded-lg bg-ft-caution/10 text-ft-caution">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-ft-caution tabular-nums">
                    {data.stats.high}
                  </span>
                  <span className="text-xs text-muted-foreground">High Risk (Identity/PII Data)</span>
                </div>
              </div>
            </div>
          )}

          {/* Filter & Search Toolbar */}
          <div className="flex flex-col gap-4 mb-8 p-5 rounded-xl border border-border/70 bg-card/60">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by company name, description, or data category..."
                  value={searchQuery}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 h-10 bg-background/60 border border-border/80 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
                <select
                  value={sortOrder}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setSortOrder(e.target.value as "newest" | "oldest" | "name")}
                  className="h-10 rounded-lg border border-border/80 bg-background/60 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="newest">Sort: Newest Discovery</option>
                  <option value="oldest">Sort: Oldest First</option>
                  <option value="name">Sort: Organization (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/40">
              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1 mr-1">
                <Filter className="h-3 w-3" /> Severity:
              </span>
              {(["all", "critical", "high", "moderate"] as const).map((sev) => (
                <button
                  key={sev}
                  type="button"
                  onClick={() => setSelectedSeverity(sev)}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                    selectedSeverity === sev
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  {sev.charAt(0).toUpperCase() + sev.slice(1)}
                </button>
              ))}

              {allCategories.length > 0 && (
                <>
                  <div className="h-4 w-px bg-border/60 mx-1 hidden sm:block" />
                  <span className="text-xs text-muted-foreground font-medium mr-1 hidden sm:inline">
                    Category:
                  </span>
                  <select
                    value={selectedCategory}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}
                    className="h-7 rounded-md border border-border/80 bg-background/60 px-2 text-xs text-foreground focus:outline-none"
                  >
                    <option value="all">All Categories</option>
                    {allCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </>
              )}

              {(searchQuery || selectedSeverity !== "all" || selectedCategory !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedSeverity("all")
                    setSelectedCategory("all")
                  }}
                  className="text-xs text-primary underline ml-auto"
                >
                  Reset filters
                </button>
              )}
            </div>
          </div>

          {/* Breaches List / Grid */}
          {loading ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              Loading breach catalog...
            </div>
          ) : filteredBreaches.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center gap-3 border border-dashed border-border/60 rounded-xl">
              <Database className="h-8 w-8 text-muted-foreground/50" />
              <h3 className="text-base font-medium text-foreground">No matching breaches found</h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                Try searching for a different company or resetting your active severity filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBreaches.map((breach) => (
                <BreachCard key={breach.id} breach={breach} />
              ))}
            </div>
          )}

          {/* Bottom CTA */}
          <div className="mt-16 rounded-xl border border-primary/30 bg-primary/5 p-8 text-center flex flex-col items-center gap-4">
            <h2 className="text-xl font-semibold text-foreground">
              Are you affected by any of these breaches?
            </h2>
            <p className="text-sm text-muted-foreground max-w-md">
              Check your email address with Fenntrace’s zero-storage privacy engine to see which records match your identity.
            </p>
            <Link
              href="/"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-xl px-6 font-semibold"
              )}
            >
              Check My Email Now
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

