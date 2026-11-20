import styled from "styled-components"
import { getConstantKey, getToken } from "@niceprototypes/styles"
import type { FlowItemSpaceType } from "./FlowItem.types"

/**
 * A block child of a Flow with its own space: it re-maps the `flow.block` tokens on itself,
 * so the Flow's block rule (and the density) gives it this space. The edges still sit flush.
 */
export const StyledFlowItem = styled.div<{ $before?: FlowItemSpaceType; $after?: FlowItemSpaceType }>`
  ${({ $before }) => ($before ? `${getConstantKey("flow.block:before")}: ${getToken("gap", $before)};` : "")}
  ${({ $after }) => ($after ? `${getConstantKey("flow.block:after")}: ${getToken("gap", $after)};` : "")}
`
