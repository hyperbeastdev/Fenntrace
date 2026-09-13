/**
 * Fenntrace — 3D Holographic Tilt Card
 *
 * Smooth 3D perspective rotation and dynamic holographic glare
 * following mouse movements.
 */

"use client"

import { useState, useRef, type MouseEvent, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface TiltCardProps {
  children: ReactNode
  className?: string
  maxTilt?: number
}

export function TiltCard({
  children,
  className,
  maxTilt = 12,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 })

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -maxTilt
    const rotateY = ((x - centerX) / centerX) * maxTilt

    setTilt({ x: rotateX, y: rotateY })
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.25,
    })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setGlare((prev) => ({ ...prev, opacity: 0 }))
  }

  return (
    <div
      style={{ perspective: 1000 }}
      className="w-full"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: tilt.x === 0 && tilt.y === 0 ? "transform 0.5s ease-out" : "none",
        }}
        className={cn(
          "relative overflow-hidden rounded-2xl border border-border/80 bg-card/90 backdrop-blur-md shadow-2xl transition-shadow duration-300",
          className
        )}
      >
        {/* Holographic Glare Layer */}
        <div
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
          style={{
            opacity: glare.opacity,
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(88, 166, 255, 0.4), rgba(63, 185, 80, 0.1) 40%, transparent 70%)`,
          }}
          aria-hidden="true"
        />
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  )
}
