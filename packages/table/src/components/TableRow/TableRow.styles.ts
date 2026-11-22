import styled from "styled-components"
import { getToken } from "@niceprototypes/styles"
import { tableFocusRing } from "../../utilities/tableStyles"

/**
 * A body row: a subgrid spanning every column, so all rows share the column widths. Rows touch
 * (no gap) and draw their dividers as inset shadows, never borders, so every row keeps the same
 * height and TreeGuide lines join across them. Hover, focus and selection are CSS on attributes.
 * No `content-visibility`: its layout containment turns a subgrid row into an independent grid,
 * so the columns stop lining up.
 *
 * In a `data-striped` grid every row draws a `table.borderColor:row` divider and every second
 * body row (by visible order, so expanded nested rows keep the alternation) takes the stripe
 * background in place of the compact rows' child background. The striping rules sit in `:where()`
 * so hover and selection, written after them, win at equal specificity.
 */
export const StyledTableRow = styled.div`
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
  color: ${getToken("table.color:row")};
  font-size: ${getToken("table.fontSize:base")};

  :where([data-striped]) > & {
    box-shadow: inset 0 ${getToken("table.borderWidth")} 0 ${getToken("table.borderColor:row")};
  }
  :where([data-striped]) > &:where(:nth-child(even of [role="row"]:not([data-header]))) {
    background-color: ${getToken("table.backgroundColor:stripe")};
  }
  &[data-divider] {
    box-shadow: inset 0 ${getToken("table.borderWidth")} 0 ${getToken("table.borderColor")};
  }
  [data-header] + & {
    box-shadow: none;
  }
  &[data-density="compact"] {
    font-size: ${getToken("table.fontSize:compact")};
  }
  :where(:not([data-striped])) > &[data-density="compact"] {
    background-color: ${getToken("table.backgroundColor:child")};
  }
  &:hover {
    background-color: ${getToken("table.backgroundColor:hover")};
    color: ${getToken("table.color:hover")};
  }
  &[aria-selected="true"] {
    background-color: ${getToken("table.backgroundColor:selected")};
    color: ${getToken("table.color:selected")};
  }
  &:focus-visible {
    ${tableFocusRing}
  }
`
