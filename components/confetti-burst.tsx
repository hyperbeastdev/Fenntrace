/**
 * Fenntrace — Particle / Confetti Burst Celebration
 *
 * Lightweight, zero-dependency particle burst rendered on canvas
 * when all remediation checklist tasks are completed.
 */

"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  alpha: number
  life: number
}

const COLORS = ["#58A6FF", "#3FB950", "#2EA043", "#79C0FF", "#EDEEF0"]

export function ConfettiBurst({ trigger = true }: { trigger?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!trigger) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = (canvas.width = canvas.parentElement?.clientWidth || 300)
    const height = (canvas.height = canvas.parentElement?.clientHeight || 200)

    const particles: Particle[] = []
    const particleCount = 45

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 2 + Math.random() * 4
      particles.push({
        x: width / 2,
        y: height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 2 + Math.random() * 3,
        alpha: 1,
        life: 0.95 + Math.random() * 0.04,
      })
    }

    let animationId: number

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      let activeParticles = 0
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.05 // subtle gravity
        p.alpha *= 0.96

        if (p.alpha > 0.05) {
          activeParticles++
          ctx.save()
          ctx.globalAlpha = p.alpha
          ctx.fillStyle = p.color
          ctx.shadowBlur = 4
          ctx.shadowColor = p.color
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }
      })

      if (activeParticles > 0) {
        animationId = requestAnimationFrame(render)
      }
    }

    render()

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [trigger])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-20 h-full w-full"
      aria-hidden="true"
    />
  )
}
