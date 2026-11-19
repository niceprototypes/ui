import * as React from "react"
import { getToken } from "@niceprototypes/styles"
import { StyledTable, StyledTableGrid, StyledTableScroller } from "./Table.styles"
import type { TableProps } from "./Table.types"

/**
 * Table
 *
 * The structural grid behind DataTable, data-agnostic: a card holding an optional toolbar and one
 * scroll container with an ARIA grid (or treegrid). `columnWidths` sets one column template from
 * the `table.column.width` tokens; TableHeader and every TableRow are CSS subgrids of it, so all
 * rows share the widths. Body rows are `striped` by default (alternating backgrounds and row
 * dividers, by visible order); `striped={false}` turns it off. The header row is sticky inside
 * the scroller (cap the height with `maxHeight`). Hover, focus and `aria-selected` row styles are
 * CSS. `alignItems` sets every row's vertical alignment (default "start"; a TableRow may override
 * it). A keyboard model attaches through `onKeyDown`, `onFocus` and `ref`.
 *
 * @example
 * ```tsx
 * <Table aria-label="Ports" columnWidths={["small", "base"]}>
 *   <TableHeader>
 *     <TableCell role="columnheader">Port</TableCell>
 *     <TableCell role="columnheader">Project</TableCell>
 *   </TableHeader>
 *   <TableRow aria-rowindex={2}>
 *     <TableCell>4000</TableCell>
 *     <TableCell>ports</TableCell>
 *   </TableRow>
 * </Table>
 * ```
 */
const Table: React.FC<TableProps> = ({
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-rowcount": ariaRowCount,
  "aria-multiselectable": ariaMultiselectable,
  "aria-busy": ariaBusy,
  role = "grid",
  columnWidths,
  maxHeight = "none",
  alignItems = "start",
  striped = true,
  toolbar,
  children,
  onKeyDown,
  onFocus,
  ref,
}) => (
  <StyledTable>
    {toolbar}
    <StyledTableScroller data-max-height={maxHeight}>
      <StyledTableGrid
        ref={ref}
        role={role}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-rowcount={ariaRowCount}
        aria-colcount={columnWidths.length}
        aria-multiselectable={ariaMultiselectable}
        aria-busy={ariaBusy || undefined}
        data-align-items={alignItems}
        data-striped={striped ? "" : undefined}
        style={{ gridTemplateColumns: columnWidths.map(width => getToken(`table.column.width:${width}`)).join(" ") }}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
      >
        {children}
      </StyledTableGrid>
    </StyledTableScroller>
  </StyledTable>
)

export default Table
