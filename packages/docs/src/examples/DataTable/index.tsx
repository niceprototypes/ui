// DataTable example configs: one ComponentExample per facet. ComponentDocs renders each entry as a
// section of the DataTable docs page, sorted by name.
import type * as React from "react"
import { useState } from "react"
import Badge from "@niceprototypes/badge"
import DataTable, { type DataTableColumnType, type DataTableSortType } from "@niceprototypes/datatable"
import Flex from "@niceprototypes/flex"
import Ink from "@niceprototypes/ink"
import type { ComponentExample } from "../../dataTables/components/demos/Components"

type PortRow = { id: string; name: string; port?: number; running?: boolean; items?: PortRow[] }

const ROWS: PortRow[] = [
  {
    id: "studio",
    name: "animation-studio",
    items: [
      { id: "4012", name: "owner instance", port: 4012, running: true },
      { id: "4013", name: "store registry", port: 4013, running: false },
    ],
  },
  { id: "4020", name: "docs", port: 4020, running: true },
]

const COLUMNS: DataTableColumnType<PortRow>[] = [
  { id: "name", header: "Project", rowHeader: true, cell: row => row.name, sortValue: row => row.name },
  { id: "port", header: "Port", width: "small", align: "end", cell: row => row.port ?? null, sortValue: row => row.port ?? 0 },
  {
    id: "state",
    header: "State",
    width: "small",
    cell: row => (row.running === undefined ? null : <Badge status={row.running ? "success" : "base"} label={row.running ? "running" : "stopped"} />),
  },
]

const BASE = {
  "aria-label": "Ports",
  columns: COLUMNS,
  rows: ROWS,
  getRowId: (row: PortRow) => row.id,
  getRowLabel: (row: PortRow) => row.name,
  getRowChildren: (row: PortRow) => row.items,
}

const ROWS_CODE = `const rows = [
  {
    id: "studio",
    name: "animation-studio",
    items: [
      { id: "4012", name: "owner instance", port: 4012, running: true },
      { id: "4013", name: "store registry", port: 4013, running: false },
    ],
  },
  { id: "4020", name: "docs", port: 4020, running: true },
]

const columns = [
  { id: "name", header: "Project", rowHeader: true, cell: row => row.name, sortValue: row => row.name },
  { id: "port", header: "Port", width: "small", align: "end", cell: row => row.port ?? null, sortValue: row => row.port ?? 0 },
  { id: "state", header: "State", width: "small", cell: row => row.running === undefined ? null : <Badge … /> },
]`

const tableCode = (extra: string) =>
  `${ROWS_CODE}\n\n<DataTable\n  aria-label="Ports"\n  columns={columns}\n  rows={rows}\n  getRowId={row => row.id}\n  getRowLabel={row => row.name}\n  getRowChildren={row => row.items}${extra}\n/>`

/** Shows what the last action received. */
const Reporting = ({ children }: { children: (report: (text: string) => void) => React.ReactNode }) => {
  const [last, setLast] = useState("Choose an action")
  return (
    <Flex direction="column" gap="small">
      {children(setLast)}
      <Ink size="small">{last}</Ink>
    </Flex>
  )
}

/** A controlled sort, so the example shows what onSortChange receives. */
const SortedTable = () => {
  const [sort, setSort] = useState<DataTableSortType | undefined>({ columnId: "port", direction: "descending" })
  return (
    <Flex direction="column" gap="small">
      <DataTable {...BASE} defaultExpandedIds="all" sort={sort} onSortChange={setSort} />
      <Ink size="small">{`sort: ${JSON.stringify(sort)}`}</Ink>
    </Flex>
  )
}

export const dataTableGetRowChildren = {
  name: "getRowChildren",
  description:
    "Nested rows: a row's children share its columns, open under it on the caret and hang from the TreeGuide lines, one size more compact. A cell can return null where its value belongs to the parent.",
  variants: ["collapsed", "all open"],
  default: "collapsed",
  preview: (variant: string) => <DataTable {...BASE} defaultExpandedIds={variant === "all open" ? "all" : undefined} />,
  code: (variant: string) => tableCode(variant === "all open" ? `\n  defaultExpandedIds="all"` : ""),
} satisfies ComponentExample

