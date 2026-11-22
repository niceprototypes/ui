import type * as React from "react"

/**
 * TreeExpanderCaretType
 *
 * Which way the caret points. The consumer maps it from its open state: DataTable points it
 * right while closed and down while open; Tree's nav the other way round (right while open).
 */
export type TreeExpanderCaretType = "right" | "bottom"

/**
 * TreeExpanderProps
 *
 * Complete prop definition for the TreeExpander component.
 * - caret: the caret's direction
 * - expanded: the open state, as `aria-expanded` (a button only)
 * - active: on the active path, so circle and caret take `tree.expander.color:active`
 * - onToggle: makes it a button; without it the expander is a mark only
 * - decorative: with onToggle, a mark a click still toggles (a folder whose row button is the toggle)
 * - controls: the id of the list it shows, as `aria-controls`
 * - aria-label: the button's name (the row's label)
 * - tabIndex: the button's tab stop (a grid row moves focus itself and passes -1)
 * - onKeyDown: the button's key handler (Tree's Right and Left arrows)
 */
export interface TreeExpanderProps {
  caret: TreeExpanderCaretType
  expanded?: boolean
  active?: boolean
  onToggle?: (event: React.MouseEvent<HTMLButtonElement>) => void
  controls?: string
  "aria-label"?: string
  tabIndex?: number
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void
  decorative?: boolean
}

/**
 * TreeExpanderSlotProps
 *
 * Complete prop definition for the TreeExpanderSlot component.
 * - arm: draw the guide's arm on through the slot to the circle's right edge (a row under a guide)
 * - active: on the active path, so that arm takes `tree.activeColor`
 */
export interface TreeExpanderSlotProps {
  arm?: boolean
  active?: boolean
}
