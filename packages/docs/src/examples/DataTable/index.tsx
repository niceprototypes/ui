// DataTable example configs: one ComponentExample per facet. ComponentDocs renders each entry as a
// section of the DataTable docs page: the facets named for a prop under that prop, the others under
// Examples. Every table shows the port directory's reservations (./samples).
import type * as React from "react"
import { useState } from "react"
import Button from "@niceprototypes/button"
import DataTable, { type DataTableMaxHeightType, type DataTableSortType } from "@niceprototypes/datatable"
import Flex from "@niceprototypes/flex"
import Ink from "@niceprototypes/ink"
import { BASE, COLUMNS, cutRows, DATA_CODE, leafRows, MORE_ROWS, ROWS, tableCode, type PortRow } from "./samples"
import type { ComponentExample } from "../../dataTables/components/demos/Components"

/** Shows the last report under the table. */
const Reporting = ({ initial, children }: { initial: string; children: (report: (text: string) => void) => React.ReactNode }) => {
  const [last, setLast] = useState(initial)
  return (
    <Flex direction="column" gap="small">
      {children(setLast)}
      <Ink size="small">{last}</Ink>
    </Flex>
  )
}

const names = (rows: PortRow[]) => rows.map(row => row.name).join(", ")

/** The columns facet's variants: which columns show. */
const COLUMN_SETS: Record<string, typeof COLUMNS> = {
  "text, number and status": COLUMNS,
  "text and number": COLUMNS.slice(0, 2),
}

export const dataTableColumns = {
  name: "columns",
  description:
    "Each column's header, cell renderer, width (a datatable.column.width token), alignment and optional sortValue. The rowHeader column carries the guide lines and the expander. A cell renders text or a status Badge; returning null leaves it empty, as on group rows whose state belongs to their children.",
  variants: Object.keys(COLUMN_SETS),
  default: "text, number and status",
  preview: (variant: string) => <DataTable {...BASE} columns={COLUMN_SETS[variant]} defaultExpandedIds="all" />,
  code: (variant: string) =>
    variant === "text, number and status"
      ? `${tableCode(`defaultExpandedIds="all"`)}\n\n${DATA_CODE}`
      : `${tableCode(`defaultExpandedIds="all"`).replace("columns={columns}", "columns={columns.slice(0, 2)}")}\n\n${DATA_CODE}`,
} satisfies ComponentExample

/** The getRowChildren facet's rows per variant. */
const LEVELS: Record<string, PortRow[]> = {
  "1 level (no children)": leafRows(ROWS),
  "2 levels": cutRows(ROWS, 2),
  "3 levels": cutRows(ROWS, 3),
  "4 levels": ROWS,
}

export const dataTableGetRowChildren = {
  name: "getRowChildren",
  description:
    "Nested rows, to any depth: a row's children share its columns, open under it on the caret and hang from the TreeGuide lines, one size more compact. Without it (or for a row it returns nothing for) the row is a leaf.",
  variants: Object.keys(LEVELS),
  default: "1 level (no children)",
  preview: (variant: string) =>
    variant === "1 level (no children)" ? (
      <DataTable {...BASE} rows={LEVELS[variant]} getRowChildren={undefined} />
    ) : (
      <DataTable {...BASE} rows={LEVELS[variant]} defaultExpandedIds="all" />
    ),
  code: (variant: string) =>
    variant === "1 level (no children)"
      ? tableCode().replace("\n  getRowChildren={row => row.items}", "").replace("rows={rows}", "rows={ports}")
      : tableCode(`defaultExpandedIds="all"`),
} satisfies ComponentExample

export const dataTableGetRowLabel = {
  name: "getRowLabel",
  description:
    "A row's name for the accessible names of its expander, checkbox (\"Select animation-studio\") and actions button (\"Actions for animation-studio\"); unset, the id.",
  variants: ["name"],
  default: "name",
  preview: () => <DataTable {...BASE} selectable rowActions={() => [{ id: "open", label: "Open", onSelect: () => {} }]} />,
  code: () => tableCode(`selectable`, `rowActions={row => [{ id: "open", label: "Open", onSelect: () => open(row) }]}`),
} satisfies ComponentExample

/** The defaultExpandedIds facet's values. */
const EXPANDED: Record<string, readonly string[] | "all" | undefined> = {
  "unset (all closed)": undefined,
  '["studio"]': ["studio"],
  '["studio", "main"]': ["studio", "main"],
  '"all"': "all",
}

