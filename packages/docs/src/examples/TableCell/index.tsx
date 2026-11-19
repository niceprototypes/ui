// TableCell example configs: one ComponentExample per facet, rendered in the TableCell section of the
// Table docs page.
import { Table, TableCell, TableHeader, TableRow } from "@niceprototypes/table"
import { Flat, flatCode, Tree, treeCode } from "../Table/samples"
import type { ComponentExample } from "../../dataTables/components/demos/Components"

export const tableCellRole = {
  name: "role",
  description:
    "gridcell (default) for data; rowheader for the cell that names its row (a treegrid's tree column); columnheader inside TableHeader.",
  variants: ["gridcell, rowheader, columnheader"],
  default: "gridcell, rowheader, columnheader",
  preview: () => <Flat />,
  code: () => flatCode(` columnWidths={["small", "base", "base"]}`),
} satisfies ComponentExample

export const tableCellAlign = {
  name: "align",
  description: "start (default) for text; end for numbers, so the digits line up. Set it on the header cell and the body cells of the column alike.",
  variants: ["end", "start"],
  default: "start",
  preview: (variant: "start" | "end") => <Tree align={variant} />,
  code: (variant: "start" | "end") => treeCode({ align: variant }),
} satisfies ComponentExample

/** A table whose body is one full-width message cell. */
const Message = ({ text }: { text: string }) => (
  <Table aria-label="Ports" columnWidths={["small", "base", "base"]} aria-busy={text === "Loading…"}>
    <TableHeader>
      <TableCell role="columnheader" align="end">
        Port
      </TableCell>
      <TableCell role="columnheader">Project</TableCell>
      <TableCell role="columnheader">Instance</TableCell>
    </TableHeader>
    <TableRow aria-rowindex={2}>
      <TableCell span="full">{text}</TableCell>
    </TableRow>
  </Table>
)

export const tableCellSpan = {
  name: "span",
  description: "full spans every column: the message of an empty or loading table.",
  variants: ["No ports reserved", "Loading…"],
  default: "No ports reserved",
  preview: (variant: string) => <Message text={variant} />,
  code: (variant: string) => `<Table aria-label="Ports" columnWidths={["small", "base", "base"]}${variant === "Loading…" ? " aria-busy" : ""}>
  <TableHeader>…</TableHeader>
  <TableRow aria-rowindex={2}>
    <TableCell span="full">${variant}</TableCell>
  </TableRow>
</Table>`,
} satisfies ComponentExample

export const tableCellGuide = {
  name: "guide",
  description: "The row's TreeGuide data (from getTreeRows): the cell draws the guide slice before its content, over the row's full height.",
  variants: ["with guide", "without"],
  default: "without",
  preview: (variant: string) => <Tree guide={variant === "with guide"} />,
  code: (variant: string) => treeCode({ guide: variant === "with guide" }),
} satisfies ComponentExample

/** Every TableCell example facet. */
export const tableCellExamples = {
  role: tableCellRole,
  align: tableCellAlign,
  span: tableCellSpan,
  guide: tableCellGuide,
} satisfies Record<string, ComponentExample>
