/**
 * Fenntrace — Matrix Digital Hex Rain Canvas
 *
 * Ultra-lightweight HTML5 Canvas animation featuring cascading
 * alphanumeric hex streams, glowing head characters, and mouse hover excitation.
 */

"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface MatrixRainProps {
  className?: string
  color?: string
  headColor?: string
  speed?: number
  fontSize?: number
  opacity?: number
}

export function MatrixRain({
  className,
  color = "#3fb950", // GitHub / Emerald green
  headColor = "#58a6ff", // Blue / Cyan accent
  speed = 1,
  fontSize = 14,
  opacity = 0.85,
}: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    const chars = "0123456789ABCDEFѰ҂Ϙϟ⚡FENNTRACE_SECURE_AUTH_TOKEN_SHA256_LEAK_ZERO_DAY"

    const resize = () => {
      if (!canvas) return
      const rect = canvas.parentElement?.getBoundingClientRect()
      if (rect) {
        canvas.width = rect.width
        canvas.height = rect.height
      }
    }

    resize()
    window.addEventListener("resize", resize)

    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = Array.from({ length: columns }, () => Math.floor(Math.random() * -50))

    let lastTime = 0
    const interval = 35 / speed

    const draw = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(draw)

      if (currentTime - lastTime < interval) return
      lastTime = currentTime

      // Fade canvas slightly for motion trail
      ctx.fillStyle = "rgba(7, 10, 19, 0.12)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        // Draw bright leading character
        ctx.fillStyle = headColor
        ctx.shadowColor = headColor
        ctx.shadowBlur = 8
        ctx.fillText(char, x, y)

        // Reset shadow for normal body characters
        ctx.shadowBlur = 0
        ctx.fillStyle = color

        if (y > canvas.height && Math.random() > 0.985) {
          drops[i] = 0
        }

        drops[i]++
      }
    }

    animationFrameId = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [color, headColor, speed, fontSize])

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      style={{ opacity }}
      aria-hidden="true"
    />
  )
}
