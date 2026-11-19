import * as React from "react"
import Checkbox from "@niceprototypes/checkbox"
import Icon from "@niceprototypes/icon"
import { TableCell, TableRow } from "@niceprototypes/table"
import {
  StyledDataTableActions,
  StyledDataTableCheckbox,
  StyledDataTableExpander,
  StyledDataTableExpanderSlot,
} from "./DataTable.styles"
import { MenuButton } from "@niceprototypes/menu"
import type {
  DataTableChildDensityType,
  DataTableColumnType,
  DataTableRowActionsType,
  DataTableToggleEventType,
} from "./DataTable.types"
import type { SelectionStoreType } from "../../utilities/createSelectionStore"

/** What every row shares: one object per table, stable across expand and selection changes. */
export type DataTableRowContextType<Row> = {
  columns: ReadonlyArray<DataTableColumnType<Row>>
  treeColumn: number
  nested: boolean
  childDensity: DataTableChildDensityType
  selectable: boolean
  store: SelectionStoreType
  getRowLabel: (row: Row) => string
  rowActions?: DataTableRowActionsType<Row>
  toggle: (id: string, event?: DataTableToggleEventType) => void
  select: (id: string) => void
}

/** One body row. Props are primitives plus the row and the shared context, so memo holds. */
type DataTableRowProps<Row> = {
  row: Row
  id: string
  rowIndex: number
  depth: number
  posinset: number
  setsize: number
  last: boolean
  /** Ancestor lines as "1"/"0" per level, so the prop stays a primitive. */
  continues: string
  hasChildren: boolean
  expanded: boolean
  context: DataTableRowContextType<Row>
}

const NOOP = () => {}

function DataTableRow<Row>({
  row,
  id,
  rowIndex,
  depth,
  posinset,
  setsize,
  last,
  continues,
  hasChildren,
  expanded,
  context,
}: DataTableRowProps<Row>) {
  const { columns, treeColumn, nested, childDensity, selectable, store, getRowLabel, rowActions, toggle, select } = context
  // Only this row re-renders when its own selection state changes.
  const selection = React.useSyncExternalStore(store.subscribe, () => (selectable ? store.rowState(id) : "unchecked"))
  const label = getRowLabel(row)
  const cellContext = React.useMemo(
    () => ({ depth, expanded, hasChildren, toggle: hasChildren ? () => toggle(id) : NOOP }),
    [depth, expanded, hasChildren, toggle, id],
  )
  const guide = React.useMemo(
    () => ({ depth, last, continues: Array.from(continues, flag => flag === "1") }),
    [depth, last, continues],
  )
  const actions = rowActions?.(row)

  return (
    <TableRow
      tabIndex={-1}
      density={depth > 0 ? childDensity : "base"}
      divider={depth === 0}
      aria-rowindex={rowIndex}
      aria-level={depth + 1}
      aria-posinset={posinset}
      aria-setsize={setsize}
      aria-expanded={hasChildren ? expanded : undefined}
      aria-selected={selectable ? selection === "checked" : undefined}
    >
      {selectable ? (
        <TableCell tabIndex={-1}>
          <StyledDataTableCheckbox>
            <Checkbox
              size="small"
              checked={selection === "checked"}
              indeterminate={selection === "mixed"}
              onChange={() => select(id)}
              aria-label={`Select ${label}`}
            />
          </StyledDataTableCheckbox>
        </TableCell>
      ) : null}
      {columns.map((column, index) =>
        index === treeColumn ? (
          <TableCell key={column.id} role="rowheader" tabIndex={-1} align={column.align} guide={nested ? guide : undefined}>
            {hasChildren ? (
              <StyledDataTableExpander
                type="button"
                tabIndex={-1}
                aria-label={label}
                aria-expanded={expanded}
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => toggle(id, event)}
              >
                <Icon name={expanded ? "carat-bottom" : "carat-right"} />
              </StyledDataTableExpander>
            ) : nested ? (
              <StyledDataTableExpanderSlot />
            ) : null}
            {column.cell(row, cellContext)}
          </TableCell>
        ) : (
          <TableCell key={column.id} tabIndex={-1} align={column.align}>
            {column.cell(row, cellContext)}
          </TableCell>
        ),
      )}
      {rowActions ? (
        <TableCell tabIndex={-1} align="end">
          {actions?.length ? (
            <StyledDataTableActions>
              <MenuButton items={actions} aria-label={`Actions for ${label}`} ghost size="smaller" align="end" />
            </StyledDataTableActions>
          ) : null}
        </TableCell>
      ) : null}
    </TableRow>
  )
}

export default React.memo(DataTableRow) as typeof DataTableRow
