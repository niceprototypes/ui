import * as React from "react"
import Ink from "@niceprototypes/ink"
import { MenuButton } from "@niceprototypes/menu"
import Icon from "@niceprototypes/icon"
import { Table, TableCell, TableRow, type TableColumnWidthType } from "@niceprototypes/table"
import { getTreeRows } from "@niceprototypes/tree"
import { StyledDataTableToolbar } from "./DataTable.styles"
import DataTableHeader from "./DataTableHeader"
import DataTableRow, { type DataTableRowContextType } from "./DataTableRow"
import type { DataTableProps, DataTableSortType, DataTableToggleEventType } from "./DataTable.types"
import { createSelectionStore, getSelectionIndex } from "../../utilities/createSelectionStore"
import { sortRows } from "../../utilities/sortRows"
import {
  findByPosition,
  getDefaultTarget,
  getFocusPosition,
  getKeyTarget,
  syncTabIndex,
  type FocusPositionType,
} from "../../utilities/treegridFocus"

/** The bulk actions trigger's text while no row is selected. */
const NONE_SELECTED = "None selected"

/** Every row id under `rows`, for "all" expanded. */
const allParentIds = <Row,>(
  rows: ReadonlyArray<Row>,
  getId: (row: Row) => string,
  getChildren?: (row: Row) => ReadonlyArray<Row> | undefined,
): string[] =>
  rows.flatMap(row => {
    const children = getChildren?.(row)
    return children?.length ? [getId(row), ...allParentIds(children, getId, getChildren)] : []
  })

/**
 * The bulk actions bar, always rendered so selecting never moves the grid: one select-look
 * MenuButton, ghost and disabled reading "None selected", or outlined (the Checkbox's border and
 * hover border) reading "N selected"; its menu lists the bulk actions. Actions are commands, so it is a menu button (menuitems), not a listbox.
 * Re-renders on its own when the selection changes.
 */
function DataTableToolbar<Row>({
  store,
  bulkActions,
  rowsById,
}: {
  store: ReturnType<typeof createSelectionStore>
  bulkActions: NonNullable<DataTableProps<Row>["bulkActions"]>
  rowsById: Map<string, Row>
}) {
  const count = React.useSyncExternalStore(store.subscribe, store.leafCount)
  const selectedRows = count ? store.selectedIds().flatMap(id => (rowsById.has(id) ? [rowsById.get(id) as Row] : [])) : []
  const label = count ? `${count} selected` : undefined
  return (
    <StyledDataTableToolbar>
      <MenuButton
        appearance="select"
        ghost={count === 0}
        size="small"
        label={label}
        placeholder={NONE_SELECTED}
        aria-label={`${label ?? NONE_SELECTED}, bulk actions`}
        disabled={count === 0}
        items={count ? bulkActions(selectedRows) : []}
      />
    </StyledDataTableToolbar>
  )
}

/**
 * DataTable
 *
 * A data table whose rows nest: children share their parent's columns, open under it on a
 * caret expander and hang from TreeGuide lines. Built on @niceprototypes/table (a CSS subgrid
 * with the WAI-ARIA treegrid roles). It adds the data layer: column definitions, nested rows
 * (`getRowChildren`), expansion, sorting within each set of siblings, selection with a
 * select-all checkbox and bulk actions, a row actions menu (the menu icon), loading and empty
 * states, and the APG treegrid keyboard model with roving focus. Expansion, selection and sort
 * are each controlled or uncontrolled. Rows re-render only when their own state changes.
 *
 * @example
 * ```tsx
 * <DataTable
 *   aria-label="Ports"
 *   columns={[
 *     { id: "name", header: "Project", cell: row => row.name, rowHeader: true },
 *     { id: "port", header: "Port", cell: row => row.port, align: "end", sortValue: row => row.port },
 *   ]}
 *   rows={projects}
 *   getRowId={row => row.id}
 *   getRowChildren={row => row.children}
 *   selectable
 *   bulkActions={rows => [{ id: "start", label: "Start", onSelect: () => start(rows) }]}
 *   rowActions={row => [{ id: "stop", label: "Stop", onSelect: () => stop(row) }]}
 * />
 * ```
 */
