/**
 * How far `stopAt` pushes the stuck header up, in pixels (0: not pushed).
 *
 * - A number: the root's scroll distance; past it the header scrolls away one-to-one with the content.
 * - An element: its bottom edge, in the root's viewport coordinates, pushes the header's bottom edge
 *   (`top + height`) up, the way a sticky element's containing block ends.
 *
 * @param input - stopAt (number), or boundaryBottom (px from the root's top); y, top, height of the header
 * @returns Pixels to translate the header up
 */
export const getStopPush = ({
  stopAt,
  boundaryBottom,
  y,
  top,
  height,
}: {
  stopAt?: number
  boundaryBottom?: number
  y: number
  top: number
  height: number
}): number => {
  if (stopAt !== undefined) return Math.max(0, y - stopAt)
  if (boundaryBottom !== undefined) return Math.max(0, top + height - boundaryBottom)
  return 0
}
