import styled, { css, keyframes } from "styled-components"
import { getToken } from "@niceprototypes/styles"

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
const TRANSITIONED = ["background-color", "color", "border-color", "box-shadow", "font-size", "transform"]

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
 * inside it. Positioned (sticky or fixed) it pads its top by the safe-area inset; its sides always
 * pad by the side insets. Transitions use the given duration and easing and stop under reduced motion.
 */
export const StyledHeader = styled.header<{
  $position: HeaderCssPositionType
  $positioned: boolean
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
  padding-inline-start: ${getToken("header.safeArea.left")};
  padding-inline-end: ${getToken("header.safeArea.right")};
  border-block-end-style: solid;
  border-block-end-width: ${getToken("header.borderWidth")};
  ${({ $default }) => appearance($default)};
  transition-property: ${TRANSITIONED.join(", ")};
  transition-duration: ${({ $duration }) => $duration};
  transition-timing-function: ${({ $easing }) => $easing};

  ${({ $positioned }) =>
    $positioned &&
    css`
      padding-block-start: ${getToken("header.safeArea.top")};
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

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    animation: none;
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
