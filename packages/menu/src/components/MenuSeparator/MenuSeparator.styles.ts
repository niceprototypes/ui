import styled from "styled-components"
import { getToken } from "@niceprototypes/styles"

/** A horizontal rule across the menu, `menu.separator.marginBlock` above and below. */
export const StyledMenuSeparator = styled.div`
  flex: none;
  margin-block: ${getToken("menu.separator.marginBlock")};
  border-block-start: ${getToken("menu.separator.width")} solid ${getToken("menu.separator.color")};
`
