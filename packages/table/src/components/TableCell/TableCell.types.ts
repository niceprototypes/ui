import type * as React from "react"
import type { TreeGuideRowType } from "@niceprototypes/tree"

/**
 * TableCellRoleType
 *
 * The cell's ARIA role.
 *
 * Values:
 * - "gridcell": a data cell (default)
 * - "rowheader": the cell naming its row (a treegrid's tree column)
 * - "columnheader": a header cell, inside TableHeader
 */
export type TableCellRoleType = "gridcell" | "rowheader" | "columnheader"

/**
 * TableCellAlignType
 *
 * Horizontal alignment of the cell's content.
 *
 * Values:
 * - "start": text and most content (default)
 * - "end": numbers, so digits line up
 */
export type TableCellAlignType = "start" | "end"

/**
 * TableCellSpanType
 *
 * Values:
 * - "full": the cell spans every column (an empty or loading message)
 */
export type TableCellSpanType = "full"

/**
 * TableCellGuideType
 *
 * The row's TreeGuide data (from `getTreeRows`): the cell draws the guide slice before its content,
 * over the row's full height.
 */
export type TableCellGuideType = TreeGuideRowType

/**
 * TableCellSortType
 *
 * A column header's sort state (`aria-sort`); set it on the sorted column only.
 */
export type TableCellSortType = "ascending" | "descending"

/**
 * TableCellProps
 *
 * Complete prop definition for the TableCell component.
 */
export interface TableCellProps {
  /** The cell's content */
  children?: React.ReactNode

  /** ARIA role */
  role?: TableCellRoleType

  /** Horizontal alignment */
  align?: TableCellAlignType

  /** Span every column */
  span?: TableCellSpanType

  /** TreeGuide data drawn before the content */
  guide?: TableCellGuideType

  /** Column header sort state */
  "aria-sort"?: TableCellSortType

  /** Accessible name, for a cell without text (an actions header) */
  "aria-label"?: string

  /** Tab order of the cell (-1 for a roving-focus keyboard model) */
  tabIndex?: number
}

const TableCellTypes = {} as const

namespace TableCellTypes {
  export type Role = TableCellRoleType
  export type Align = TableCellAlignType
  export type Span = TableCellSpanType
  export type Guide = TableCellGuideType
  export type Sort = TableCellSortType
  export type Props = TableCellProps
}

export default TableCellTypes
