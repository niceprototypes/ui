import styled from "styled-components"
import { getToken } from "@niceprototypes/styles"
import { tableBorder, tableFocusRing } from "../../utilities/tableStyles"

/**
 * A body row: a subgrid spanning every column, so all rows share the column widths. Rows touch
 * (no gap), so TreeGuide lines join across them. Hover, focus and selection are CSS on attributes.
 * No `content-visibility`: its layout containment turns a subgrid row into an independent grid,
 * so the columns stop lining up.
 */
export const StyledTableRow = styled.div`
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
  font-size: ${getToken("table.fontSize:base")};

  &[data-divider] {
    border-top: ${tableBorder};
  }
  [data-header] + &[data-divider] {
    border-top: none;
  }
  &[data-density="compact"] {
    font-size: ${getToken("table.fontSize:compact")};
    background-color: ${getToken("table.backgroundColor:child")};
  }
  &:hover {
    background-color: ${getToken("table.backgroundColor:hover")};
  }
  &[aria-selected="true"] {
    background-color: ${getToken("table.backgroundColor:selected")};
  }
  &:focus-visible {
    ${tableFocusRing}
  }
`
