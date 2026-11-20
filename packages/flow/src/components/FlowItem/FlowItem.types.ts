import * as React from "react"
import type { GapType } from "@niceprototypes/styles"

/**
 * FlowItemSpaceType
 *
 * One side's space, as a core `gap` token variant (multiplied by the Flow's density).
 */
export type FlowItemSpaceType = GapType

/**
 * FlowItemProps
 *
 * Complete prop definition for the FlowItem component.
 */
export interface FlowItemProps {
  /** The element whose space this item sets */
  children?: React.ReactNode
  /** Space before this item; unset keeps the `flow.block` before-space */
  before?: FlowItemSpaceType
  /** Space after this item; unset keeps the `flow.block` after-space */
  after?: FlowItemSpaceType
}

// Declaration merging: const + namespace creates exportable type namespace
const FlowItemTypes = {} as const

namespace FlowItemTypes {
  export type Space = FlowItemSpaceType
  export type Props = FlowItemProps
}

export default FlowItemTypes
