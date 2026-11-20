import styled from "styled-components"
import { getConstantKey, getToken } from "@niceprototypes/styles"
import { getFlowStyle } from "../../services/getFlowStyle"
import type { FlowDensityType, FlowSpaceType } from "./Flow.types"

/** The density and role overrides as the `flow` token properties they replace in this subtree. */
const getOverrides = ({ $density, $space }: { $density?: FlowDensityType; $space?: FlowSpaceType }) => [
  ...($density ? [`${getConstantKey("flow.density")}: ${getToken(`flow.density:${$density}`)};`] : []),
  ...Object.entries($space ?? {}).flatMap(([role, sides]) =>
    (["before", "after"] as const).flatMap(side =>
      sides?.[side] ? [`${getConstantKey(`flow.${role}:${side}`)}: ${getToken("gap", sides[side])};`] : [],
    ),
  ),
].join("\n")

/** The Flow container: the flow rules, plus this instance's token overrides. */
export const StyledFlow = styled.div<{ $density?: FlowDensityType; $space?: FlowSpaceType }>`
  margin: 0;
  ${getOverrides}
  ${getFlowStyle()}
`
