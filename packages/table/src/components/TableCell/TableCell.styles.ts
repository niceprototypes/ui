import styled from "styled-components"
import { getToken } from "@niceprototypes/styles"
import { tableFocusRing } from "../../utilities/tableStyles"

/**
 * A cell. Positioned, so a TreeGuide inside draws over the row's full height. Compact rows step
 * down to the compact padding. No gap: a guide sits flush against the content.
 */
export const StyledTableCell = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  min-width: 0;
  padding: ${getToken("table.cell.paddingBlock:base")} ${getToken("table.cell.paddingInline")};

  [data-density="compact"] > & {
    padding-block: ${getToken("table.cell.paddingBlock:compact")};
  }
  &[data-span="full"] {
    grid-column: 1 / -1;
    color: ${getToken("table.color:empty")};
  }
  &:focus-visible {
    ${tableFocusRing}
  }
`

/** The cell's content after any guide: its items spaced by `table.cell.gap`. */
export const StyledTableCellContent = styled.div`
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  gap: ${getToken("table.cell.gap")};
  min-width: 0;

  [data-align="end"] > & {
    justify-content: flex-end;
    text-align: end;
  }
`
