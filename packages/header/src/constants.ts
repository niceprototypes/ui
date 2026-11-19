/** Default `tolerance`: pixels of one-direction scrolling before hideOnScroll reveals (`up`) or hides (`down`). */
export const HEADER_TOLERANCE = { up: 8, down: 24 } as const

/**
 * The on-screen keyboard is open when the visual viewport is this many pixels shorter than the layout
 * viewport; it closes below `close`. The 60px gap between them is the hysteresis: the iOS toolbar
 * collapsing or a suggestion bar appearing never flips it.
 */
export const HEADER_KEYBOARD_GAP = { open: 120, close: 60 } as const

/** Milliseconds without a scroll event that end a pause (after an in-page link, hashchange or focus), where `scrollend` is unsupported. */
export const HEADER_PAUSE_QUIET = 150
