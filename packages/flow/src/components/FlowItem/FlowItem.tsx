import * as React from "react"
import { StyledFlowItem } from "./FlowItem.styles"
import type { FlowItemProps } from "./FlowItem.types"

/**
 * FlowItem
 *
 * The per-element escape hatch: one child of a Flow with its own space before and after, as
 * core gap tokens, and `bleed` to reach past the column's sides to the page's edge. It wraps
 * its content in a block, so the space is the item's, whatever it holds.
 *
 * @example
 * <Flow>
 *   <Ink as="h2">Results</Ink>
 *   <FlowItem before="small"><Badge>Beta</Badge></FlowItem>
 * </Flow>
 */
const FlowItem: React.FC<FlowItemProps> = ({ children, before, after, bleed = false }) => (
  <StyledFlowItem $before={before} $after={after} $bleed={bleed}>
    {children}
  </StyledFlowItem>
)

export default FlowItem
