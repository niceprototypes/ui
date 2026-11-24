import styled from "styled-components"
import { getBreakpoint, getToken as getCoreToken } from "@niceprototypes/styles"
import { getToken } from "../../nice/tokens"
import type { DocsColumnsSplitType } from "./DocsColumns.types"

/**
 * The two columns: one column below laptop, the aside after the main column, a Flow block's
 * after-space apart; from laptop up, two columns sharing the width by `$split`
 * (`docsColumnsSplit`: equal by default, Stripe's API reference 1:1) a `docs.gutter` apart, both
 * from the top.
 */
export const StyledDocsColumns = styled.div<{ $split: DocsColumnsSplitType }>`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  row-gap: calc(${getCoreToken("flow.block:after")} * ${getCoreToken("flow.density")} * ${getCoreToken("flow.scale")});

  ${getBreakpoint("laptop+")} {
    grid-template-columns: ${({ $split }) => getToken("docsColumnsSplit", $split)};
    column-gap: ${getToken("docs", "gutter")};
    align-items: start;
  }
`

/**
 * A column's cell: lets its content shrink below its intrinsic width, so wide code scrolls inside
 * its card. The `$sticky` cell, from laptop up, sticks where Contents sticks (`contents.top`) while
 * the other column scrolls past, until the pair ends; stacked below laptop, nothing sticks.
 */
export const StyledDocsColumnsCell = styled.div<{ $sticky: boolean }>`
  min-width: 0;

  ${getBreakpoint("laptop+")} {
    ${({ $sticky }) => ($sticky ? `position: sticky; top: ${getCoreToken("contents.top")};` : "")}
  }
`
