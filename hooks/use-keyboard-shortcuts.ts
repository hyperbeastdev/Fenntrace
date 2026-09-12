/**
 * Fenntrace — Keyboard Shortcuts Hook
 *
 * Provides global keyboard shortcuts:
 * - "/" or "⌘K" / "Ctrl+K": Focus active investigation input
 * - "Escape": Erase active check or reset view
 */

"use client"

import { useEffect } from "react"

interface UseKeyboardShortcutsProps {
  onFocusInput?: () => void
  onEscape?: () => void
}

export function useKeyboardShortcuts({
  onFocusInput,
  onEscape,
}: UseKeyboardShortcutsProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't trigger if user is actively typing in an input or textarea
      const target = e.target as HTMLElement
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable

      // "/" or "Cmd/Ctrl + K" to focus input
      if (
        (e.key === "/" && !isInput) ||
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")
      ) {
        e.preventDefault()
        onFocusInput?.()
        return
      }

      // "Escape" to erase/reset
      if (e.key === "Escape") {
        onEscape?.()
        return
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onFocusInput, onEscape])
}