export const dataTableDefaultExpandedIds = {
  name: "defaultExpandedIds",
  description: "The rows open at first while the table keeps its own open state; \"all\" opens every row. Children of a closed row stay hidden even when listed.",
  variants: Object.keys(EXPANDED),
  default: "unset (all closed)",
  preview: (variant: string) => <DataTable {...BASE} defaultExpandedIds={EXPANDED[variant]} />,
  code: (variant: string) => (EXPANDED[variant] === undefined ? tableCode() : tableCode(`defaultExpandedIds={${variant}}`)),
} satisfies ComponentExample

/** Every row id with children: what "Open all" opens. */
const groupIds = (rows: PortRow[]): string[] => rows.flatMap(row => (row.items ? [row.id, ...groupIds(row.items)] : []))

/** A table whose open rows are held outside it. */
const ControlledExpansion = () => {
  const [expanded, setExpanded] = useState<string[]>(["studio"])
  const [event, setEvent] = useState("none yet")
  return (
    <Flex direction="column" gap="small">
      <Flex gap="small">
        <Button onClick={() => setExpanded(groupIds(ROWS))}>Open all</Button>
        <Button onClick={() => setExpanded([])}>Close all</Button>
      </Flex>
      <DataTable
        {...BASE}
        expandedIds={expanded}
        onExpandedChange={(next, toggleEvent) => {
          setExpanded(next)
          setEvent(toggleEvent ? toggleEvent.type : "none")
        }}
      />
      <Ink size="small">{`expandedIds: ${JSON.stringify(expanded)} · last event: ${event}`}</Ink>
    </Flex>
  )
}

const CONTROLLED_EXPANSION_CODE = `const [expanded, setExpanded] = useState(["studio"])

${tableCode(`expandedIds={expanded}`, `onExpandedChange={(next, event) => setExpanded(next)}`)}
<Button onClick={() => setExpanded(allGroupIds)}>Open all</Button>
<Button onClick={() => setExpanded([])}>Close all</Button>`

export const dataTableExpandedIds = {
  name: "expandedIds",
  description: "The open rows, held by you: the table opens and closes rows only through onExpandedChange. The buttons set the list from outside.",
  variants: ["controlled"],
  default: "controlled",
  preview: () => <ControlledExpansion />,
  code: () => CONTROLLED_EXPANSION_CODE,
} satisfies ComponentExample

export const dataTableOnExpandedChange = {
  name: "onExpandedChange",
  description: "Called with the next open ids and the event behind the change: a click on an expander or a key on a row (Right, Left, Enter).",
  variants: ["report"],
  default: "report",
  preview: () => (
    <Reporting initial="Open or close a row">
      {report => <DataTable {...BASE} onExpandedChange={(next, event) => report(`${JSON.stringify(next)} · ${event?.type ?? "no event"}`)} />}
    </Reporting>
  ),
  code: () => tableCode(`onExpandedChange={(expandedIds, event) => log(expandedIds, event?.type)}`),
} satisfies ComponentExample

export const dataTableSelectable = {
  name: "selectable",
  description:
    "A checkbox column and a select-all header checkbox; Space selects the focused row. Selecting a parent selects every descendant; a parent with some descendants selected shows a mixed checkbox.",
  variants: ["closed", "all open"],
  default: "closed",
  preview: (variant: string) => <DataTable {...BASE} selectable defaultExpandedIds={variant === "all open" ? "all" : undefined} />,
  code: (variant: string) => (variant === "all open" ? tableCode(`selectable`, `defaultExpandedIds="all"`) : tableCode(`selectable`)),
} satisfies ComponentExample

/** The defaultSelectedIds facet's values. */
const SELECTED: Record<string, string[]> = {
  "one leaf": ["4020"],
  "every child of owner instance": ["4012", "4013"],
  "some children (mixed parents)": ["4012", "4112"],
}

export const dataTableDefaultSelectedIds = {
  name: "defaultSelectedIds",
  description: "The rows selected at first while the table keeps its own selection. A parent whose descendants are all listed shows checked; one with some listed shows mixed.",
  variants: Object.keys(SELECTED),
  default: "one leaf",
  preview: (variant: string) => <DataTable {...BASE} selectable defaultExpandedIds="all" defaultSelectedIds={SELECTED[variant]} />,
  code: (variant: string) => tableCode(`selectable`, `defaultExpandedIds="all"`, `defaultSelectedIds={${JSON.stringify(SELECTED[variant]).replace(/,/g, ", ")}}`),
} satisfies ComponentExample

