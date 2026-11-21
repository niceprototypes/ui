import styled from "styled-components"
import { getToken } from "@niceprototypes/styles"

/**
 * The heading row: the title at the left, the tabs (or the select) at the right edge, centred on
 * each other. When both do not fit on one row the control wraps under the title and stays at the
 * right edge.
 */
export const StyledTabsSectionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${getToken("gap", "base")};
`

/** The title: shrinks below its text's width, so a long title wraps before the control does. */
export const StyledTabsSectionTitle = styled.div`
  min-width: 0;
`

/** The tabs or the select, at its content's width, pushed to the row's right edge. */
export const StyledTabsSectionControl = styled.div`
  flex: none;
  margin-inline-start: auto;
`
