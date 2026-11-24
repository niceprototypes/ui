import type * as React from "react"

/**
 * DocsColumnsSplitType
 *
 * How the two columns share the width from laptop up (`docsColumnsSplit` tokens), named by the
 * columns rather than by side, so they read the same in either writing direction.
 *
 * Values:
 * - "even": default. Equal columns (1:1)
 * - "wideAside": the aside takes the larger share (main 2 : aside 3)
 * - "wideMain": the main column takes the larger share (main 3 : aside 2)
 */
export type DocsColumnsSplitType = "even" | "wideAside" | "wideMain"

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
  /** How the columns share the width from laptop up. @default "even" */
  split?: DocsColumnsSplitType
}
