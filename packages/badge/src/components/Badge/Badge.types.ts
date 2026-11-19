import type * as React from "react"

/**
 * BadgeStatusType
 *
 * The badge's semantic status: its tint, dot and text colour come from the matching status
 * tokens, in every theme.
 *
 * Values:
 * - "base": neutral (inactive, stopped, blocked)
 * - "success": positive (active, running)
 * - "warning": needs attention (held, pending)
 * - "error": failed
 */
export type BadgeStatusType = "base" | "success" | "warning" | "error"

/**
 * BadgeLabelType
 *
 * The badge's text.
 */
export type BadgeLabelType = React.ReactNode

/**
 * BadgeProps
 *
 * Complete prop definition for the Badge component.
 */
export interface BadgeProps {
  /** The badge's text */
  label: BadgeLabelType

  /** Semantic status: tint, dot and text colour */
  status?: BadgeStatusType
}

const BadgeTypes = {} as const

namespace BadgeTypes {
  export type Status = BadgeStatusType
  export type Label = BadgeLabelType
  export type Props = BadgeProps
}

export default BadgeTypes
