import styled, { css } from "styled-components"
import { getToken } from "@niceprototypes/styles"
import { Scroll } from "@niceprototypes/scroll"

const railWidth = getToken("contents.rail.width")

/**
 * The `<nav>` root, a Scroll: with `$sticky`, sticks `contents.top` below the top of its scroll
 * container and scrolls on its own when taller than the viewport; else it sits in the page's flow. The rail beside the heading and every
 * row is painted in its start padding, inside the scroll clip, so the active row's
 * indicator can cover it.
 */
export const StyledContents = styled(Scroll).attrs({ forwardedAs: "nav" })<{ $sticky: boolean }>`
  position: relative;
  padding-inline-start: ${railWidth};
  box-shadow: inset ${railWidth} 0 0 ${getToken("contents.rail.color")};

  ${({ $sticky }) =>
    $sticky &&
    css`
      position: sticky;
      top: ${getToken("contents.top")};
      max-block-size: calc(100vh - 2 * ${getToken("contents.top")});
    `}
`

/** A level's rows; nesting shows in the links' indent, so every row's indicator meets the rail. */
export const StyledContentsList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`

/** A row and its nested rows. */
export const StyledContentsItem = styled.li`
  margin: 0;
`

/**
 * A row's link, indented one `contents.indent` per level; flex, so its height is the
 * label's line box rather than the inherited font's. The active row takes the active
 * colour and weight; the indicator bar over the rail is the list's own (StyledContentsIndicator).
 */
export const StyledContentsLink = styled.a<{ $depth: number; $active: boolean }>`
  position: relative;
  display: flex;
  padding-block: ${getToken("contents.item.paddingBlock")};
  padding-inline-start: calc(
    ${getToken("contents.item.paddingInline")} + ${({ $depth }) => $depth} * ${getToken("contents.indent")}
  );
  color: ${({ $active }) => getToken(`contents.color:${$active ? "active" : "base"}`)};
  font-weight: ${({ $active }) => getToken(`contents.fontWeight:${$active ? "active" : "base"}`)};
  text-decoration: none;

  &:hover {
    color: ${({ $active }) => getToken(`contents.color:${$active ? "active" : "hover"}`)};
  }

`

/**
 * The active row's indicator: one bar over the rail (`contents.indicator.width` in
 * `contents.indicator.color`), placed on the active row by transform (a 1px bar moved down and
 * stretched to the row's height), so it slides between rows over `contents.indicator.animationDuration`
 * with `contents.indicator.animationEasing` without layout work; no slide until the reader first
 * acts (`data-placed`: a page opened at a hash starts in place), and none under reduced motion.
 */
export const StyledContentsIndicator = styled.span`
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: 0;
  width: ${getToken("contents.indicator.width")};
  height: 1px;
  background-color: ${getToken("contents.indicator.color")};
  transform-origin: top;
  pointer-events: none;

  &[data-placed] {
    transition: transform ${getToken("contents.indicator.animationDuration")} ${getToken("contents.indicator.animationEasing")};
  }

  @media (prefers-reduced-motion: reduce) {
    &[data-placed] {
      transition: none;
    }
  }
`

/**
 * The heading row (`heading`): a link to the section the rows belong to, in the heading's colour
 * and weight (`contents.heading.*`), the active colour while its section is in view.
 */
export const StyledContentsHeading = styled.a<{ $active: boolean }>`
  display: flex;
  padding-block: ${getToken("contents.heading.paddingBlock")};
  padding-inline-start: ${getToken("contents.item.paddingInline")};
  color: ${({ $active }) => getToken($active ? "contents.color:active" : "contents.heading.color")};
  font-weight: ${getToken("contents.heading.fontWeight")};
  text-decoration: none;

  &:hover {
    color: ${({ $active }) => getToken($active ? "contents.color:active" : "contents.color:hover")};
  }
`
