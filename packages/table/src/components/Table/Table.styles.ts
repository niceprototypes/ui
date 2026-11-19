import styled from "styled-components"
import { getToken } from "@niceprototypes/styles"
import { Scroll } from "@niceprototypes/scroll"
import { tableBorder } from "../../utilities/tableStyles"

/* Static rules only: state comes from data-* and ARIA attributes, never from per-row props. */

/** The card: border, radius and background around the toolbar and the scrolling grid. */
export const StyledTable = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  border: ${tableBorder};
  border-radius: ${getToken("table.borderRadius")};
  background-color: ${getToken("table.backgroundColor:base")};
  color: ${getToken("table.color:base")};
  overflow: hidden;
`

/**
 * The one scroll container, both axes, capped by `table.maxHeight`. The header row sticks to its
 * top; nothing between them clips.
 */
export const StyledTableScroller = styled(Scroll).attrs({ axis: "both", showScrollbar: true })`
  &[data-max-height="none"] {
    max-height: ${getToken("table.maxHeight:none")};
  }
  &[data-max-height="small"] {
    max-height: ${getToken("table.maxHeight:small")};
  }
  &[data-max-height="base"] {
    max-height: ${getToken("table.maxHeight:base")};
  }
  &[data-max-height="large"] {
    max-height: ${getToken("table.maxHeight:large")};
  }
`

/**
 * The grid: one column template (set inline from the width tokens); rows are its subgrids. It fills
 * the scroller; when the columns' minimum widths do not fit, the tracks overflow and the scroller
 * scrolls sideways.
 */
export const StyledTableGrid = styled.div`
  display: grid;
  width: 100%;
`
