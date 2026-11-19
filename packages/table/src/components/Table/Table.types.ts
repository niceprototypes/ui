import type * as React from "react"

/**
 * TableColumnWidthType
 *
 * One column's width, from the `table.column.width` tokens.
 *
 * Values:
 * - "fit": as wide as its widest content
 * - "small": at least a short value's width, growing to its content
 * - "base": at least a label's width, sharing the spare space
 * - "large": at least a sentence's width, taking twice the spare space of "base"
 */
export type TableColumnWidthType = "fit" | "small" | "base" | "large"

/**
 * TableColumnWidthsType
 *
 * The column template: one width per column, in order. Every row shares it (CSS subgrid).
 */
export type TableColumnWidthsType = ReadonlyArray<TableColumnWidthType>

/**
 * TableRoleType
 *
 * The grid's ARIA role.
 *
 * Values:
 * - "grid": flat rows (default)
 * - "treegrid": rows nest; give each TableRow its `aria-level`, `aria-posinset` and `aria-setsize`
 */
export type TableRoleType = "grid" | "treegrid"

/**
 * TableMaxHeightType
 *
 * The table's maximum height, from the `table.maxHeight` tokens; past it the body scrolls under
 * the sticky header.
 *
 * Values:
 * - "none": grows with its rows (default)
 * - "small" | "base" | "large": capped
 */
export type TableMaxHeightType = "none" | "small" | "base" | "large"

/**
 * TableAlignItemsType
 *
 * Vertical alignment of every cell's content within its row (Grid's `alignItems` names).
 *
 * Values:
 * - "start": content sits at the top of the row (default)
 * - "center": content centred in the row
 * - "end": content at the bottom of the row
 */
export type TableAlignItemsType = "start" | "center" | "end"

/**
 * TableStripedType
 *
 * Whether body rows alternate between the base and `table.backgroundColor:stripe` backgrounds,
 * by visible row order (expanded nested rows included), with a `table.borderColor:row` divider
 * above every row.
 */
export type TableStripedType = boolean

/**
 * TableToolbarType
 *
 * Content above the grid, inside the card (a selection bar); it does not scroll with the rows.
 */
export type TableToolbarType = React.ReactNode

/**
 * TableProps
 *
 * Complete prop definition for the Table component.
 */
export interface TableProps {
  /** Accessible name of the grid */
  "aria-label"?: string

  /** Id(s) of the element(s) naming the grid */
  "aria-labelledby"?: string

  /** Total rows, the header row included, when not all are rendered */
  "aria-rowcount"?: number

  /** Rows can be selected together */
  "aria-multiselectable"?: boolean

  /** Rows are loading */
  "aria-busy"?: boolean

  /** The grid's ARIA role */
  role?: TableRoleType

  /** One width per column */
  columnWidths: TableColumnWidthsType

  /** Maximum height before the body scrolls */
  maxHeight?: TableMaxHeightType

  /** Vertical alignment of cell content in every row (default "start") */
  alignItems?: TableAlignItemsType

  /** Alternating row backgrounds and row dividers (default true) */
  striped?: TableStripedType

  /** Content above the grid, inside the card */
  toolbar?: TableToolbarType

  /** TableHeader and TableRow elements */
  children?: React.ReactNode

  /** Key handler on the grid (a keyboard model for its rows and cells) */
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>

  /** Focus handler on the grid; focus events from rows and cells bubble to it */
  onFocus?: React.FocusEventHandler<HTMLDivElement>

  /** Ref to the grid element */
  ref?: React.Ref<HTMLDivElement>
}

const TableTypes = {} as const

namespace TableTypes {
  export type ColumnWidth = TableColumnWidthType
  export type ColumnWidths = TableColumnWidthsType
  export type Role = TableRoleType
  export type MaxHeight = TableMaxHeightType
  export type AlignItems = TableAlignItemsType
  export type Striped = TableStripedType
  export type Toolbar = TableToolbarType
  export type Props = TableProps
}

export default TableTypes
