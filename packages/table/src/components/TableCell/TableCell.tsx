import * as React from "react"
import { TreeGuide } from "@niceprototypes/tree"
import { StyledTableCell, StyledTableCellContent } from "./TableCell.styles"
import type { TableCellProps } from "./TableCell.types"

/**
 * TableCell
 *
 * One cell of a TableRow or TableHeader. With `guide`, it draws that row's TreeGuide slice before
 * its content, over the row's full height, so a tree column needs no extra markup. An empty cell
 * still renders, as an empty gridcell.
 */
const TableCell: React.FC<TableCellProps> = ({
  children,
  role = "gridcell",
  align = "start",
  span,
  guide,
  "aria-sort": ariaSort,
  "aria-label": ariaLabel,
  tabIndex,
}) => (
  <StyledTableCell
    role={role}
    data-align={align}
    data-span={span}
    aria-sort={ariaSort}
    aria-label={ariaLabel}
    tabIndex={tabIndex}
  >
    {guide ? <TreeGuide {...guide} /> : null}
    <StyledTableCellContent>{children}</StyledTableCellContent>
  </StyledTableCell>
)

export default TableCell
