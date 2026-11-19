import styled from "styled-components"
import { getToken } from "@niceprototypes/styles"

/**
 * One item row: icon, then label. Focus (keyboard, or a mouse moving over it) is the
 * `menu.item.backgroundColor:focus` highlight; in forced colours, where backgrounds are dropped,
 * it is a Highlight outline. A disabled item (`aria-disabled`) takes the disabled text colour,
 * which the Ink label inherits. On coarse pointers the row is at least `menu.touchTarget` tall.
 */
export const StyledMenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken("menu.item.gap")};
  padding-block: ${getToken("menu.item.paddingBlock")};
  padding-inline: ${getToken("menu.item.paddingInline")};
  border-radius: ${getToken("menu.item.borderRadius")};
  cursor: pointer;
  user-select: none;
  outline: none;

  &:focus {
    background-color: ${getToken("menu.item.backgroundColor:focus")};
  }

  &[aria-disabled="true"] {
    color: ${getToken("menu.item.color:disabled")};
    cursor: default;
  }

  @media (forced-colors: active) {
    &:focus {
      outline: ${getToken("focusRing", "width")} solid Highlight;
    }
  }

  @media (pointer: coarse) {
    min-block-size: ${getToken("menu.touchTarget")};
  }
`

/** The icon slot; keeps its intrinsic size. */
export const StyledMenuItemIcon = styled.span`
  display: flex;
  flex: none;
  align-items: center;
`

/** The label; takes the remaining inline space and may shrink. */
export const StyledMenuItemLabel = styled.span`
  flex: 1 1 auto;
  min-inline-size: 0;
`
