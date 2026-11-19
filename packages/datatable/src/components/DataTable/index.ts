import type * as React from "react"
import { withBreakpoints, type WithBreakpointsProps } from "@niceprototypes/styles"
import BaseDataTable from "./DataTable"
import type { DataTableProps } from "./DataTable.types"

/**
 * DataTable with the `breakpoints` prop. The cast keeps the `Row` generic, so the row type is
 * inferred from `rows` and checked in every column, getter and action callback.
 */
const DataTable = withBreakpoints(BaseDataTable as React.FC<DataTableProps<unknown>>) as <Row>(
  props: WithBreakpointsProps<DataTableProps<Row>>,
) => React.ReactElement

export default DataTable
export * from "./DataTable.types"
export { default as DataTableTypes } from "./DataTable.types"
