import type { HeaderStateType } from "../components/Header/Header.types"

/**
 * The header's state from its scroll facts: `forced` (the `state` prop) wins; otherwise not stuck is
 * "static", and while stuck, hidden beats released (a hidden header stays out of view past the
 * boundary), released beats stuck.
 *
 * @param facts - stuck (geometry), hidden (headroom), push (pixels pushed out by stopAt), forced
 * @returns The header state
 */
export const getHeaderState = ({
  stuck,
  hidden,
  push,
  forced,
}: {
  stuck: boolean
  hidden: boolean
  push: number
  forced?: HeaderStateType
}): HeaderStateType => {
  if (forced) return forced
  if (!stuck) return "static"
  if (hidden) return "hidden"
  return push > 0 ? "released" : "stuck"
}
