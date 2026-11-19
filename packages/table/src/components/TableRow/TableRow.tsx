import * as React from "react"
import { StyledTableRow } from "./TableRow.styles"
import type { TableRowProps } from "./TableRow.types"

/**
 * TableRow
 *
 * One body row of a Table: a subgrid of the table's columns holding one TableCell per column.
 * In a treegrid, pass its `aria-level`, `aria-posinset`, `aria-setsize` and, with children,
 * `aria-expanded`; `density="compact"` steps nested rows down a size; `divider` starts a group.
 */
const TableRow: React.FC<TableRowProps> = ({
  children,
  density = "base",
  divider = false,
  "aria-rowindex": ariaRowIndex,
  "aria-level": ariaLevel,
  "aria-posinset": ariaPosInSet,
  "aria-setsize": ariaSetSize,
  "aria-expanded": ariaExpanded,
  "aria-selected": ariaSelected,
  tabIndex,
}) => (
  <StyledTableRow
    role="row"
    data-density={density}
    data-divider={divider ? "" : undefined}
    aria-rowindex={ariaRowIndex}
    aria-level={ariaLevel}
    aria-posinset={ariaPosInSet}
    aria-setsize={ariaSetSize}
    aria-expanded={ariaExpanded}
    aria-selected={ariaSelected}
    tabIndex={tabIndex}
  >
    {children}
  </StyledTableRow>
)

export default React.memo(TableRow)
