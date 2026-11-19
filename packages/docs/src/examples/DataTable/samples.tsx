// DataTable samples: the port directory's reservations (projects, their worktrees, the instances
// and their ports), the columns that show them, and the same tree cut to fewer levels.
import Badge, { type BadgeStatusType } from "@niceprototypes/badge"
import type { DataTableColumnType } from "@niceprototypes/datatable"

/** A reservation's state, shown as a status Badge. */
export type PortStateType = "running" | "stopped" | "held" | "failed"

/** A port reservation, or a group of them (a project, a worktree, an instance). */
export type PortRow = { id: string; name: string; port?: number; ports?: string; state?: PortStateType; items?: PortRow[] }

/** The Badge status of each state. */
const STATUS: Record<PortStateType, BadgeStatusType> = { running: "success", stopped: "base", held: "warning", failed: "error" }

/** Four levels: projects, worktrees, instances, ports. */
export const ROWS: PortRow[] = [
  { id: "4000", name: "ports", port: 4000, state: "running" },
  {
    id: "studio",
    name: "animation-studio",
    ports: "4012–4113",
    items: [
      {
        id: "main",
        name: "main",
        ports: "4012–4014",
        items: [
          {
            id: "main-owner",
            name: "owner instance",
            ports: "4012–4013",
            items: [
              { id: "4012", name: "web", port: 4012, state: "running" },
              { id: "4013", name: "store registry", port: 4013, state: "running" },
            ],
          },
          { id: "main-member", name: "member instance", ports: "4014", items: [{ id: "4014", name: "web", port: 4014, state: "stopped" }] },
        ],
      },
      {
        id: "voice",
        name: "voice worktree",
        ports: "4112–4113",
        items: [
          {
            id: "voice-owner",
            name: "owner instance",
            ports: "4112–4113",
            items: [
              { id: "4112", name: "web", port: 4112, state: "failed" },
              { id: "4113", name: "store registry", port: 4113, state: "held" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "website",
    name: "website",
    ports: "4030–4031",
    items: [
      { id: "4030", name: "dev server", port: 4030, state: "running" },
      { id: "4031", name: "preview", port: 4031, state: "stopped" },
    ],
  },
  { id: "4020", name: "docs", port: 4020, state: "running" },
]

/** More projects after ROWS, so a capped table has rows to scroll. */
export const MORE_ROWS: PortRow[] = [
  ...ROWS,
  { id: "4040", name: "browser", port: 4040, state: "held" },
  { id: "4050", name: "fastcodec-catalog", port: 4050, state: "running" },
  {
    id: "storybook",
    name: "storybook",
    ports: "6006–6007",
    items: [
      { id: "6006", name: "dev server", port: 6006, state: "running" },
      { id: "6007", name: "preview", port: 6007, state: "failed" },
    ],
  },
]

/** The rows cut to `levels` levels: rows at the last level drop their children. */
export const cutRows = (rows: PortRow[], levels: number): PortRow[] =>
  rows.map(row => (row.items ? { ...row, items: levels > 1 ? cutRows(row.items, levels - 1) : undefined } : row))

/** Every leaf, in order: the one-level table. */
export const leafRows = (rows: PortRow[]): PortRow[] => rows.flatMap(row => (row.items ? leafRows(row.items) : [row]))

/** Project, Port and State: text, a number and a status Badge. */
export const COLUMNS: DataTableColumnType<PortRow>[] = [
  { id: "name", header: "Project", rowHeader: true, cell: row => row.name, sortValue: row => row.name },
  { id: "port", header: "Port", width: "small", align: "end", cell: row => row.port ?? row.ports, sortValue: row => row.port ?? 0 },
  {
    id: "state",
    header: "State",
    width: "small",
    cell: row => (row.state ? <Badge status={STATUS[row.state]} label={row.state} /> : null),
    sortValue: row => row.state ?? "",
  },
]

/** The props every example shares. */
export const BASE = {
  "aria-label": "Ports",
  columns: COLUMNS,
  rows: ROWS,
  getRowId: (row: PortRow) => row.id,
  getRowLabel: (row: PortRow) => row.name,
  getRowChildren: (row: PortRow) => row.items,
}

/** The rows and columns as the columns example's code shows them; the other examples use them by name. */
export const DATA_CODE = `const rows = [
  { id: "4000", name: "ports", port: 4000, state: "running" },
  {
    id: "studio",
    name: "animation-studio",
    ports: "4012–4113",
    items: [
      {
        id: "main",
        name: "main",
        ports: "4012–4014",
        items: [
          {
            id: "main-owner",
            name: "owner instance",
            ports: "4012–4013",
            items: [
              { id: "4012", name: "web", port: 4012, state: "running" },
              { id: "4013", name: "store registry", port: 4013, state: "running" },
            ],
          },
          …
        ],
      },
      …
    ],
  },
  …
]

const status = { running: "success", stopped: "base", held: "warning", failed: "error" }

const columns = [
  { id: "name", header: "Project", rowHeader: true, cell: row => row.name, sortValue: row => row.name },
  { id: "port", header: "Port", width: "small", align: "end", cell: row => row.port ?? row.ports, sortValue: row => row.port ?? 0 },
  {
    id: "state",
    header: "State",
    width: "small",
    cell: row => (row.state ? <Badge status={status[row.state]} label={row.state} /> : null),
    sortValue: row => row.state ?? "",
  },
]`

/** The JSX of a table with these extra attribute lines (rows and columns: DATA_CODE). */
export const tableCode = (...extra: string[]) =>
  `<DataTable\n  aria-label="Ports"\n  columns={columns}\n  rows={rows}\n  getRowId={row => row.id}\n  getRowLabel={row => row.name}\n  getRowChildren={row => row.items}${extra.map(line => `\n  ${line}`).join("")}\n/>`
