import type * as React from "react"

/**
 * DataTableRowIdType
 *
 * A row's id, unique across the whole table (nested rows included); keys `expandedIds` and
 * `selectedIds`.
 */
export type DataTableRowIdType = string

/**
 * DataTableCellContextType
 *
 * What a cell renderer knows about its row besides the row itself.
 * - depth: nesting level, 0 for a top-level row
 * - expanded: the row has children and they show
 * - hasChildren: the row has at least one child
 * - toggle: opens or closes the row's children (no-op without children)
 */
export type DataTableCellContextType = {
  depth: number
  expanded: boolean
  hasChildren: boolean
  toggle: () => void
}

/**
 * DataTableColumnAlignType
 *
 * Horizontal alignment of a column's header and cells.
 *
 * Values:
 * - "start": text and most content (default)
 * - "end": numbers, so digits line up
 */
export type DataTableColumnAlignType = "start" | "end"

/**
 * DataTableColumnWidthType
 *
 * A column's width, from the `datatable.column.width` tokens.
 *
 * Values:
 * - "fit": as wide as its widest content
 * - "small": at least a short value's width, growing to its content
 * - "base": at least a label's width, sharing the spare space (default)
 * - "large": at least a sentence's width, taking twice the spare space of "base"
 */
export type DataTableColumnWidthType = "fit" | "small" | "base" | "large"

/**
 * DataTableSortValueType
 *
 * A row's value in a column for sorting: strings compare by locale (numeric-aware), numbers
 * numerically. A column with a `sortValue` is sortable.
 */
export type DataTableSortValueType<Row> = (row: Row) => string | number

/**
 * DataTableColumnType
 *
 * One column.
 * - id: unique among the columns; keys `sort`
 * - header: the column header's content
 * - cell: the cell's content for a row; return null for an empty cell (a child row whose value
 *   belongs to its parent). The cell is still rendered, as an empty gridcell
 * - rowHeader: the tree column: its cells are row headers and carry the guide lines and the
 *   expander. Unset on every column, the first column is the tree column
 * - align: horizontal alignment, "start" or "end"
 * - width: a `datatable.column.width` token variant
 * - sortValue: the row's value for sorting; makes the column sortable
 */
export type DataTableColumnType<Row> = {
  id: string
  header: React.ReactNode
  cell: (row: Row, context: DataTableCellContextType) => React.ReactNode
  rowHeader?: true
  align?: DataTableColumnAlignType
  width?: DataTableColumnWidthType
  sortValue?: DataTableSortValueType<Row>
}

/**
 * DataTableColumnsType
 *
 * The table's columns, in order. Memoize the array: a new array re-renders every row.
 */
export type DataTableColumnsType<Row> = ReadonlyArray<DataTableColumnType<Row>>

/**
 * DataTableRowsType
 *
 * The top-level rows; nested rows come from `getRowChildren`.
 */
export type DataTableRowsType<Row> = ReadonlyArray<Row>

/**
 * DataTableGetRowIdType
 *
 * A row's id, unique across the whole table.
 */
export type DataTableGetRowIdType<Row> = (row: Row) => DataTableRowIdType

/**
 * DataTableGetRowLabelType
 *
 * A row's name, used in the accessible names of its expander ("animation-studio"), checkbox
 * ("Select animation-studio") and actions button ("Actions for animation-studio"). Unset, the id.
 */
export type DataTableGetRowLabelType<Row> = (row: Row) => string

/**
 * DataTableGetRowChildrenType
 *
 * A row's nested rows; undefined or empty for a leaf. Children share the parent's columns.
 */
export type DataTableGetRowChildrenType<Row> = (row: Row) => ReadonlyArray<Row> | undefined

/**
 * DataTableExpandedIdsType
 *
 * Ids of the rows whose children show.
 */
export type DataTableExpandedIdsType = ReadonlyArray<DataTableRowIdType>