function DataTable<Row>({
  "aria-label": ariaLabel,
  columns,
  rows,
  getRowId,
  getRowLabel,
  getRowChildren,
  expandedIds: expandedIdsProp,
  defaultExpandedIds,
  onExpandedChange,
  selectable = false,
  selectedIds: selectedIdsProp,
  defaultSelectedIds,
  onSelectedChange,
  bulkActions,
  rowActions,
  sort: sortProp,
  defaultSort,
  onSortChange,
  loading = false,
  empty = "No rows",
  maxHeight = "none",
  childDensity = "base",
}: DataTableProps<Row>) {
  const gridRef = React.useRef<HTMLDivElement>(null)

  // Expansion, controlled or not; "all" resolves once against the first rows.
  const [internalExpandedIds, setInternalExpandedIds] = React.useState<readonly string[]>(() =>
    defaultExpandedIds === "all" ? allParentIds(rows, getRowId, getRowChildren) : (defaultExpandedIds ?? []),
  )
  const expandedIds = expandedIdsProp ?? internalExpandedIds

  // Sort, controlled or not.
  const [internalSort, setInternalSort] = React.useState<DataTableSortType | undefined>(defaultSort)
  const sort = sortProp ?? internalSort

  // Flatten once per rows / expansion / sort: rows sorted within siblings, then the visible tree.
  const sorted = React.useMemo(() => sortRows(rows, getRowChildren, columns, sort), [rows, getRowChildren, columns, sort])
  const visible = React.useMemo(
    () => getTreeRows(sorted.rows, { getId: getRowId, getChildren: sorted.getChildren, expandedIds }),
    [sorted, getRowId, expandedIds],
  )
  const nested = React.useMemo(() => rows.some(row => Boolean(getRowChildren?.(row)?.length)), [rows, getRowChildren])
  const treeColumn = Math.max(0, columns.findIndex(column => column.rowHeader))

  // Every row by id (collapsed ones included), for bulk actions.
  const rowsById = React.useMemo(() => {
    const map = new Map<string, Row>()
    const walk = (level: ReadonlyArray<Row>) =>
      level.forEach(row => {
        map.set(getRowId(row), row)
        const children = getRowChildren?.(row)
        if (children) walk(children)
      })
    walk(rows)
    return map
  }, [rows, getRowId, getRowChildren])

  // Selection lives in a store, so a toggle re-renders only the rows whose state changed.
  const [store] = React.useState(createSelectionStore)
  React.useMemo(() => store.setIndex(getSelectionIndex(rows, getRowId, getRowChildren)), [store, rows, getRowId, getRowChildren])
  const [initialSelected] = React.useState(() => defaultSelectedIds ?? [])
  React.useLayoutEffect(() => {
    store.set(selectedIdsProp ?? initialSelected)
    // Controlled: follow the prop. Uncontrolled: seed once; later changes come from setSelected.
  }, [store, selectedIdsProp, initialSelected])

  // Latest values for the stable callbacks below.
  const latest = React.useRef({ expandedIds, expandedIdsProp, onExpandedChange, selectedIdsProp, onSelectedChange, visible })
  latest.current = { expandedIds, expandedIdsProp, onExpandedChange, selectedIdsProp, onSelectedChange, visible }

  const setExpanded = React.useCallback((id: string, open: boolean, event?: DataTableToggleEventType) => {
    const { expandedIds: current, expandedIdsProp: controlled, onExpandedChange: report } = latest.current
    if (current.includes(id) === open) return
    const next = open ? [...current, id] : current.filter(entry => entry !== id)
    if (controlled === undefined) setInternalExpandedIds(next)
    report?.(next, event)
  }, [])

  const toggle = React.useCallback(
    (id: string, event?: DataTableToggleEventType) => setExpanded(id, !latest.current.expandedIds.includes(id), event),
    [setExpanded],
  )

  const setSelected = React.useCallback(
    (next: string[]) => {
      if (latest.current.selectedIdsProp === undefined) store.set(next)
      latest.current.onSelectedChange?.(next)
    },
    [store],
  )
  const select = React.useCallback((id: string) => setSelected(store.toggled(id)), [setSelected, store])
  const selectAll = React.useCallback(() => setSelected(store.toggledAll()), [setSelected, store])

  const onSort = (columnId: string) => {
    const next: DataTableSortType | undefined =
      sort?.columnId !== columnId
        ? { columnId, direction: "ascending" }
        : sort.direction === "ascending"
          ? { columnId, direction: "descending" }
          : undefined
    if (sortProp === undefined) setInternalSort(next)
    onSortChange?.(next)
  }

  const context = React.useMemo<DataTableRowContextType<Row>>(
    () => ({
      columns,
      treeColumn,
      nested,
      childDensity,
      selectable,
      store,
      getRowLabel: getRowLabel ?? getRowId,
      rowActions,
      toggle,
      select,
    }),
    [columns, treeColumn, nested, childDensity, selectable, store, getRowLabel, getRowId, rowActions, toggle, select],
  )

  // Roving focus: one element in the tab order, kept across re-renders by its position.
  const focus = React.useRef<FocusPositionType | null>(null)
  React.useLayoutEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    const current = (focus.current && findByPosition(grid, focus.current)) || getDefaultTarget(grid)
    syncTabIndex(grid, current)
  })

  const onFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    const grid = gridRef.current
    const target = event.target as HTMLElement
    if (!grid || !grid.contains(target)) return
    focus.current = getFocusPosition(target)
    syncTabIndex(grid, target)
  }

  const idAt = (rowIndex: number) => latest.current.visible[rowIndex - 2]?.id
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const grid = gridRef.current
    if (!grid || !grid.contains(event.target as Node)) return
    const target = getKeyTarget(grid, event, {
      setExpanded: (rowIndex, open, keyEvent) => {
        const id = idAt(rowIndex)
        if (id) setExpanded(id, open, keyEvent)
      },
      toggleSelected: selectable
        ? rowIndex => {
            const id = idAt(rowIndex)
            if (id) select(id)
          }
        : undefined,
    })
    if (!target) return
    event.preventDefault()
    target.focus()
  }

  const columnWidths: TableColumnWidthType[] = [
    ...(selectable ? (["fit"] as const) : []),
    ...columns.map(column => column.width ?? "base"),
    ...(rowActions ? (["fit"] as const) : []),
  ]

  const body = loading ? (
    <TableRow aria-rowindex={2}>
      <TableCell span="full">
        <Icon name="spinner" animation="spin" size="small" />
        <Ink color="lighter">Loading</Ink>
      </TableCell>
    </TableRow>
  ) : visible.length === 0 ? (
    <TableRow aria-rowindex={2}>
      <TableCell span="full">{empty}</TableCell>
    </TableRow>
  ) : (
    visible.map((row, index) => (
      <DataTableRow
        key={row.id}
        row={row.item}
        id={row.id}
        rowIndex={index + 2}
        depth={row.depth}
        posinset={row.posinset}
        setsize={row.setsize}
        last={row.guide.last}
        continues={row.guide.continues.map(flag => (flag ? "1" : "0")).join("")}
        hasChildren={row.hasChildren}
        expanded={row.expanded}
        context={context}
      />
    ))
  )

  return (
    <Table
      ref={gridRef}
      role="treegrid"
      aria-label={ariaLabel}
      aria-rowcount={(loading || visible.length === 0 ? 1 : visible.length) + 1}
      aria-multiselectable={selectable || undefined}
      aria-busy={loading}
      columnWidths={columnWidths}
      maxHeight={maxHeight}
      toolbar={selectable && bulkActions ? <DataTableToolbar store={store} bulkActions={bulkActions} rowsById={rowsById} /> : undefined}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
    >
      <DataTableHeader
        columns={columns}
        treeColumn={treeColumn}
        nested={nested}
        selectable={selectable}
        rowActions={Boolean(rowActions)}
        store={store}
        sort={sort}
        onSort={onSort}
        onSelectAll={selectAll}
      />
      {body}
    </Table>
  )
}

export default DataTable
