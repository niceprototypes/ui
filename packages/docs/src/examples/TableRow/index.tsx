// TableRow example configs: one ComponentExample per facet, rendered in the TableRow section of the
// Table docs page.
import type { TableRowDensityType } from "@niceprototypes/table"
import { Tree, treeCode } from "../Table/samples"
import type { ComponentExample } from "../../dataTables/components/demos/Components"

export const tableRowDensity = {
  name: "density",
  description: "compact steps a row down one size in padding and text, on the nested-row background: the nested rows of a treegrid. base is the default row.",
  variants: ["base", "compact"],
  default: "base",
  preview: (variant: TableRowDensityType) => <Tree density={variant} />,
  code: (variant: TableRowDensityType) => treeCode({ density: variant }),
} satisfies ComponentExample

export const tableRowDivider = {
  name: "divider",
  description: "A line above the row, separating it from the one above: the start of a group. The first row under the header never draws one.",
  variants: ["true", "false"],
  default: "false",
  preview: (variant: string) => <Tree divider={variant === "true"} />,
  code: (variant: string) => treeCode({ divider: variant === "true" }),
} satisfies ComponentExample

/** Every TableRow example facet. */
export const tableRowExamples = {
  density: tableRowDensity,
  divider: tableRowDivider,
} satisfies Record<string, ComponentExample>
