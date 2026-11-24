import type * as React from "react"

/**
 * DocsColumnsProps
 *
 * Complete prop definition for the DocsColumns component.
 */
export interface DocsColumnsProps {
  /** The main column: prose, the parameter list, subsections */
  children?: React.ReactNode
  /** The aside column: code, live previews, examples */
  aside?: React.ReactNode
  /** The column that stays in view from laptop up while the other scrolls past, until the pair ends. @default "aside" */
  sticky?: "main" | "aside"
}
