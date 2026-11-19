/** Headroom memory between scroll frames. */
export type HeadroomStateType = {
  /** Whether the header is hidden */
  hidden: boolean
  /** The last in-bounds scroll position */
  lastY: number
  /** The direction of the current run: 1 down, -1 up, 0 none yet */
  direction: 1 | -1 | 0
  /** Pixels scrolled in the current run's direction */
  travel: number
}

/** One scroll frame's facts. */
export type HeadroomInputType = {
  /** The root's scroll position (raw: negative or past maxY during overscroll) */
  y: number
  /** The largest in-bounds scroll position */
  maxY: number
  /** Whether the header is stuck */
  stuck: boolean
  /** The scroll position at which the header stuck */
  stuckAt: number
  /** The header's height: it never hides within this distance of where it stuck */
  height: number
  /** Pixels of one-direction travel before revealing (up) or hiding (down) */
  tolerance: { up: number; down: number }
}

/** The headroom memory before the first frame, at scroll position `y`. */
export const initialHeadroom = (y: number): HeadroomStateType => ({ hidden: false, lastY: y, direction: 0, travel: 0 })

/**
 * Advance the headroom (hide on scroll down, reveal on scroll up) by one scroll frame.
 *
 * - Overscroll (y < 0 or y > maxY: iOS rubber-band, macOS bounce) is ignored, so the bounce back
 *   never reads as a scroll up.
 * - Travel accumulates while the direction holds and restarts when it flips; only a run longer than
 *   the tolerance changes `hidden`, so short flicks and jitter do not toggle it.
 * - Not stuck, the header is shown; it hides only once the root has scrolled more than its height
 *   past where it stuck, so it never hides over its own place.
 *
 * @param previous - The memory after the last frame
 * @param input - This frame's facts
 * @returns The memory after this frame (`previous` itself when nothing changed)
 */
export const stepHeadroom = (previous: HeadroomStateType, input: HeadroomInputType): HeadroomStateType => {
  const { y, maxY, stuck, stuckAt, height, tolerance } = input
  if (y < 0 || y > maxY) return previous
  const delta = y - previous.lastY
  if (delta === 0) return previous
  const direction = delta > 0 ? 1 : -1
  const travel = direction === previous.direction ? previous.travel + Math.abs(delta) : Math.abs(delta)
  let hidden = previous.hidden
  if (!stuck) hidden = false
  else if (direction === 1 && travel > tolerance.down && y - stuckAt > height) hidden = true
  else if (direction === -1 && travel > tolerance.up) hidden = false
  return { hidden, lastY: y, direction, travel }
}
