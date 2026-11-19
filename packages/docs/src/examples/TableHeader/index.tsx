// TableHeader example configs: one ComponentExample per facet, rendered in the TableHeader section of
// the Table docs page.
import { Flat, flatCode } from "../Table/samples"
import type { ComponentExample } from "../../dataTables/components/demos/Components"

export const tableHeaderChildren = {
  name: "children",
  description: "The header row's cells: one TableCell with role columnheader per column. It stays at the top while the body scrolls under a maxHeight.",
  variants: ["header row", "sticky over a capped body"],
  default: "header row",
  preview: (variant: string) => (variant === "header row" ? <Flat /> : <Flat maxHeight="small" count={12} />),
  code: (variant: string) =>
    flatCode(` columnWidths={["small", "base", "base"]}${variant === "header row" ? "" : ` maxHeight="small"`}`, variant === "header row" ? 4 : 12),
} satisfies ComponentExample

/** Every TableHeader example facet. */
export const tableHeaderExamples = {
  children: tableHeaderChildren,
} satisfies Record<string, ComponentExample>