/** A table whose selection is held outside it. */
const ControlledSelection = () => {
  const [selected, setSelected] = useState<string[]>(["4000"])
  return (
    <Flex direction="column" gap="small">
      <Flex gap="small">
        <Button onClick={() => setSelected(leafRows(ROWS).filter(row => row.state === "running").map(row => row.id))}>Select running</Button>
        <Button onClick={() => setSelected([])}>Clear</Button>
      </Flex>
      <DataTable {...BASE} defaultExpandedIds="all" selectable selectedIds={selected} onSelectedChange={setSelected} />
      <Ink size="small">{`selectedIds: ${JSON.stringify(selected)}`}</Ink>
    </Flex>
  )
}

export const dataTableSelectedIds = {
  name: "selectedIds",
  description: "The selected rows, held by you, with onSelectedChange. The buttons set the selection from outside.",
  variants: ["controlled"],
  default: "controlled",
  preview: () => <ControlledSelection />,
  code: () =>
    `const [selected, setSelected] = useState(["4000"])\n\n${tableCode(`defaultExpandedIds="all"`, `selectable`, `selectedIds={selected}`, `onSelectedChange={setSelected}`)}`,
} satisfies ComponentExample

export const dataTableOnSelectedChange = {
  name: "onSelectedChange",
  description: "Called with the next selected ids: the row's, its descendants' when it has children, or every row's from the select-all checkbox.",
  variants: ["report"],
  default: "report",
  preview: () => (
    <Reporting initial="Select a row">
      {report => <DataTable {...BASE} defaultExpandedIds="all" selectable onSelectedChange={ids => report(JSON.stringify(ids))} />}
    </Reporting>
  ),
  code: () => tableCode(`defaultExpandedIds="all"`, `selectable`, `onSelectedChange={ids => log(ids)}`),
} satisfies ComponentExample

export const dataTableBulkActions = {
  name: "bulkActions",
  description:
    "A bar above the table always holds one ghost, select-look menu button, so selecting moves nothing: disabled and reading \"None selected\" with no rows selected, \"N selected\" once there are. It opens a menu of these actions (commands, not values), built from the selected rows. A disabled action shows but cannot be chosen.",
  variants: ["none selected", "Start, Stop, Release", "with a disabled action"],
  default: "Start, Stop, Release",
  preview: (variant: string) => (
    <Reporting initial="Select rows, then choose an action">
      {report => (
        <DataTable
          {...BASE}
          defaultExpandedIds="all"
          selectable
          defaultSelectedIds={variant === "none selected" ? [] : ["4012", "4013"]}
          bulkActions={rows => [
            {
              id: "start",
              label: "Start",
              disabled: variant === "with a disabled action" && rows.every(row => row.state !== "stopped"),
              onSelect: () => report(`Start: ${names(rows)}`),
            },
            { id: "stop", label: "Stop", onSelect: () => report(`Stop: ${names(rows)}`) },
            { id: "release", label: "Release", onSelect: () => report(`Release: ${names(rows)}`) },
          ]}
        />
      )}
    </Reporting>
  ),
  code: (variant: string) =>
    tableCode(
      `defaultExpandedIds="all"`,
      `selectable`,
      variant === "none selected" ? `defaultSelectedIds={[]}` : `defaultSelectedIds={["4012", "4013"]}`,
      `bulkActions={rows => [\n    { id: "start", label: "Start",${variant === "with a disabled action" ? ` disabled: rows.every(row => row.state !== "stopped"),` : ""} onSelect: () => start(rows) },\n    { id: "stop", label: "Stop", onSelect: () => stop(rows) },\n    { id: "release", label: "Release", onSelect: () => release(rows) },\n  ]}`,
    ),
} satisfies ComponentExample

export const dataTableRowActions = {
  name: "rowActions",
  description:
    "A row's actions, in a menu opened from the menu-icon button at the row's end. Entries can be disabled per row; an empty list leaves the cell empty (here, the group rows).",
  variants: ["every row", "disabled by state", "leaves only"],
  default: "every row",
  preview: (variant: string) => (
    <Reporting initial="Open a row's menu and choose an action">
      {report => (
        <DataTable
          {...BASE}
          defaultExpandedIds="all"
          rowActions={row =>
            variant === "leaves only" && row.items
              ? []
              : [
                  {
                    id: "start",
                    label: "Start",
                    disabled: variant !== "every row" && row.state === "running",
                    onSelect: () => report(`Start ${row.name}`),
                  },
                  {
                    id: "stop",
                    label: "Stop",
                    disabled: variant !== "every row" && row.state !== "running",
                    onSelect: () => report(`Stop ${row.name}`),
                  },
                ]
          }
        />
      )}
    </Reporting>
  ),
  code: (variant: string) =>
    variant === "every row"
      ? tableCode(`defaultExpandedIds="all"`, `rowActions={row => [\n    { id: "start", label: "Start", onSelect: () => start(row) },\n    { id: "stop", label: "Stop", onSelect: () => stop(row) },\n  ]}`)
      : tableCode(
          `defaultExpandedIds="all"`,
          `rowActions={row =>${variant === "leaves only" ? " row.items ? [] :" : ""} [\n    { id: "start", label: "Start", disabled: row.state === "running", onSelect: () => start(row) },\n    { id: "stop", label: "Stop", disabled: row.state !== "running", onSelect: () => stop(row) },\n  ]}`,
        ),
} satisfies ComponentExample

