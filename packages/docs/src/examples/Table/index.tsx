// Table example configs: one ComponentExample per facet. ComponentDocs renders each entry as a
// section of the Table docs page, sorted by name.
import { Table, TableCell, TableHeader, TableRow, type TableColumnWidthType, type TableRowDensityType } from "@niceprototypes/table"
import type { ComponentExample } from "../../dataTables/components/demos/Components"

/** A group row with two nested rows, then a flat row. */
const Sample = ({
  widths = ["base", "small"],
  density = "compact",
  guide = true,
}: {
  widths?: TableColumnWidthType[]
  density?: TableRowDensityType
  guide?: boolean
}) => (
  <Table aria-label="Ports" role="treegrid" columnWidths={widths}>
    <TableHeader>
      <TableCell role="columnheader">Project</TableCell>
      <TableCell role="columnheader" align="end">
        Port
      </TableCell>
    </TableHeader>
    <TableRow aria-rowindex={2} aria-level={1} aria-posinset={1} aria-setsize={2} aria-expanded divider>
      <TableCell role="rowheader">animation-studio</TableCell>
      <TableCell align="end">4012–4013</TableCell>
    </TableRow>
    {(["4012", "4013"] as const).map((port, index) => (
      <TableRow key={port} aria-rowindex={index + 3} aria-level={2} aria-posinset={index + 1} aria-setsize={2} density={density}>
        <TableCell role="rowheader" guide={guide ? { depth: 1, last: index === 1, continues: [] } : undefined}>
          {index === 0 ? "owner instance" : "store registry"}
        </TableCell>
        <TableCell align="end">{port}</TableCell>
      </TableRow>
    ))}
    <TableRow aria-rowindex={5} aria-level={1} aria-posinset={2} aria-setsize={2} divider>
      <TableCell role="rowheader">docs</TableCell>
      <TableCell align="end">4020</TableCell>
    </TableRow>
  </Table>
)

const SAMPLE_CODE = (widths: string, density: string, guide: boolean) => `<Table aria-label="Ports" role="treegrid" columnWidths={${widths}}>
  <TableHeader>
    <TableCell role="columnheader">Project</TableCell>
    <TableCell role="columnheader" align="end">Port</TableCell>
  </TableHeader>
  <TableRow aria-rowindex={2} aria-level={1} aria-posinset={1} aria-setsize={2} aria-expanded divider>
    <TableCell role="rowheader">animation-studio</TableCell>
    <TableCell align="end">4012–4013</TableCell>
  </TableRow>
  <TableRow aria-rowindex={3} aria-level={2} aria-posinset={1} aria-setsize={2} density="${density}">
    <TableCell role="rowheader"${guide ? ` guide={{ depth: 1, last: false, continues: [] }}` : ""}>owner instance</TableCell>
    <TableCell align="end">4012</TableCell>
  </TableRow>
  …
</Table>`

export const tableColumnWidths = {
  name: "columnWidths",
  description: "One width per column from the table.column.width tokens; every row is a subgrid of this template.",
  variants: ["base small", "large fit"],
  default: "base small",
  preview: (variant: string) => <Sample widths={variant.split(" ") as TableColumnWidthType[]} />,
  code: (variant: string) => SAMPLE_CODE(JSON.stringify(variant.split(" ")), "compact", true),
} satisfies ComponentExample

export const tableDensity = {
  name: "density",
  description: "TableRow density: compact steps nested rows down one size in padding and text.",
  variants: ["base", "compact"],
  default: "compact",
  preview: (variant: TableRowDensityType) => <Sample density={variant} />,
  code: (variant: string) => SAMPLE_CODE(`["base", "small"]`, variant, true),
} satisfies ComponentExample

export const tableGuide = {
  name: "guide",
  description: "TableCell guide: the row's TreeGuide data (from getTreeRows); the cell draws the slice over the row's height.",
  variants: ["with guide", "without"],
  default: "with guide",
  preview: (variant: string) => <Sample guide={variant === "with guide"} />,
  code: (variant: string) => SAMPLE_CODE(`["base", "small"]`, "compact", variant === "with guide"),
} satisfies ComponentExample

/** Every Table example facet: each one a section of the Table docs page. */
export const tableExamples = {
  columnWidths: tableColumnWidths,
  density: tableDensity,
  guide: tableGuide,
} satisfies Record<string, ComponentExample>
