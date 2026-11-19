import type * as React from "react"

/**
 * TableRowDensityType
 *
 * Row height and text size.
 *
 * Values:
 * - "base": the default row
 * - "compact": one step down in padding and text size, on the nested-row background (nested
 *   rows in a treegrid)
 */
export type TableRowDensityType = "base" | "compact"

/**
 * TableRowDividerType
 *
 * Whether a divider line separates the row from the one above (the start of a group). The first
 * row under the header never draws one.
 */
export type TableRowDividerType = boolean

/**
 * TableRowProps
 *
 * Complete prop definition for the TableRow component: one body row. The ARIA attributes describe
 * its place in the grid; hover, focus and `aria-selected` styles are CSS.
 */
export interface TableRowProps {
  /** TableCell elements, one per column */
  children?: React.ReactNode

  /** Row height and text size */
  density?: TableRowDensityType

  /** A divider above the row */
  divider?: TableRowDividerType

  /** 1-based position among all rows, the header row being 1 */
  "aria-rowindex"?: number

  /** Treegrid: 1-based nesting level */
  "aria-level"?: number

  /** Treegrid: 1-based position among its siblings */
  "aria-posinset"?: number

  /** Treegrid: number of its siblings, itself included */
  "aria-setsize"?: number

  /** Treegrid: whether its children show; set only on rows with children */
  "aria-expanded"?: boolean

  /** Whether the row is selected; set only when rows can be selected */
  "aria-selected"?: boolean

  /** Tab order of the row (-1 for a roving-focus keyboard model) */
  tabIndex?: number
}

const TableRowTypes = {} as const

namespace TableRowTypes {
  export type Density = TableRowDensityType
  export type Divider = TableRowDividerType
  export type Props = TableRowProps
}

export default TableRowTypes
