import * as React from "react"
import { FLOW_ATTRIBUTE } from "../../constants"
import { StyledFlow } from "./Flow.styles"
import type { FlowProps } from "./Flow.types"

/**
 * Flow
 *
 * Spaces a vertical stack of content by role and adjacency: headings h1–h6 more space before
 * than after, text, lists, blockquotes, tables, code, media, rules and any other block from the
 * `flow` tokens, times the density. The first and last child sit flush; a Flow nested in a Flow
 * joins its rhythm instead of adding to it.
 *
 * Modify the rhythm globally by re-mapping the `flow` tokens (setTokens, per breakpoint), per
 * instance with `density` and `space`, and per element with FlowItem.
 *
 * @example
 * <Flow>
 *   <Ink as="h2">Install</Ink>
 *   <Ink as="p">One package per component.</Ink>
 *   <Code code="npm i @niceprototypes/flow" />
 * </Flow>
 */
const Flow: React.FC<FlowProps> = ({ children, as = "div", density, space, id, ref }) => (
  <StyledFlow
    as={as}
    id={id}
    ref={ref as React.Ref<HTMLDivElement>}
    $density={density}
    $space={space}
    {...{ [FLOW_ATTRIBUTE]: "" }}
  >
    {children}
  </StyledFlow>
)

export default Flow