export const dataTableSelectable = {
  name: "selectable",
  description:
    "A checkbox column and a select-all header. Selecting a parent selects its descendants. While rows are selected, a bar shows the count and the bulkActions menu.",
  variants: ["selection and bulk actions"],
  default: "selection and bulk actions",
  preview: () => (
    <Reporting>
      {report => (
        <DataTable
          {...BASE}
          defaultExpandedIds="all"
          selectable
          bulkActions={rows => [
            { id: "start", label: "Start", onSelect: () => report(`Start ${rows.map(row => row.id).join(", ")}`) },
            { id: "stop", label: "Stop", onSelect: () => report(`Stop ${rows.map(row => row.id).join(", ")}`) },
          ]}
        />
      )}
    </Reporting>
  ),
  code: () =>
    tableCode(
      `\n  selectable\n  bulkActions={rows => [\n    { id: "start", label: "Start", onSelect: () => start(rows) },\n    { id: "stop", label: "Stop", onSelect: () => stop(rows) },\n  ]}`,
    ),
} satisfies ComponentExample

export const dataTableRowActions = {
  name: "rowActions",
  description: "A row's actions, in a menu opened from the menu-icon button at the row's end. A disabled action shows but cannot be chosen.",
  variants: ["menu"],
  default: "menu",
  preview: () => (
    <Reporting>
      {report => (
        <DataTable
          {...BASE}
          defaultExpandedIds="all"
          rowActions={row => [
            { id: "start", label: "Start", disabled: row.running !== false, onSelect: () => report(`Start ${row.id}`) },
            { id: "stop", label: "Stop", disabled: row.running !== true, onSelect: () => report(`Stop ${row.id}`) },
          ]}
        />
      )}
    </Reporting>
  ),
  code: () =>
    tableCode(
      `\n  rowActions={row => [\n    { id: "start", label: "Start", disabled: row.running, onSelect: () => start(row) },\n    { id: "stop", label: "Stop", disabled: !row.running, onSelect: () => stop(row) },\n  ]}`,
    ),
} satisfies ComponentExample

export const dataTableSort = {
  name: "sort",
  description:
    "A column with sortValue sorts from its header: ascending, descending, unsorted. Rows sort within each set of siblings, so children stay under their parent.",
  variants: ["controlled"],
  default: "controlled",
  preview: () => <SortedTable />,
  code: () => `const [sort, setSort] = useState({ columnId: "port", direction: "descending" })\n\n${tableCode(`\n  sort={sort}\n  onSortChange={setSort}`)}`,
} satisfies ComponentExample

export const dataTableStates = {
  name: "loading and empty",
  description: "loading shows a loading row and marks the grid busy; empty fills the body when there are no rows.",
  variants: ["loading", "empty"],
  default: "loading",
  preview: (variant: string) =>
    variant === "loading" ? <DataTable {...BASE} loading /> : <DataTable {...BASE} rows={[]} empty="No ports" />,
  code: (variant: string) => (variant === "loading" ? tableCode(`\n  loading`) : tableCode(`\n  empty="No ports"`).replace("rows={rows}", "rows={[]}")),
} satisfies ComponentExample

export const dataTableKeyboard = {
  name: "keyboard",
  description:
    "The WAI-ARIA treegrid keyboard model. Row focus: Up/Down move, Right opens or enters the row, Left closes or climbs to the parent, Home/End, Enter toggles, Space selects. Cell focus: arrows move between cells (the header row included), Home/End within the row, Ctrl+Home/End within the column. One element is in the tab order at a time.",
  variants: ["try it"],
  default: "try it",
  preview: () => <DataTable {...BASE} selectable rowActions={() => [{ id: "open", label: "Open", onSelect: () => {} }]} />,
  code: () => tableCode(`\n  selectable\n  rowActions={row => [{ id: "open", label: "Open", onSelect: () => open(row) }]}`),
} satisfies ComponentExample

/** Every DataTable example facet: each one a section of the DataTable docs page. */
export const dataTableExamples = {
  getRowChildren: dataTableGetRowChildren,
  selectable: dataTableSelectable,
  rowActions: dataTableRowActions,
  sort: dataTableSort,
  states: dataTableStates,
  keyboard: dataTableKeyboard,
} satisfies Record<string, ComponentExample>
