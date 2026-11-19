import styled from "styled-components"
import { getToken } from "@niceprototypes/styles"

/**
 * The `role="menu"` element: a column of items inset by `menu.padding`, so each item's rounded
 * focus highlight clears the surface edge. It takes focus only on the way to an item, so it shows
 * no focus style of its own.
 */
export const StyledMenu = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${getToken("menu.padding")};

  &:focus {
    outline: none;
  }
`
