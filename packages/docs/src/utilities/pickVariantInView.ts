/** A demo tile as the reader sees it: its variant and the top of its box, in viewport pixels. */
export type VariantTileType = { variant: string; top: number }

/**
 * The variant whose demo is at the reading position: the last tile, in page order, whose top has
 * crossed the activation `line`. Before the first tile reaches it, the first. Once the scroll
 * container is at its end (`atEnd`), the last tile whose top is visible (above `viewBottom`), so
 * short closing demos still activate. Position only, no history: the same scroll position always
 * gives the same variant.
 */
export const pickVariantInView = (
  tiles: readonly VariantTileType[],
  { line, atEnd, viewBottom }: { line: number; atEnd: boolean; viewBottom: number },
): string | undefined => {
  if (tiles.length === 0) return undefined
  const reach = atEnd ? viewBottom : line
  let active = tiles[0].variant
  for (const tile of tiles) if (tile.top <= reach) active = tile.variant
  return active
}
