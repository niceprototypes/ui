// Table example configs: one ComponentExample per facet. ComponentDocs renders each entry as a
// section of the Table docs page, sorted by name. TableHeader, TableRow and TableCell facets are in
// their own folders, rendered in their sections of this page.
import Ink from "@niceprototypes/ink"
import type { TableColumnWidthType, TableMaxHeightType } from "@niceprototypes/table"
import { Flat, flatCode, PORTS, Tree, treeCode } from "./samples"
import type { ComponentExample } from "../../dataTables/components/demos/Components"

export const tableRole = {
  name: "role",
  description:
    "grid (default) for flat rows; treegrid for nested rows, each TableRow carrying aria-level, aria-posinset and aria-setsize. Table draws; the keyboard model is the consumer's (DataTable supplies one).",
  variants: ["grid", "treegrid"],
  default: "grid",
  preview: (variant: string) => (variant === "grid" ? <Flat /> : <Tree />),
  code: (variant: string) => (variant === "grid" ? flatCode(` columnWidths={["small", "base", "base"]}`) : treeCode()),
} satisfies ComponentExample

/** columnWidths per variant. */
const WIDTHS: Record<string, TableColumnWidthType[]> = {
  "small base base": ["small", "base", "base"],
  "fit base large": ["fit", "base", "large"],
  "small large base": ["small", "large", "base"],
  "fit fit fit": ["fit", "fit", "fit"],
}

export const tableColumnWidths = {
  name: "columnWidths",
  description:
    "One width per column from the table.column.width tokens: fit hugs its content, small holds a short value, base shares the spare space, large takes twice base's share. Every row is a subgrid of this template.",
  variants: Object.keys(WIDTHS),
  default: "small base base",
  preview: (variant: string) => <Flat widths={WIDTHS[variant]} />,
  code: (variant: string) => flatCode(` columnWidths={${JSON.stringify(WIDTHS[variant]).replace(/,/g, ", ")}}`),
} satisfies ComponentExample

const MAX_HEIGHTS = ["none", "small", "base", "large"] as const satisfies readonly TableMaxHeightType[]

export const tableMaxHeight = {
  name: "maxHeight",
  description: "The table's maximum height from the table.maxHeight tokens; past it the body scrolls under the sticky header. none (default) grows with the rows.",
  variants: MAX_HEIGHTS,
  default: "none",
  preview: (variant: TableMaxHeightType) => <Flat maxHeight={variant} count={PORTS.length} />,
  code: (variant: string) =>
    flatCode(` columnWidths={["small", "base", "base"]}${variant === "none" ? "" : ` maxHeight="${variant}"`}`, PORTS.length),
} satisfies ComponentExample

export const tableToolbar = {
  name: "toolbar",
  description: "Content above the grid, inside the card, that does not scroll with the rows: a selection bar or a summary.",
  variants: ["none", "summary", "with maxHeight"],
  default: "none",
  preview: (variant: string) =>
    variant === "none" ? (
      <Flat />
    ) : (
      <Flat
        toolbar={<Ink size="small">{`${variant === "summary" ? 4 : PORTS.length} ports reserved`}</Ink>}
        maxHeight={variant === "with maxHeight" ? "small" : undefined}
        count={variant === "with maxHeight" ? PORTS.length : 4}
      />
    ),
  code: (variant: string) =>
    variant === "none"
      ? flatCode(` columnWidths={["small", "base", "base"]}`)
      : flatCode(
          ` columnWidths={["small", "base", "base"]}${variant === "with maxHeight" ? ` maxHeight="small"` : ""} toolbar={<Ink size="small">${variant === "summary" ? 4 : PORTS.length} ports reserved</Ink>}`,
          variant === "with maxHeight" ? PORTS.length : 4,
        ),
} satisfies ComponentExample

/** Every Table example facet: each one a section of the Table docs page. */
export const tableExamples = {
  role: tableRole,
  columnWidths: tableColumnWidths,
  maxHeight: tableMaxHeight,
  toolbar: tableToolbar,
} satisfies Record<string, ComponentExample>
