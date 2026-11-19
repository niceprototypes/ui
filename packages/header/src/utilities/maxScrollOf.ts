/**
 * The root's largest in-bounds scroll position. Read each frame: the iOS toolbar and content changes move it.
 *
 * @param root - The scroll container; null for the window
 * @returns scrollHeight minus the visible height
 */
export const maxScrollOf = (root: HTMLElement | null): number => {
  const element = root ?? document.scrollingElement ?? document.documentElement
  return element.scrollHeight - element.clientHeight
}
