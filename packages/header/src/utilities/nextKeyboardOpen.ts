import { HEADER_KEYBOARD_GAP } from "../constants"

/**
 * Whether the on-screen keyboard is open, with hysteresis: it opens past `open` pixels of gap
 * between the layout and visual viewports and closes below `close`.
 *
 * @param open - Whether it was open
 * @param gap - `innerHeight - visualViewport.height * visualViewport.scale` (pinch zoom cancels out)
 * @returns Whether it is open now
 */
export const nextKeyboardOpen = (open: boolean, gap: number): boolean =>
  open ? gap > HEADER_KEYBOARD_GAP.close : gap > HEADER_KEYBOARD_GAP.open
