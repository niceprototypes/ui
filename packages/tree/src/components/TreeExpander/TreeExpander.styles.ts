import styled, { css } from "styled-components"
import { getToken } from "@niceprototypes/styles"
import { activeColor, guideColor, iconGap } from "../../utilities/treeGuideGeometry"

/**
 * The expander: the size of `tree.icon.size`, so the guide's rail drops from its centre. A circle
 * centred on it (`tree.expander.size`, the small Checkbox box) holds the caret
 * (`tree.expander.iconSize`); circle and caret take `tree.expander.color` (the Checkbox's
 * unchecked border; its hover border on hover; `active` on the active path). No fill. The circle
 * is drawn, not laid out, so the row and the guide geometry do not move. A button gets a hit area
 * of at least `tree.expander.touchTarget` on coarse pointers, without a taller row.
 */
export const StyledTreeExpander = styled.span<{ $active: boolean }>`
  position: relative;
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: ${getToken("tree.icon.size")};
  height: ${getToken("tree.icon.size")};
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
    top: 50%;
    left: 50%;
    width: ${getToken("tree.expander.size")};
    height: ${getToken("tree.expander.size")};
    box-sizing: border-box;
    border: ${getToken("tree.expander.borderWidth")} solid currentColor;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  &:is(button) {
    cursor: pointer;

    ${({ $active }) =>
      !$active &&
      css`
        &:hover {
          color: ${getToken("tree.expander.color:hover")};
        }
      `}

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
`

/**
 * The expander's slot in a row without one, so labels line up. With `$arm`, the guide's arm runs
 * on through it (and the icon gap before it) at mid-height, in the guide colour or, on the active
 * path, `tree.activeColor`.
 */
export const StyledTreeExpanderSlot = styled.span<{ $arm: boolean; $active: boolean }>`
  position: relative;
  flex: none;
  align-self: stretch;
  width: ${getToken("tree.icon.size")};

  ${({ $arm, $active }) =>
    $arm &&
    css`
      &::before {
        content: "";
        position: absolute;
        top: calc(50% - ${getToken("tree.guide.width")} / 2);
        left: calc(-1 * ${iconGap});
        right: 0;
        height: ${getToken("tree.guide.width")};
        background: ${$active ? activeColor : guideColor};
      }
    `}
`
