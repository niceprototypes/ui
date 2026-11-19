/**
 * The root's scroll position, raw (negative or past the end during overscroll).
 *
 * @param root - The scroll container; null for the window
 * @returns Pixels scrolled from the top
 */
export const scrollTopOf = (root: HTMLElement | null): number => (root ? root.scrollTop : window.scrollY)