/** The defaultSort facet's values. */
const SORTS: Record<string, DataTableSortType | undefined> = {
  unsorted: undefined,
  "Project ascending": { columnId: "name", direction: "ascending" },
  "Port descending": { columnId: "port", direction: "descending" },
  "State ascending": { columnId: "state", direction: "ascending" },
}

const sortCode = (sort: DataTableSortType) => `{ columnId: "${sort.columnId}", direction: "${sort.direction}" }`

export const dataTableDefaultSort = {
  name: "defaultSort",
  description:
    "The sorted column at first while the table keeps its own sort. A column with sortValue sorts from its header: ascending, descending, unsorted. Rows sort within each set of siblings, so children stay under their parent.",
  variants: Object.keys(SORTS),
  default: "unsorted",
  preview: (variant: string) => <DataTable {...BASE} defaultExpandedIds="all" defaultSort={SORTS[variant]} />,
  code: (variant: string) => {
    const sort = SORTS[variant]
    return sort ? tableCode(`defaultExpandedIds="all"`, `defaultSort={${sortCode(sort)}}`) : tableCode(`defaultExpandedIds="all"`)
  },
} satisfies ComponentExample

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

export const dataTableSort = {
  name: "sort",
  description: "The sorted column, held by you: a header click calls onSortChange with the next sort (ascending, descending, then undefined), shown under the table.",
  variants: ["controlled"],
  default: "controlled",
  preview: () => <SortedTable />,
  code: () =>
    `const [sort, setSort] = useState({ columnId: "port", direction: "descending" })\n\n${tableCode(`defaultExpandedIds="all"`, `sort={sort}`, `onSortChange={setSort}`)}`,
} satisfies ComponentExample

export const dataTableOnSortChange = {
  name: "onSortChange",
  description: "Called when a sortable header is clicked, with the next sort or undefined when it returns to unsorted.",
  variants: ["report"],
  default: "report",
  preview: () => (
    <Reporting initial="Click a column header">
      {report => <DataTable {...BASE} defaultExpandedIds="all" onSortChange={sort => report(JSON.stringify(sort ?? "unsorted"))} />}
    </Reporting>
  ),
  code: () => tableCode(`defaultExpandedIds="all"`, `onSortChange={sort => log(sort)}`),
} satisfies ComponentExample

export const dataTableLoading = {
  name: "loading",
  description: "The body shows a loading row and the grid is marked aria-busy; the rows are not drawn until it is false.",
  variants: ["no rows yet", "with rows"],
  default: "no rows yet",
  preview: (variant: string) => <DataTable {...BASE} rows={variant === "no rows yet" ? [] : ROWS} loading selectable />,
  code: (variant: string) =>
    variant === "no rows yet" ? tableCode(`selectable`, `loading`).replace("rows={rows}", "rows={[]}") : tableCode(`selectable`, `loading`),
} satisfies ComponentExample

export const dataTableEmpty = {
  name: "empty",
  description: "The body's content when there are no rows; unset, \"No rows\".",
  variants: ["unset", "No ports reserved"],
  default: "unset",
  preview: (variant: string) => <DataTable {...BASE} rows={[]} selectable empty={variant === "unset" ? undefined : variant} />,
  code: (variant: string) =>
    (variant === "unset" ? tableCode(`selectable`) : tableCode(`selectable`, `empty="${variant}"`)).replace("rows={rows}", "rows={[]}"),
} satisfies ComponentExample

const MAX_HEIGHTS = ["none", "small", "base", "large"] as const satisfies readonly DataTableMaxHeightType[]

export const dataTableMaxHeight = {
  name: "maxHeight",
  description: "The table's maximum height; past it the body scrolls under the sticky header. none (default) grows with the rows.",
  variants: MAX_HEIGHTS,
  default: "none",
  preview: (variant: DataTableMaxHeightType) => <DataTable {...BASE} rows={MORE_ROWS} defaultExpandedIds="all" maxHeight={variant} />,
  code: (variant: string) =>
    tableCode(`defaultExpandedIds="all"`, ...(variant === "none" ? [] : [`maxHeight="${variant}"`])).replace("rows={rows}", "rows={moreRows}"),
} satisfies ComponentExample

