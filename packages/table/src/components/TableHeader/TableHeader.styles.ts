import styled from "styled-components"
import { getToken } from "@niceprototypes/styles"

/**
 * The header row: a subgrid spanning every column, sticky at the top of the scroller (the row
 * sticks, not its cells, so its containing block is the grid). Never `content-visibility`. Its
 * background is the table's own surface, opaque so scrolled rows never show through; only the
 * row divider below separates it.
 */
export const StyledTableHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: ${getToken("table.zIndex:header")};
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
  border-bottom: ${getToken("table.borderWidth")} solid ${getToken("table.borderColor:row")};
  background-color: ${getToken("table.backgroundColor:header")};
  color: ${getToken("table.color:header")};
  font-size: ${getToken("table.fontSize:header")};
  font-weight: ${getToken("table.fontWeight:header")};
`
