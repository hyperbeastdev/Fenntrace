/**
 * Fenntrace — Cyber Node Network & Threat Arcs Visualizer
 *
 * Interactive network graph rendering dark web telemetry nodes,
 * connecting bezier threat vectors, and pulsing packet animations.
 */

"use client"

import { useState, useEffect } from "react"
import { ShieldAlert, Radio, Activity, Cpu } from "lucide-react"

interface Node {
  id: string
  label: string
  x: number
  y: number
  status: "secure" | "compromised" | "scanning"
  ip: string
}

const INITIAL_NODES: Node[] = [
  { id: "node-1", label: "US-EAST (AWS Virginia)", x: 20, y: 35, status: "secure", ip: "54.239.28.1" },
  { id: "node-2", label: "EU-CENTRAL (Frankfurt)", x: 50, y: 25, status: "compromised", ip: "18.197.0.12" },
  { id: "node-3", label: "AP-SOUTH (Mumbai Gateway)", x: 75, y: 60, status: "scanning", ip: "13.232.14.99" },
  { id: "node-4", label: "TOR RELAY (Darkweb Cluster)", x: 45, y: 75, status: "compromised", ip: "192.42.116.16" },
  { id: "node-5", label: "FENNTRACE SENTINEL HQ", x: 60, y: 40, status: "secure", ip: "10.0.0.1" },
]

export function CyberNodes() {
  const [activeNode, setActiveNode] = useState<Node>(INITIAL_NODES[4])
  const [pulseIndex, setPulseIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % INITIAL_NODES.length)
    }, 2500)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full rounded-2xl border border-border/80 bg-card/60 p-6 backdrop-blur-md overflow-hidden">
      {/* Background Grid Pattern */}
      <div 
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]"
        aria-hidden="true"
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Radio className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <h4 className="font-mono text-sm font-semibold text-foreground tracking-wide">
              GLOBAL TELEMETRY RADAR
            </h4>
            <p className="font-mono text-xs text-muted-foreground">
              5 Cluster Nodes Synchronized • Low Latency Mesh
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-mono font-medium text-emerald-400 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            LIVE LINK ACTIVE
          </span>
        </div>
      </div>

      {/* Interactive Map Visualizer */}
      <div className="relative h-64 sm:h-80 w-full rounded-xl bg-background/50 border border-border/50 overflow-hidden">
        {/* SVG Arcs */}
        <svg className="absolute inset-0 h-full w-full pointer-events-none">
          <defs>
            <linearGradient id="cyberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.3" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Connected Curves */}
          <path
            d="M 20% 35% Q 35% 15% 50% 25%"
            fill="none"
            stroke="url(#cyberGradient)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="animate-[dash_20s_linear_infinite]"
          />
          <path
            d="M 50% 25% Q 55% 32% 60% 40%"
            fill="none"
            stroke="#58a6ff"
            strokeWidth="2"
            opacity="0.6"
          />
          <path
            d="M 60% 40% Q 68% 50% 75% 60%"
            fill="none"
            stroke="#3fb950"
            strokeWidth="1.5"
            strokeDasharray="6 3"
          />
          <path
            d="M 45% 75% Q 52% 58% 60% 40%"
            fill="none"
            stroke="#f85149"
            strokeWidth="1.5"
            strokeDasharray="5 5"
          />
          <path
            d="M 20% 35% Q 30% 60% 45% 75%"
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
          />
        </svg>

        {/* Nodes */}
        {INITIAL_NODES.map((node, index) => {
          const isSelected = activeNode.id === node.id
          const isPulsing = pulseIndex === index

          let statusColor = "border-emerald-500 bg-emerald-500/20 text-emerald-400"
          let pingColor = "bg-emerald-400"

          if (node.status === "compromised") {
            statusColor = "border-rose-500 bg-rose-500/20 text-rose-400"
            pingColor = "bg-rose-400"
          } else if (node.status === "scanning") {
            statusColor = "border-amber-500 bg-amber-500/20 text-amber-400"
            pingColor = "bg-amber-400"
          }

          return (
            <button
              key={node.id}
              onClick={() => setActiveNode(node)}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 group p-2 transition-transform duration-200 hover:scale-125 focus:outline-none`}
            >
              <div className="relative flex items-center justify-center">
                {/* Ping wave */}
                {(isSelected || isPulsing) && (
                  <span
                    className={`absolute h-8 w-8 rounded-full ${pingColor} opacity-40 animate-ping`}
                  />
                )}
                <div
                  className={`h-4 w-4 rounded-full border-2 ${statusColor} flex items-center justify-center transition-all shadow-[0_0_12px_currentColor]`}
                >
                  <div className={`h-1.5 w-1.5 rounded-full ${pingColor}`} />
                </div>
              </div>

              {/* Tooltip Tag */}
              <div
                className={`pointer-events-none absolute left-1/2 bottom-full mb-1.5 -translate-x-1/2 whitespace-nowrap rounded px-2 py-0.5 text-[10px] font-mono transition-opacity shadow-md border ${
                  isSelected
                    ? "bg-foreground text-background font-bold opacity-100 border-foreground"
                    : "bg-card/90 text-muted-foreground opacity-75 group-hover:opacity-100 border-border"
                }`}
              >
                {node.label.split(" ")[0]}
              </div>
            </button>
          )
        })}
      </div>

      {/* Selected Node Details Bar */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border/80 bg-background/60 p-3 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
            {activeNode.status === "compromised" ? (
              <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
            ) : activeNode.status === "scanning" ? (
              <Activity className="h-3.5 w-3.5 text-amber-400" />
            ) : (
              <Cpu className="h-3.5 w-3.5 text-emerald-400" />
            )}
          </div>
          <div>
            <div className="font-semibold text-foreground">{activeNode.label}</div>
            <div className="text-[11px] text-muted-foreground">IP: {activeNode.ip}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-muted-foreground">STATUS:</span>
          <span
            className={`font-semibold uppercase ${
              activeNode.status === "compromised"
                ? "text-rose-400"
                : activeNode.status === "scanning"
                ? "text-amber-400"
                : "text-emerald-400"
            }`}
          >
            {activeNode.status}
          </span>
        </div>
      </div>
    </div>
  )
}
