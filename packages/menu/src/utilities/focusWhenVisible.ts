/** Frames to keep retrying before giving up (about one second at 60 fps). */
const MAX_FRAMES = 60

/**
 * Focuses `element`, retrying each animation frame until it holds focus. A Popover hides its
 * surface (`visibility: hidden`) until it has measured and placed it, and a hidden element cannot
 * take focus, so a menu that mounts inside one is focused once it shows.
 *
 * @param element - Element to focus
 * @returns Cancels a pending retry
 */
export function focusWhenVisible(element: HTMLElement): () => void {
  let frame = 0
  let frames = 0
  const attempt = () => {
    element.focus()
    if (document.activeElement !== element && element.isConnected && ++frames < MAX_FRAMES) {
      frame = requestAnimationFrame(attempt)
    }
  }
  attempt()
  return () => cancelAnimationFrame(frame)
}
