/**
 * Fenntrace — Magnetic Physics Button
 *
 * Micro-interaction component that pulls smoothly towards the cursor
 * when hovered, creating a tactile and responsive feel.
 */

"use client"

import { useState, useRef, type MouseEvent, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  strength?: number
  onClick?: () => void
}

export function MagneticButton({
  children,
  className,
  strength = 0.35,
  onClick,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const distanceX = (e.clientX - centerX) * strength
    const distanceY = (e.clientY - centerY) * strength

    setPosition({ x: distanceX, y: distanceY })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: position.x === 0 && position.y === 0 ? "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)" : "none",
      }}
      className={cn(
        "relative inline-flex items-center justify-center rounded-xl px-5 py-2.5 font-medium transition-colors will-change-transform",
        className
      )}
    >
      {children}
    </button>
  )
}
