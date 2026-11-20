import styled from "styled-components"
import { getConstantKey, getToken } from "@niceprototypes/styles"
import type { FlowItemBleedType, FlowItemSpaceType } from "./FlowItem.types"

/**
 * A block child of a Flow with its own space: it re-maps the `flow.block` tokens on itself,
 * so the Flow's block rule (and the density) gives it this space. The edges still sit flush.
 * A bleeding item reaches past the column's sides by `flow.bleed`.
 */
export const StyledFlowItem = styled.div<{ $before?: FlowItemSpaceType; $after?: FlowItemSpaceType; $bleed?: FlowItemBleedType }>`
  ${({ $before }) => ($before ? `${getConstantKey("flow.block:before")}: ${getToken("gap", $before)};` : "")}
  ${({ $after }) => ($after ? `${getConstantKey("flow.block:after")}: ${getToken("gap", $after)};` : "")}
  /* Bleed: out by flow.bleed on each side, and flow.itemBleed set for getBleedRadius in the tile inside. */
  ${({ $bleed }) =>
    $bleed ? `margin-inline: calc(-1 * ${getToken("flow.bleed")}); ${getConstantKey("flow.itemBleed")}: ${getToken("flow.bleed")};` : ""}
`
