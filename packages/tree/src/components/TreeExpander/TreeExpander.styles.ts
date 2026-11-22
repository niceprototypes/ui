import styled, { css } from "styled-components"
import { getToken } from "@niceprototypes/styles"
import { column } from "../../utilities/treeGuideGeometry"

/** The ancestor a whole row hovers on (Tree's row, a table row): hovering it lights the expander like the label. */
export const TREE_ROW_ATTRIBUTE = "data-tree-row"

/**
 * The expander: a node on the guide. Its box (`tree.icon.size`) comes right after the guide in
 * the row and is pulled back one column (`tree.guide.indent`) with no net width, so the circle
 * centres on the row's own junction (the rail's axis at mid-height) and the label keeps its place.
 * The circle (`tree.expander.size`) has an opaque fill (`tree.expander.backgroundColor`, the
 * surface), so the rail and the arm's start do not show through it; the arm leaves its right
 * edge. Circle and caret are drawn like the guide lines: `tree.guide.width` thick in
 * `tree.expander.color` (the guide colour; `hover` while the row or the expander is hovered, the
 * label's own hover colour; `active` on the active path). A button gets a hit area of at least
 * `tree.expander.touchTarget` on coarse pointers, without a taller row.
 */
export const StyledTreeExpander = styled.span<{ $active: boolean }>`
  position: relative;
  display: inline-flex;
  flex: none;
  align-self: center;
  align-items: center;
  justify-content: center;
  width: ${getToken("tree.icon.size")};
  height: ${getToken("tree.icon.size")};
  margin: 0;
  margin-inline-start: calc(-1 * ${column});
  margin-inline-end: calc(${column} - ${getToken("tree.icon.size")});
  padding: 0;
  border: 0;
  background: none;
  color: ${({ $active }) => getToken(`tree.expander.color:${$active ? "active" : "base"}`)};
  ${getToken("icon.color", { as: "key" })}: currentColor;
  ${getToken("icon.size", { as: "key" })}: ${getToken("tree.expander.iconSize")};

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: ${getToken("tree.expander.size")};
    height: ${getToken("tree.expander.size")};
    box-sizing: border-box;
    border: ${getToken("tree.guide.width")} solid currentColor;
    border-radius: 50%;
    background-color: ${getToken("tree.expander.backgroundColor")};
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  & svg {
    position: relative;
  }

  & svg :is(path, polyline, line) {
    stroke-width: ${getToken("tree.guide.width")};
  }

  ${({ $active }) =>
    !$active &&
    css`
      &:hover,
      [${TREE_ROW_ATTRIBUTE}]:hover & {
        color: ${getToken("tree.expander.color:hover")};
      }
    `}

  &:is(button) {
    cursor: pointer;

    &:focus-visible {
      outline: ${getToken("focusRing", "width")} solid ${getToken("focusRing", "color")};
      outline-offset: ${getToken("focusRing", "width")};
      border-radius: 50%;
    }

    @media (pointer: coarse) {
      &::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        min-width: ${getToken("tree.expander.touchTarget")};
        min-height: ${getToken("tree.expander.touchTarget")};
        transform: translate(-50%, -50%);
      }
    }
  }

  &[data-decorative] {
    cursor: pointer;
  }
`

/**
 * The caret: one right-pointing icon, turned a quarter to point down, the turn animated over
 * `tree.expander.animationDuration` with `tree.expander.animationEasing`; no animation under
 * reduced motion.
 */
export const StyledTreeExpanderCaret = styled.span<{ $caret: "right" | "bottom" }>`
  display: inline-flex;
  transform: rotate(${({ $caret }) => ($caret === "bottom" ? "90deg" : "0deg")});
  transition: transform ${getToken("tree.expander.animationDuration")} ${getToken("tree.expander.animationEasing")};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

/**
 * The expander's place in a row without one: no width, so a row that spaces its items with a gap
 * (a table cell) puts its label at the same x as a row with an expander.
 */
export const StyledTreeExpanderSlot = styled.span`
  flex: none;
  width: 0;
`
