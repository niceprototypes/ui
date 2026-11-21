import styled, { css } from "styled-components"
import { getToken, type FontSizeType } from "@niceprototypes/styles"
import { activeColor, iconGap } from "../../utilities/treeGuideGeometry"

/**
 * The `<nav>` root. Its font size is the label size, so the `em` gap and indent
 * match the labels.
 */
export const StyledTree = styled.nav<{ $size: FontSizeType }>`
  font-size: ${({ $size }) => getToken("fontSize", $size)};
`

/** One level's rows. Each row indents itself with its TreeGuide. */
export const StyledTreeList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`

/** One node: its row and its open sub-rows. */
export const StyledTreeNode = styled.li`
  margin: 0;
`

const getRowColor = ({ $onPath, $receded }: { $onPath: boolean; $receded: boolean }) => {
  if ($onPath) return activeColor
  if ($receded) return getToken("tree.inactive.color")
  return getToken("tree.color:base")
}

/**
 * A row: its TreeGuide (the indent and guide lines, drawn over the row's full height) and its
 * content.
 */
export const StyledTreeRow = styled.div`
  position: relative;
  display: flex;
`

/**
 * A row's content. Rows on the path take the active colour and weight; with an active node, rows
 * off the path recede until hovered.
 */
export const StyledTreeRowContent = styled.div<{ $onPath: boolean; $receded: boolean }>`
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  gap: ${iconGap};
  min-width: 0;
  color: ${getRowColor};
  font-weight: ${({ $onPath }) => getToken(`tree.fontWeight:${$onPath ? "active" : "base"}`)};
  ${getToken("icon.color", { as: "key" })}: currentColor;

  ${({ $receded }) =>
    $receded &&
    css`
      &:hover {
        color: ${getToken("tree.color:base")};
      }
    `}
`

/**
 * The row's link, folder button or plain label: icon then label. The current page's link takes
 * the active row's background, radius and inline padding (`tree.active*` tokens; transparent and
 * none by default), its padding drawn into the indent so its text stays in line with the rows'.
 */
export const StyledTreeTarget = styled.span`
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  gap: ${iconGap};
  min-width: 0;
  margin: 0;
  padding: ${getToken("tree.row.paddingBlock")} 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-align: start;
  text-decoration: none;

  &:is(a, button) {
    cursor: pointer;
  }

  &[aria-current="page"] {
    margin-inline-start: calc(-1 * ${getToken("tree.activePaddingInline")});
    padding-inline: ${getToken("tree.activePaddingInline")};
    border-radius: ${getToken("tree.activeBorderRadius")};
    background-color: ${getToken("tree.activeBackgroundColor")};
  }
`

/** Icon slot; keeps its intrinsic size. */
export const StyledTreeIcon = styled.span`
  display: flex;
  flex: none;
`
