import type * as React from "react"
import type {
  AnimationDurationType,
  AnimationEasingType,
  BackgroundColorType,
  BorderColorType,
  BoxShadowType,
  ColorType,
  FontSizeType,
} from "@niceprototypes/styles"

/**
 * HeaderPositionType
 *
 * How the header sits on the page.
 *
 * Values:
 * - "static": In the flow; scrolls away with the content (default)
 * - "sticky": CSS `position: sticky`; stays in the flow and sticks at `offset` inside its containing
 *   block, so it stops sticking at the containing block's end without script
 * - "fixed": Pinned to the viewport; a placeholder of its height holds its place in the flow.
 *   Unaffected by ancestors' overflow or height. It stays in the flow until mounted (so a page
 *   without script, or before hydration, shows it above the content), and while the on-screen
 *   keyboard is open. Inside a `root` scroll container it renders sticky. Prefer "sticky" where it works.
 */
export type HeaderPositionType = "static" | "sticky" | "fixed"

/**
 * HeaderOffsetType
 *
 * Distance from the top of the viewport (or `root`) at which the header sticks, a CSS length
 * (`"8px"`, a `getToken` var). Defaults to the `header.offset` token.
 */
export type HeaderOffsetType = string

/**
 * HeaderThresholdType
 *
 * Pixels the root scrolls past the header's place before it sticks. 0 (default) sticks as soon as
 * it reaches `offset`; a larger value lets it scroll away first, then it slides back in, stuck.
 */
export type HeaderThresholdType = number

/**
 * HeaderStopAtType
 *
 * Where the header stops sticking and scrolls away with the content.
 *
 * Values:
 * - number: The root's scroll distance in pixels
 * - element or ref: The element whose bottom edge pushes the header up and out
 */
export type HeaderStopAtType = number | HTMLElement | React.RefObject<HTMLElement | null>

/**
 * HeaderHideOnScrollType
 *
 * Headroom: while stuck, scrolling down hides the header and scrolling up reveals it. It is revealed at
 * the end of the content and by focus inside it; in-page links, hashchanges, focus-driven scrolls and
 * the open on-screen keyboard neither hide nor reveal it.
 */
export type HeaderHideOnScrollType = boolean

/**
 * HeaderToleranceType
 *
 * Pixels of continuous scrolling in one direction before `hideOnScroll` hides (`down`) or reveals
 * (`up`) the header, so short flicks and jitter do not toggle it. A number sets both.
 */
export type HeaderToleranceType = number | { up: number; down: number }

/**
 * HeaderRootType
 *
 * The scroll container the header measures against, an element or a ref. Unset: the window.
 */
export type HeaderRootType = HTMLElement | React.RefObject<HTMLElement | null>

/**
 * HeaderStateType
 *
 * The header's scroll state, set as `data-state` on the element.
 *
 * Values:
 * - "static": In its place in the flow (not stuck)
 * - "stuck": Stuck at `offset`
 * - "hidden": Stuck, slid out above the top by `hideOnScroll`
 * - "released": Past `stopAt`; scrolling away with the content
 */
export type HeaderStateType = "static" | "stuck" | "hidden" | "released"

/**
 * HeaderAppearanceType
 *
 * The header's colours and font size in one visual state. Each value is a core token variant.
 * `borderColor` and `boxShadow` also take `"none"`.
 */
export type HeaderAppearanceType = {
  /** Background colour, a core `backgroundColor` variant */
  backgroundColor?: BackgroundColorType
  /** Text colour, a core `color` variant */
  color?: ColorType
  /** Bottom border colour, a core `borderColor` variant or "none" */
  borderColor?: BorderColorType | "none"
  /** Shadow, a core `boxShadow` variant or "none" */
  boxShadow?: BoxShadowType | "none"
  /** Font size, a core `fontSize` variant; children sized in `em` follow it */
  fontSize?: FontSizeType
}

/**
 * HeaderAppearancesType
 *
 * The appearance per visual state: `default` while static, `stuck` while stuck, hidden or released.
 * Unset values take the `header.*:base` and `header.*:stuck` tokens.
 */
export type HeaderAppearancesType = {
  default?: HeaderAppearanceType
  stuck?: HeaderAppearanceType
}

/**
 * HeaderTransitionDurationType
 *
 * Re-export of AnimationDurationType from @niceprototypes/styles. Duration of the transitions
 * between states (appearance and hide/reveal). Unset: the `header.transitionDuration` token.
 */
export type HeaderTransitionDurationType = AnimationDurationType

/**
 * HeaderTransitionEasingType
 *
 * Re-export of AnimationEasingType from @niceprototypes/styles. Easing of the transitions between
 * states. Unset: the `header.transitionEasing` token.
 */
export type HeaderTransitionEasingType = AnimationEasingType

/**
 * HeaderOnStateChangeType
 *
 * Called with the new state each time it changes.
 */
export type HeaderOnStateChangeType = (state: HeaderStateType) => void

/**
 * HeaderResetKeyType
 *
 * A value that changes on a route change (a pathname, a page id). When it changes, hideOnScroll
 * forgets the last scroll run and the header is shown, without Header knowing the router.
 */
export type HeaderResetKeyType = string | number

/**
 * HeaderProps
 *
 * Complete prop definition for the Header component.
 */
export interface HeaderProps {
  /** The header's content */
  children?: React.ReactNode
  /** How the header sits on the page; "static" by default */
  position?: HeaderPositionType
  /** Distance from the top at which it sticks; defaults to the `header.offset` token */
  offset?: HeaderOffsetType
  /** Pixels scrolled past its place before it sticks */
  threshold?: HeaderThresholdType
  /** Where it stops sticking: a scroll distance, or an element whose bottom pushes it out */
  stopAt?: HeaderStopAtType
  /** Hide on scroll down, reveal on scroll up, while stuck */
  hideOnScroll?: HeaderHideOnScrollType
  /** Pixels of one-direction scrolling before hideOnScroll hides or reveals */
  tolerance?: HeaderToleranceType
  /** The scroll container; unset: the window */
  root?: HeaderRootType
  /** Colours and font size per visual state */
  appearance?: HeaderAppearancesType
  /** Duration of the transitions between states */
  transitionDuration?: HeaderTransitionDurationType
  /** Easing of the transitions between states */
  transitionEasing?: HeaderTransitionEasingType
  /** Render this state instead of the scroll-derived one */
  state?: HeaderStateType
  /** Called when the state changes */
  onStateChange?: HeaderOnStateChangeType
  /** Change it on a route change to show the header and restart hideOnScroll */
  resetKey?: HeaderResetKeyType
}

// Declaration merging: const + namespace creates exportable type namespace
const HeaderTypes = {} as const

namespace HeaderTypes {
  export type Position = HeaderPositionType
  export type Offset = HeaderOffsetType
  export type Threshold = HeaderThresholdType
  export type StopAt = HeaderStopAtType
  export type HideOnScroll = HeaderHideOnScrollType
  export type Tolerance = HeaderToleranceType
  export type Root = HeaderRootType
  export type State = HeaderStateType
  export type Appearance = HeaderAppearanceType
  export type Appearances = HeaderAppearancesType
  export type TransitionDuration = HeaderTransitionDurationType
  export type TransitionEasing = HeaderTransitionEasingType
  export type OnStateChange = HeaderOnStateChangeType
  export type ResetKey = HeaderResetKeyType
  export type Props = HeaderProps
}

export default HeaderTypes