/**
 * DataTableDefaultExpandedIdsType
 *
 * Rows open at first, when the table keeps its own state; "all" opens every row.
 */
export type DataTableDefaultExpandedIdsType = DataTableExpandedIdsType | "all"

/**
 * DataTableToggleEventType
 *
 * The event behind an expand or collapse: a click on an expander or a key on a row.
 */
export type DataTableToggleEventType = React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>

/**
 * DataTableOnExpandedChangeType
 *
 * Called when a row opens or closes, with the next open row ids and the event; undefined when a
 * cell's `toggle` was called outside an event.
 */
export type DataTableOnExpandedChangeType = (expandedIds: DataTableRowIdType[], event?: DataTableToggleEventType) => void

/**
 * DataTableSelectableType
 *
 * Whether rows can be selected: a checkbox column, a select-all checkbox in its header, and
 * Space on a focused row.
 */
export type DataTableSelectableType = boolean

/**
 * DataTableSelectedIdsType
 *
 * Ids of the selected rows. A row with children is selected exactly when all its descendants are;
 * selecting it selects them all.
 */
export type DataTableSelectedIdsType = ReadonlyArray<DataTableRowIdType>

/**
 * DataTableOnSelectedChangeType
 *
 * Called when the selection changes, with the next selected row ids.
 */
export type DataTableOnSelectedChangeType = (selectedIds: DataTableRowIdType[]) => void

/**
 * DataTableActionType
 *
 * One entry of an actions menu.
 * - id: unique within the menu
 * - label: the entry's text
 * - disabled: shown but not selectable
 * - onSelect: runs when the entry is chosen; the menu closes
 */
export type DataTableActionType = {
  id: string
  label: string
  disabled?: boolean
  onSelect: () => void
}

/**
 * DataTableBulkActionsType
 *
 * The actions for the selected rows, shown in a menu above the table while any row is selected.
 */
export type DataTableBulkActionsType<Row> = (selectedRows: Row[]) => ReadonlyArray<DataTableActionType>

/**
 * DataTableRowActionsType
 *
 * A row's actions, in a menu opened from the menu-icon button at the row's end. An empty list
 * leaves the cell empty.
 */
export type DataTableRowActionsType<Row> = (row: Row) => ReadonlyArray<DataTableActionType>

/**
 * DataTableSortDirectionType
 *
 * Values:
 * - "ascending": smallest first
 * - "descending": largest first
 */
export type DataTableSortDirectionType = "ascending" | "descending"

/**
 * DataTableSortType
 *
 * The sorted column and its direction. Rows sort within each set of siblings, so children stay
 * under their parent.
 */
export type DataTableSortType = {
  columnId: string
  direction: DataTableSortDirectionType
}

/**
 * DataTableOnSortChangeType
 *
 * Called when a sortable column header is clicked: ascending, then descending, then unsorted.
 */
export type DataTableOnSortChangeType = (sort: DataTableSortType | undefined) => void

/**
 * DataTableLoadingType
 *
 * Whether the rows are loading: the body shows a loading row and the grid is `aria-busy`.
 */
export type DataTableLoadingType = boolean

/**
 * DataTableEmptyType
 *
 * The content of the body when there are no rows.
 */
export type DataTableEmptyType = React.ReactNode

/**
 * DataTableMaxHeightType
 *
 * The table's maximum height, from the `datatable.maxHeight` tokens; past it the body scrolls
 * under a sticky header.
 *
 * Values:
 * - "none": the table grows with its rows (default)
 * - "small" | "base" | "large": capped
 */
export type DataTableMaxHeightType = "none" | "small" | "base" | "large"

/**
 * DataTableChildDensityType
 *
 * The nested rows' density.
 *
 * Values:
 * - "base": every row at every depth looks the same (default)
 * - "compact": nested rows step down one size in padding and text
 */
export type DataTableChildDensityType = "base" | "compact"

