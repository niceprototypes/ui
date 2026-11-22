import styled, { css } from "styled-components"
import { getToken } from "@niceprototypes/styles"
import { activeColor, guideColor } from "../../utilities/treeGuideGeometry"

/** The ancestor a whole row hovers on (Tree's row, a table row): hovering it lights the expander like the label. */
export const TREE_ROW_ATTRIBUTE = "data-tree-row"

/**
 * The expander: a circle (`tree.expander.size`) right after the row's guide, its left edge where
 * the guide's arm ends, holding the caret (`tree.expander.iconSize`). Circle and caret are drawn
 * like the guide lines: `tree.guide.width` thick in `tree.expander.color` (the guide colour;
 * `hover` while the row or the expander is hovered, the label's own hover colour; `active` on the
 * active path). A button gets a hit area of at least `tree.expander.touchTarget` on coarse
 * pointers, without a taller row.
 */
export const StyledTreeExpander = styled.span<{ $active: boolean }>`
  position: relative;
  display: inline-flex;
  flex: none;
  align-self: center;
  align-items: center;
  justify-content: center;
  width: ${getToken("tree.expander.size")};
  height: ${getToken("tree.expander.size")};
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  color: ${({ $active }) => getToken(`tree.expander.color:${$active ? "active" : "base"}`)};
  ${getToken("icon.color", { as: "key" })}: currentColor;
  ${getToken("icon.size", { as: "key" })}: ${getToken("tree.expander.iconSize")};

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    box-sizing: border-box;
    border: ${getToken("tree.guide.width")} solid currentColor;
    border-radius: 50%;
    pointer-events: none;
  }

  /* The caret's stroke stays the guide's width at any icon size, like the circle's. */
  & svg :is(path, polyline, line) {
    stroke-width: ${getToken("tree.guide.width")};
    vector-effect: non-scaling-stroke;
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

  /* Top-aligned rows (a table's offset mode): on the first text line, where the guide's arm meets
     the row, however many lines the label wraps to. */
  [data-tree-guide-arm="offset"] & {
    align-self: flex-start;
    margin-block-start: calc((1lh - ${getToken("tree.expander.size")}) / 2);
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
 * The expander's place in a row without one: a circle-wide slot, so labels line up. With `$arm`
 * (a row under a guide) the guide's arm runs on through it at mid-height to its end, the circle's
 * right edge, in the guide colour or, on the active path, `tree.activeColor`.
 */
export const StyledTreeExpanderSlot = styled.span<{ $arm: boolean; $active: boolean }>`
  position: relative;
  flex: none;
  align-self: stretch;
  width: ${getToken("tree.expander.size")};

  ${({ $arm, $active }) =>
    $arm &&
    css`
      &::before {
        content: "";
        position: absolute;
        top: calc(50% - ${getToken("tree.guide.width")} / 2);
        left: 0;
        right: 0;
        height: ${getToken("tree.guide.width")};
        background: ${$active ? activeColor : guideColor};
      }
    `}

  /* Top-aligned rows (a table's offset mode): the arm on the first text line, like the guide's. */
  [data-tree-guide-arm="offset"] & {
    &::before {
      top: calc(0.5lh - ${getToken("tree.guide.width")} / 2);
    }
  }
`
