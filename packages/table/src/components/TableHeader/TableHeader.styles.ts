import styled from "styled-components"
import { getToken } from "@niceprototypes/styles"
import { tableBorder } from "../../utilities/tableStyles"

/**
 * The header row: a subgrid spanning every column, sticky at the top of the scroller (the row
 * sticks, not its cells, so its containing block is the grid). Never `content-visibility`.
 */
export const StyledTableHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: ${getToken("table.zIndex:header")};
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
  border-bottom: ${tableBorder};
  background-color: ${getToken("table.backgroundColor:header")};
  color: ${getToken("table.color:header")};
  font-size: ${getToken("table.fontSize:header")};
  font-weight: ${getToken("table.fontWeight:header")};
`