/**
 * DataTableProps
 *
 * Complete prop definition for the DataTable component.
 */
export interface DataTableProps<Row> {
  /** Accessible name of the table */
  "aria-label": string

  /** The columns, in order */
  columns: DataTableColumnsType<Row>

  /** The top-level rows */
  rows: DataTableRowsType<Row>

  /** A row's id, unique across the table */
  getRowId: DataTableGetRowIdType<Row>

  /** A row's name for accessible labels; unset, the id */
  getRowLabel?: DataTableGetRowLabelType<Row>

  /** A row's nested rows */
  getRowChildren?: DataTableGetRowChildrenType<Row>

  /** Open rows (controlled) */
  expandedIds?: DataTableExpandedIdsType

  /** Initially open rows (uncontrolled) */
  defaultExpandedIds?: DataTableDefaultExpandedIdsType

  /** Expand and collapse handler */
  onExpandedChange?: DataTableOnExpandedChangeType

  /** Rows can be selected */
  selectable?: DataTableSelectableType

  /** Selected rows (controlled) */
  selectedIds?: DataTableSelectedIdsType

  /** Initially selected rows (uncontrolled) */
  defaultSelectedIds?: DataTableSelectedIdsType

  /** Selection handler */
  onSelectedChange?: DataTableOnSelectedChangeType

  /** Actions for the selected rows */
  bulkActions?: DataTableBulkActionsType<Row>

  /** Actions for one row */
  rowActions?: DataTableRowActionsType<Row>

  /** Sorted column (controlled) */
  sort?: DataTableSortType

  /** Initially sorted column (uncontrolled) */
  defaultSort?: DataTableSortType

  /** Sort handler */
  onSortChange?: DataTableOnSortChangeType

  /** Rows are loading */
  loading?: DataTableLoadingType

  /** Body content when there are no rows */
  empty?: DataTableEmptyType

  /** Maximum height; past it the body scrolls under a sticky header */
  maxHeight?: DataTableMaxHeightType

  /** The nested rows' density (default "base", as top-level rows) */
  childDensity?: DataTableChildDensityType
}

const DataTableTypes = {} as const

namespace DataTableTypes {
  export type RowId = DataTableRowIdType
  export type CellContext = DataTableCellContextType
  export type ColumnAlign = DataTableColumnAlignType
  export type ColumnWidth = DataTableColumnWidthType
  export type SortValue<Row> = DataTableSortValueType<Row>
  export type Column<Row> = DataTableColumnType<Row>
  export type Columns<Row> = DataTableColumnsType<Row>
  export type Rows<Row> = DataTableRowsType<Row>
  export type GetRowId<Row> = DataTableGetRowIdType<Row>
  export type GetRowLabel<Row> = DataTableGetRowLabelType<Row>
  export type GetRowChildren<Row> = DataTableGetRowChildrenType<Row>
  export type ExpandedIds = DataTableExpandedIdsType
  export type DefaultExpandedIds = DataTableDefaultExpandedIdsType
  export type ToggleEvent = DataTableToggleEventType
  export type OnExpandedChange = DataTableOnExpandedChangeType
  export type Selectable = DataTableSelectableType
  export type SelectedIds = DataTableSelectedIdsType
  export type OnSelectedChange = DataTableOnSelectedChangeType
  export type Action = DataTableActionType
  export type BulkActions<Row> = DataTableBulkActionsType<Row>
  export type RowActions<Row> = DataTableRowActionsType<Row>
  export type SortDirection = DataTableSortDirectionType
  export type Sort = DataTableSortType
  export type OnSortChange = DataTableOnSortChangeType
  export type Loading = DataTableLoadingType
  export type Empty = DataTableEmptyType
  export type MaxHeight = DataTableMaxHeightType
  export type ChildDensity = DataTableChildDensityType
  export type Props<Row> = DataTableProps<Row>
}

export default DataTableTypes
