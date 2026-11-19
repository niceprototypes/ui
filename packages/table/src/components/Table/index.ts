import * as React from "react"
import { withBreakpoints, type WithBreakpointsProps } from "@niceprototypes/styles"
import BaseTable from "./Table"
import type { TableProps } from "./Table.types"

// Explicit return-type annotation keeps the `breakpoints` prop in the emitted declarations.
const Table: React.FC<WithBreakpointsProps<TableProps>> = withBreakpoints<TableProps>(BaseTable)

export { Table }
export * from "./Table.types"
export { default as TableTypes } from "./Table.types"