/** Nested rows step down a size; the variants compare the levels. */
export const dataTableCompactChildren = {
  name: "compact children",
  description:
    "Top-level rows are base density; every nested row is compact (one step down in padding and text, on the nested-row background), with no prop to set. Compare a parent and its children here.",
  variants: ["closed", "open"],
  default: "closed",
  preview: (variant: string) => <DataTable {...BASE} rows={cutRows(ROWS, 2)} defaultExpandedIds={variant === "open" ? "all" : undefined} />,
  code: (variant: string) => (variant === "open" ? tableCode(`defaultExpandedIds="all"`) : tableCode()),
} satisfies ComponentExample

export const dataTableKeyboard = {
  name: "keyboard",
  description:
    "The WAI-ARIA treegrid keyboard model. Row focus: Up/Down move, Right opens or enters the row, Left closes or climbs to the parent, Home/End, Enter toggles, Space selects. Cell focus: arrows move between cells (the header row included), Home/End within the row, Ctrl+Home/End within the column. One element is in the tab order at a time.",
  variants: ["try it"],
  default: "try it",
  preview: () => <DataTable {...BASE} selectable rowActions={() => [{ id: "open", label: "Open", onSelect: () => {} }]} />,
  code: () => tableCode(`selectable`, `rowActions={row => [{ id: "open", label: "Open", onSelect: () => open(row) }]}`),
} satisfies ComponentExample

/** Every feature at once, as the port directory uses it. */
export const dataTableComplete = {
  name: "everything together",
  description: "Four levels, selection with bulk actions, row actions, sorting and a capped height with the sticky header.",
  variants: ["port directory"],
  default: "port directory",
  preview: () => (
    <Reporting initial="Select, sort, open and act on rows">
      {report => (
        <DataTable
          {...BASE}
          rows={MORE_ROWS}
          defaultExpandedIds={["studio", "main", "main-owner"]}
          defaultSort={{ columnId: "name", direction: "ascending" }}
          selectable
          bulkActions={rows => [
            { id: "start", label: "Start", onSelect: () => report(`Start: ${names(rows)}`) },
            { id: "stop", label: "Stop", onSelect: () => report(`Stop: ${names(rows)}`) },
          ]}
          rowActions={row =>
            row.items
              ? []
              : [
                  { id: "start", label: "Start", disabled: row.state === "running", onSelect: () => report(`Start ${row.name}`) },
                  { id: "stop", label: "Stop", disabled: row.state !== "running", onSelect: () => report(`Stop ${row.name}`) },
                ]
          }
          maxHeight="base"
        />
      )}
    </Reporting>
  ),
  code: () =>
    tableCode(
      `defaultExpandedIds={["studio", "main", "main-owner"]}`,
      `defaultSort={{ columnId: "name", direction: "ascending" }}`,
      `selectable`,
      `bulkActions={rows => [\n    { id: "start", label: "Start", onSelect: () => start(rows) },\n    { id: "stop", label: "Stop", onSelect: () => stop(rows) },\n  ]}`,
      `rowActions={row => row.items ? [] : [\n    { id: "start", label: "Start", disabled: row.state === "running", onSelect: () => start(row) },\n    { id: "stop", label: "Stop", disabled: row.state !== "running", onSelect: () => stop(row) },\n  ]}`,
      `maxHeight="base"`,
    ).replace("rows={rows}", "rows={moreRows}"),
} satisfies ComponentExample

/** Every DataTable example facet: each one a section of the DataTable docs page. */
export const dataTableExamples = {
  columns: dataTableColumns,
  getRowChildren: dataTableGetRowChildren,
  getRowLabel: dataTableGetRowLabel,
  defaultExpandedIds: dataTableDefaultExpandedIds,
  expandedIds: dataTableExpandedIds,
  onExpandedChange: dataTableOnExpandedChange,
  selectable: dataTableSelectable,
  defaultSelectedIds: dataTableDefaultSelectedIds,
  selectedIds: dataTableSelectedIds,
  onSelectedChange: dataTableOnSelectedChange,
  bulkActions: dataTableBulkActions,
  rowActions: dataTableRowActions,
  defaultSort: dataTableDefaultSort,
  sort: dataTableSort,
  onSortChange: dataTableOnSortChange,
  loading: dataTableLoading,
  empty: dataTableEmpty,
  maxHeight: dataTableMaxHeight,
  compactChildren: dataTableCompactChildren,
  keyboard: dataTableKeyboard,
  complete: dataTableComplete,
} satisfies Record<string, ComponentExample>
