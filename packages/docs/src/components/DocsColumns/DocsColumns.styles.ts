import styled from "styled-components"
import { getBreakpoint, getToken as getCoreToken } from "@niceprototypes/styles"
import { getToken } from "../../nice/tokens"

/**
 * The two columns: one column below laptop, the aside after the main column, a Flow block's
 * after-space apart; from laptop up, two equal columns (Stripe's API reference: 1:1) a
 * `docs.gutter` apart, both from the top.
 */
export const StyledDocsColumns = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  row-gap: calc(${getCoreToken("flow.block:after")} * ${getCoreToken("flow.density")} * ${getCoreToken("flow.scale")});

  ${getBreakpoint("laptop+")} {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    column-gap: ${getToken("docs", "gutter")};
    align-items: start;
  }
`

/**
 * A column's cell: lets its content shrink below its intrinsic width, so wide code scrolls inside
 * its card. Its column sits flush at both ends, one Flow column deep too: Flow flushes a nested
 * column's ends only when no Flow column encloses its root, and the page's does (backlog).
 */
export const StyledDocsColumnsCell = styled.div`
  min-width: 0;

  &&& > :where([data-flow]) > :where([data-flow]:first-child) > :where(:first-child) {
    margin-block-start: 0;
  }

  &&& > :where([data-flow]) > :where([data-flow]:last-child) > :where(:last-child) {
    margin-block-end: 0;
  }
`

/** The aside's cell: from laptop up it sticks where Contents sticks while the main column scrolls past. */
export const StyledDocsColumnsAside = styled(StyledDocsColumnsCell)`
  ${getBreakpoint("laptop+")} {
    position: sticky;
    top: ${getCoreToken("contents.top")};
  }
`
