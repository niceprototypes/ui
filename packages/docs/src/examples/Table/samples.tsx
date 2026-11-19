// Table samples shared by the Table, TableHeader, TableRow and TableCell examples: a flat grid of
// port reservations and a treegrid of one project's instances.
import type * as React from "react"
import { Table, TableCell, TableHeader, TableRow, type TableColumnWidthType, type TableMaxHeightType, type TableRowDensityType } from "@niceprototypes/table"

/** A port reservation of the port directory. */
type Port = { port: number; project: string; instance: string }

/** Twelve reservations, enough to pass the small and base caps. */
export const PORTS: Port[] = [
  { port: 4000, project: "ports", instance: "directory" },
  { port: 4012, project: "animation-studio", instance: "owner instance" },
  { port: 4013, project: "animation-studio", instance: "store registry" },
  { port: 4014, project: "animation-studio", instance: "member instance" },
  { port: 4020, project: "docs", instance: "dev server" },
  { port: 4030, project: "website", instance: "dev server" },
  { port: 4040, project: "browser", instance: "extension" },
  { port: 4050, project: "fastcodec-catalog", instance: "dev server" },
  { port: 4112, project: "animation-studio", instance: "voice owner instance" },
  { port: 4113, project: "animation-studio", instance: "voice store registry" },
  { port: 6006, project: "storybook", instance: "dev server" },
  { port: 6007, project: "storybook", instance: "preview" },
]

/** A flat grid: port, project and instance, `count` rows. */
export const Flat = ({
  widths = ["small", "base", "base"],
  maxHeight,
  count = 4,
  toolbar,
}: {
  widths?: TableColumnWidthType[]
  maxHeight?: TableMaxHeightType
  count?: number
  toolbar?: React.ReactNode
}) => (
  <Table aria-label="Ports" columnWidths={widths} maxHeight={maxHeight} toolbar={toolbar}>
    <TableHeader>
      <TableCell role="columnheader" align="end">
        Port
      </TableCell>
      <TableCell role="columnheader">Project</TableCell>
      <TableCell role="columnheader">Instance</TableCell>
    </TableHeader>
    {PORTS.slice(0, count).map((row, index) => (
      <TableRow key={row.port} aria-rowindex={index + 2}>
        <TableCell align="end">{row.port}</TableCell>
        <TableCell role="rowheader">{row.project}</TableCell>
        <TableCell>{row.instance}</TableCell>
      </TableRow>
    ))}
  </Table>
)

/** The JSX of the flat grid with these Table attributes. */
export const flatCode = (attributes: string, count = 4) => `<Table aria-label="Ports"${attributes}>
  <TableHeader>
    <TableCell role="columnheader" align="end">Port</TableCell>
    <TableCell role="columnheader">Project</TableCell>
    <TableCell role="columnheader">Instance</TableCell>
  </TableHeader>
  <TableRow aria-rowindex={2}>
    <TableCell align="end">4000</TableCell>
    <TableCell role="rowheader">ports</TableCell>
    <TableCell>directory</TableCell>
  </TableRow>
  …${count > 4 ? ` (${count} rows)` : ""}
</Table>`

/** What the treegrid sample varies. */
export type TreeOptionsType = {
  /** Density of the nested rows */
  density?: TableRowDensityType
  /** The nested rows draw their TreeGuide */
  guide?: boolean
  /** The top-level rows draw a divider */
  divider?: boolean
  /** Alignment of the Port column */
  align?: "start" | "end"
}

/** A treegrid: a group row with two nested rows, then a flat row. */
export const Tree = ({ density = "compact", guide = true, divider = true, align = "end" }: TreeOptionsType) => (
  <Table aria-label="Ports" role="treegrid" columnWidths={["base", "small"]}>
    <TableHeader>
      <TableCell role="columnheader">Project</TableCell>
      <TableCell role="columnheader" align={align}>
        Port
      </TableCell>
    </TableHeader>
    <TableRow aria-rowindex={2} aria-level={1} aria-posinset={1} aria-setsize={2} aria-expanded divider={divider}>
      <TableCell role="rowheader">animation-studio</TableCell>
      <TableCell align={align}>4012–4013</TableCell>
    </TableRow>
    {(["4012", "4013"] as const).map((port, index) => (
      <TableRow key={port} aria-rowindex={index + 3} aria-level={2} aria-posinset={index + 1} aria-setsize={2} density={density}>
        <TableCell role="rowheader" guide={guide ? { depth: 1, last: index === 1, continues: [] } : undefined}>
          {index === 0 ? "owner instance" : "store registry"}
        </TableCell>
        <TableCell align={align}>{port}</TableCell>
      </TableRow>
    ))}
    <TableRow aria-rowindex={5} aria-level={1} aria-posinset={2} aria-setsize={2} divider={divider}>
      <TableCell role="rowheader">docs</TableCell>
      <TableCell align={align}>4020</TableCell>
    </TableRow>
  </Table>
)

/** The JSX of the treegrid sample with these options. */
export const treeCode = ({ density = "compact", guide = true, divider = true, align = "end" }: TreeOptionsType = {}) => {
  const alignAttribute = align === "start" ? "" : ` align="${align}"`
  const dividerAttribute = divider ? " divider" : ""
  return `<Table aria-label="Ports" role="treegrid" columnWidths={["base", "small"]}>
  <TableHeader>
    <TableCell role="columnheader">Project</TableCell>
    <TableCell role="columnheader"${alignAttribute}>Port</TableCell>
  </TableHeader>
  <TableRow aria-rowindex={2} aria-level={1} aria-posinset={1} aria-setsize={2} aria-expanded${dividerAttribute}>
    <TableCell role="rowheader">animation-studio</TableCell>
    <TableCell${alignAttribute}>4012–4013</TableCell>
  </TableRow>
  <TableRow aria-rowindex={3} aria-level={2} aria-posinset={1} aria-setsize={2}${density === "base" ? "" : ` density="${density}"`}>
    <TableCell role="rowheader"${guide ? ` guide={{ depth: 1, last: false, continues: [] }}` : ""}>owner instance</TableCell>
    <TableCell${alignAttribute}>4012</TableCell>
  </TableRow>
  …
  <TableRow aria-rowindex={5} aria-level={1} aria-posinset={2} aria-setsize={2}${dividerAttribute}>
    <TableCell role="rowheader">docs</TableCell>
    <TableCell${alignAttribute}>4020</TableCell>
  </TableRow>
</Table>`
}
