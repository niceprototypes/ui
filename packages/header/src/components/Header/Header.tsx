import * as React from "react"
import { getToken } from "@niceprototypes/styles"
import { HEADER_TOLERANCE } from "../../constants"
import { normalizeTolerance } from "../../utilities/normalizeTolerance"
import { resolveAppearance } from "../../utilities/resolveAppearance"
import { useHeaderScroll } from "../../utilities/useHeaderScroll"
import { HeaderRootStyle, StyledHeader, StyledHeaderPlaceholder, StyledHeaderSentinel, type HeaderCssPositionType } from "./Header.styles"
import type { HeaderProps } from "./Header.types"

/**
 * Header
 *
 * The outer page-header wrapper: static by default; sticky or fixed with its height kept in the flow
 * and exposed on the root as `--np--header--height` and `--np--header--inset` (height plus offset; an
 * overridable rule makes it the root's `scroll-padding-top`, so anchor links land below it). While stuck it takes the stuck appearance; `hideOnScroll` hides it
 * on scroll down and reveals it on scroll up; `stopAt` releases it to scroll away. Transitions between
 * states use `transitionDuration` and `transitionEasing`, and stop under reduced motion.
 *
 * @example
 * ```tsx
 * <Header position="sticky" hideOnScroll>
 *   <Logo />
 * </Header>
 * ```
 */
const Header: React.FC<HeaderProps> = ({
  children,
  position = "static",
  offset = getToken("header.offset"),
  threshold = 0,
  stopAt,
  hideOnScroll = false,
  tolerance = HEADER_TOLERANCE,
  root,
  appearance,
  transitionDuration,
  transitionEasing,
  state: forced,
  onStateChange,
  resetKey,
}) => {
  const headerRef = React.useRef<HTMLElement>(null)
  const sentinelRef = React.useRef<HTMLDivElement>(null)
  const placeholderRef = React.useRef<HTMLDivElement>(null)
  const { up, down } = normalizeTolerance(tolerance)
  const toleranceValue = React.useMemo(() => ({ up, down }), [up, down])

  // In a scroll container, fixed renders sticky: fixed is relative to the viewport.
  const mode = position === "fixed" && root ? "sticky" : position
  const outOfFlow = mode === "fixed"

  const { state, enter, mounted, keyboard, atTop } = useHeaderScroll({
    headerRef,
    sentinelRef,
    placeholderRef,
    mode,
    outOfFlow,
    root,
    offset,
    threshold,
    stopAt,
    hideOnScroll,
    tolerance: toleranceValue,
    forced,
    onStateChange,
    resetKey,
  })

  // With a threshold the header stays in the flow (relative) until it sticks; without one it is
  // always sticky or fixed, so the browser pins it with no frame of lag. Fixed also stays in the flow
  // until mounted (no script: nothing covered; hydration: no shift) and while the keyboard is open.
  const pinned = threshold === 0 || state !== "static"
  const cssPosition: HeaderCssPositionType =
    mode === "static" ? "static" : mode === "fixed" && (!mounted || keyboard) ? "relative" : pinned ? mode : "relative"

  const header = (
    <StyledHeader
      ref={headerRef}
      data-state={state}
      data-enter={enter && threshold > 0 ? "" : undefined}
      data-keyboard={keyboard ? "" : undefined}
      $position={cssPosition}
      $atTop={atTop}
      $offset={offset}
      $default={resolveAppearance("base", appearance?.default)}
      $stuck={resolveAppearance("stuck", appearance?.stuck)}
      $duration={transitionDuration ? getToken("animationDuration", transitionDuration) : getToken("header.transitionDuration")}
      $easing={transitionEasing ? getToken("animationEasing", transitionEasing) : getToken("header.transitionEasing")}
      $hideable={hideOnScroll}
    >
      {children}
    </StyledHeader>
  )

  if (mode === "static") return header

  const sentinel = <StyledHeaderSentinel ref={sentinelRef} aria-hidden $shift={`calc(${threshold}px - ${offset})`} />

  if (outOfFlow)
    return (
      <StyledHeaderPlaceholder ref={placeholderRef}>
        <HeaderRootStyle />
        {sentinel}
        {header}
      </StyledHeaderPlaceholder>
    )

  return (
    <>
      <HeaderRootStyle />
      {sentinel}
      {header}
    </>
  )
}

export default Header
