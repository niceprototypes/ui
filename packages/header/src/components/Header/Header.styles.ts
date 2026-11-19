import styled, { createGlobalStyle, css, keyframes } from "styled-components"
import { getToken } from "@niceprototypes/styles"
import { HEADER_ROOT_ATTRIBUTE } from "../../utilities/setHeaderRootMetrics"

/** One visual state's resolved CSS values. */
export type HeaderResolvedAppearanceType = {
  backgroundColor: string
  color: string
  borderColor: string
  boxShadow: string
  fontSize: string
}

/** The CSS `position` the header renders with. */
export type HeaderCssPositionType = "static" | "relative" | "sticky" | "fixed"

/** The properties that transition between states. */
const TRANSITIONED = ["background-color", "color", "border-color", "box-shadow", "font-size", "padding-top", "transform"]

/** Slides the header in from above its stuck place, when it sticks after scrolling away (`threshold`). */
const enter = (offset: string) => keyframes`
  from {
    transform: translateY(calc(-100% - ${offset}));
  }
`

const appearance = (values: HeaderResolvedAppearanceType) => css`
  background-color: ${values.backgroundColor};
  color: ${values.color};
  border-block-end-color: ${values.borderColor};
  box-shadow: ${values.boxShadow};
  font-size: ${values.fontSize};
`

/**
 * The header. `data-state` drives the visual state: the default appearance while static, the stuck
 * appearance while stuck, hidden or released; hidden slides it out above the top unless focus is
 * inside it. At the top edge (`$atTop`) it pads its top by the safe-area inset; fixed, it spans the
 * viewport and pads its physical sides by the side insets (the reset pads the body's sides, which a
 * fixed element escapes). Transitions use the given duration and easing and stop under reduced motion.
 * No `backdrop-filter`: WebKit mis-renders it on sticky elements (bug 298709), so the stuck background is opaque.
 */
export const StyledHeader = styled.header<{
  $position: HeaderCssPositionType
  $atTop: boolean
  $offset: string
  $default: HeaderResolvedAppearanceType
  $stuck: HeaderResolvedAppearanceType
  $duration: string
  $easing: string
  $hideable: boolean
}>`
  display: block;
  box-sizing: border-box;
  position: ${({ $position }) => $position};
  border-block-end-style: solid;
  border-block-end-width: ${getToken("header.borderWidth")};
  ${({ $default }) => appearance($default)};
  transition-property: ${TRANSITIONED.join(", ")};
  transition-duration: ${({ $duration }) => $duration};
  transition-timing-function: ${({ $easing }) => $easing};

  ${({ $atTop }) =>
    $atTop &&
    css`
      padding-top: ${getToken("header.safeArea.top")};
    `}

  ${({ $position, $offset }) =>
    ($position === "sticky" || $position === "fixed") &&
    css`
      top: ${$offset};
      z-index: ${getToken("header.zIndex")};
    `}

  ${({ $position }) =>
    $position === "fixed" &&
    css`
      left: 0;
      right: 0;
      padding-left: ${getToken("header.safeArea.left")};
      padding-right: ${getToken("header.safeArea.right")};
    `}

  ${({ $hideable }) =>
    $hideable &&
    css`
      will-change: transform;
    `}

  &[data-state="stuck"],
  &[data-state="hidden"],
  &[data-state="released"] {
    ${({ $stuck }) => appearance($stuck)};
  }

  &[data-state="hidden"] {
    transform: translateY(calc(-100% - ${({ $offset }) => $offset}));
  }

  &[data-state="hidden"]:focus-within {
    transform: none;
  }

  &[data-enter] {
    animation: ${({ $offset }) => enter($offset)} ${({ $duration }) => $duration} ${({ $easing }) => $easing};
  }

  /* Wins over the reset's global 0.01ms rule (also !important, lower specificity). */
  @media (prefers-reduced-motion: reduce) {
    transition-duration: 0s !important;
    animation: none !important;
  }
`

/**
 * The root's scroll padding: the tallest positioned header's height plus offset, so in-page links and
 * scrollIntoView land below it. Zero specificity, so a consumer's own `scroll-padding-top` wins.
 */
export const HeaderRootStyle = createGlobalStyle`
  :where([${HEADER_ROOT_ATTRIBUTE}]) {
    scroll-padding-top: ${getToken("header.inset")};
  }
`

/**
 * Zero-height marker at the point where the header sticks: its place shifted down by `threshold`
 * and up by `offset`. The header is stuck while this point is above the root's top.
 */
export const StyledHeaderSentinel = styled.div<{ $shift: string }>`
  position: relative;
  top: ${({ $shift }) => $shift};
  height: 0;
  pointer-events: none;
`

/** Holds a fixed header's place in the flow; its min-height is the header's measured default height. */
export const StyledHeaderPlaceholder = styled.div`
  display: block;
`
