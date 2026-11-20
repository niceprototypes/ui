import { getToken } from "@niceprototypes/styles"

/**
 * getBleedRadius
 *
 * A tile's corner radius tied to its bleed state: inside a bleeding FlowItem, the radius less
 * the reach (`flow.itemBleed`, floored at 0), so a tile that runs edge to edge has square
 * corners; elsewhere, and where the page sets no bleed, the radius. Pass the radius token's value.
 *
 * @example
 * border-radius: ${getBleedRadius(getToken("borderRadius"))};
 */
export const getBleedRadius = (radius: string): string =>
  `max(calc(${radius} * 0), calc(${radius} - ${getToken("flow.itemBleed")}))`
