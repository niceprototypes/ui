import * as React from "react"
import { StyledTableHeader } from "./TableHeader.styles"
import type { TableHeaderProps } from "./TableHeader.types"

/**
 * TableHeader
 *
 * The header row of a Table: row 1 (`aria-rowindex`), sticky at the top of the scroller, holding
 * one `role="columnheader"` TableCell per column.
 */
const TableHeader: React.FC<TableHeaderProps> = ({ children }) => (
  <StyledTableHeader role="row" aria-rowindex={1} data-header="">
    {children}
  </StyledTableHeader>
)

export default TableHeader
