import * as React from "react"
import Checkbox from "@niceprototypes/checkbox"
import Icon from "@niceprototypes/icon"
import { TableCell, TableHeader } from "@niceprototypes/table"
import { StyledDataTableCheckbox, StyledDataTableSortButton } from "./DataTable.styles"
import type { DataTableColumnType, DataTableSortType } from "./DataTable.types"
import type { SelectionStoreType } from "../../utilities/createSelectionStore"
import { TreeExpanderSlot } from "@niceprototypes/tree"

/** The select-all checkbox: it re-renders on its own when the selection changes. */
const SelectAll = ({ store, onToggle }: { store: SelectionStoreType; onToggle: () => void }) => {
  const state = React.useSyncExternalStore(store.subscribe, store.allState)
  return (
    <StyledDataTableCheckbox>
      <Checkbox
        size="small"
        checked={state === "checked"}
        indeterminate={state === "mixed"}
        onChange={onToggle}
        aria-label="Select all rows"
      />
    </StyledDataTableCheckbox>
  )
}

/**
 * The header row: the select-all checkbox, each column's header (a sort button when the column
 * has a `sortValue`, with `aria-sort` on the sorted one) and the actions header. In a nested table the
 * tree column's header keeps the expander's place, so it lines up with the row labels.
 */
function DataTableHeader<Row>({
  columns,
  treeColumn,
  nested,
  selectable,
  rowActions,
  store,
  sort,
  onSort,
  onSelectAll,
}: {
  columns: ReadonlyArray<DataTableColumnType<Row>>
  treeColumn: number
  nested: boolean
  selectable: boolean
  rowActions: boolean
  store: SelectionStoreType
  sort?: DataTableSortType
  onSort: (columnId: string) => void
  onSelectAll: () => void
}) {
  return (
    <TableHeader>
      {selectable ? (
        <TableCell role="columnheader" tabIndex={-1}>
          <SelectAll store={store} onToggle={onSelectAll} />
        </TableCell>
      ) : null}
      {columns.map((column, index) => {
        const sorted = sort?.columnId === column.id ? sort.direction : undefined
        return (
          <TableCell
            key={column.id}
            role="columnheader"
            tabIndex={-1}
            align={column.align}
            aria-sort={sorted}
          >
            {nested && index === treeColumn ? <TreeExpanderSlot /> : null}
            {column.sortValue ? (
              <StyledDataTableSortButton type="button" tabIndex={-1} onClick={() => onSort(column.id)}>
                {column.header}
                {sorted ? <Icon name={sorted === "ascending" ? "carat-top" : "carat-bottom"} size="small" /> : null}
              </StyledDataTableSortButton>
            ) : (
              column.header
            )}
          </TableCell>
        )
      })}
      {rowActions ? <TableCell role="columnheader" tabIndex={-1} aria-label="Actions" /> : null}
    </TableHeader>
  )
}

export default DataTableHeader
