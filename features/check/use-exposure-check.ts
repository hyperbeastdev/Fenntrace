/**
 * Fenntrace — Exposure Check State Orchestration
 *
 * Custom hook implementing the Fenntrace state machine.
 * Coordinates UI ↔ Domain ↔ Provider through a single
 * discriminated union state.
 *
 * State transitions:
 *   idle → invalid (bad email)
 *   idle → checking (valid email submitted)
 *   checking → found | notFound | unavailable | error
 *   found → cleared
 *   notFound → cleared
 *   unavailable → idle (retry)
 *   error → idle (retry)
 *   cleared → idle (restart)
 */

"use client"

import { useCallback, useReducer } from "react"
import type { CheckState, ExposureProvider } from "@/domain/types"
import { isValidEmail } from "@/domain/helpers"

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

type CheckAction =
  | { type: "SUBMIT"; email: string }
  | { type: "VALIDATE_FAIL"; email: string; error: string }
  | { type: "CHECK_START"; email: string }
  | { type: "CHECK_FOUND"; email: string; result: CheckState & { status: "found" } }
  | { type: "CHECK_NOT_FOUND"; email: string; source: string }
  | { type: "CHECK_UNAVAILABLE"; source: string; reason: string }
  | { type: "CHECK_ERROR"; message: string }
  | { type: "ERASE" }
  | { type: "RESTART" }
  | { type: "RETRY" }

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function checkReducer(_state: CheckState, action: CheckAction): CheckState {
  switch (action.type) {
    case "VALIDATE_FAIL":
      return { status: "invalid", email: action.email, error: action.error }

    case "CHECK_START":
      return { status: "checking", email: action.email }

    case "CHECK_FOUND":
      return action.result

    case "CHECK_NOT_FOUND":
      return { status: "notFound", email: action.email, source: action.source }

    case "CHECK_UNAVAILABLE":
      return {
        status: "unavailable",
        source: action.source,
        reason: action.reason,
      }

    case "CHECK_ERROR":
      return { status: "error", message: action.message }

    case "ERASE":
      return { status: "cleared" }

    case "RESTART":
    case "RETRY":
      return { status: "idle" }

    default:
      return { status: "idle" }
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

const INITIAL_STATE: CheckState = { status: "idle" }

export function useExposureCheck(provider: ExposureProvider) {
  const [state, dispatch] = useReducer(checkReducer, INITIAL_STATE)

  const submitEmail = useCallback(
    async (email: string) => {
      const trimmed = email.trim()

      // Validate
      if (!isValidEmail(trimmed)) {
        dispatch({
          type: "VALIDATE_FAIL",
          email: trimmed,
          error: "Enter a valid email address",
        })
        return
      }

      // Begin check
      dispatch({ type: "CHECK_START", email: trimmed })

      try {
        const providerResult = await provider.checkExposure(trimmed)

        switch (providerResult.type) {
          case "found":
            dispatch({
              type: "CHECK_FOUND",
              email: trimmed,
              result: {
                status: "found",
                email: trimmed,
                result: providerResult.result,
              },
            })
            break

          case "notFound":
            dispatch({
              type: "CHECK_NOT_FOUND",
              email: trimmed,
              source: providerResult.source,
            })
            break

          case "unavailable":
            dispatch({
              type: "CHECK_UNAVAILABLE",
              source: providerResult.source,
              reason: providerResult.reason,
            })
            break

          case "error":
            dispatch({
              type: "CHECK_ERROR",
              message: providerResult.message,
            })
            break
        }
      } catch {
        dispatch({
          type: "CHECK_ERROR",
          message:
            "An unexpected error occurred while checking this address. Please try again.",
        })
      }
    },
    [provider]
  )

  const erase = useCallback(() => {
    dispatch({ type: "ERASE" })
  }, [])

  const restart = useCallback(() => {
    dispatch({ type: "RESTART" })
  }, [])

  const retry = useCallback(() => {
    dispatch({ type: "RETRY" })
  }, [])

  return {
    state,
    submitEmail,
    erase,
    restart,
    retry,
  }
}
