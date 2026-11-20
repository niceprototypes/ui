import styled from "styled-components"
import { getBleedRadius } from "@niceprototypes/flow"
import { getConstantKey, getToken } from "@niceprototypes/styles"

/** The example's Code card with square corners while it bleeds edge to edge (getBleedRadius), rounded otherwise. */
export const StyledExampleBlocksTile = styled.div`
  ${getConstantKey("code.borderRadius")}: ${getBleedRadius(getToken("borderRadius"))};
`
