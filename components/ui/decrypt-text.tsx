/**
 * Fenntrace — Decrypt / Cipher Text Effect
 *
 * Scrambles characters using random cryptographic hex symbols
 * before resolving into the target text.
 */

"use client"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"

interface DecryptTextProps {
  text: string
  className?: string
  speed?: number
  maxIterations?: number
  triggerOnHover?: boolean
  characters?: string
}

const DEFAULT_CHARS = "0123456789ABCDEF$#@%&*!?"

export function DecryptText({
  text,
  className,
  speed = 35,
  maxIterations = 12,
  triggerOnHover = false,
  characters = DEFAULT_CHARS,
}: DecryptTextProps) {
  const [displayText, setDisplayText] = useState(text)
  const isScrambling = useRef(false)

  const scramble = () => {
    if (isScrambling.current) return
    isScrambling.current = true

    let iteration = 0
    const totalLength = text.length

    const interval = setInterval(() => {
      setDisplayText(() => {
        return text
          .split("")
          .map((char, index) => {
            if (char === " " || char === "\n") return char
            if (index < (iteration / maxIterations) * totalLength) {
              return text[index]
            }
            return characters[Math.floor(Math.random() * characters.length)]
          })
          .join("")
      })

      iteration += 1

      if (iteration > maxIterations) {
        clearInterval(interval)
        setDisplayText(text)
        isScrambling.current = false
      }
    }, speed)
  }

  useEffect(() => {
    scramble()
  }, [text])

  return (
    <span
      onMouseEnter={triggerOnHover ? scramble : undefined}
      className={cn("inline-block font-mono", className)}
    >
      {displayText}
    </span>
  )
}
