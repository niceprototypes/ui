import styled from "styled-components"
import { getToken as getCoreToken } from "@niceprototypes/styles"
import { getToken } from "../../nice/tokens"

/** A typed callout: a docs panel (Stripe's API reference aside box), ruled and rounded. */
export const StyledCallout = styled.aside`
  overflow: hidden;
  border: ${getToken("docs", "ruleWidth")} solid ${getToken("docs", "ruleColor")};
  border-radius: ${getCoreToken("borderRadius")};
  background-color: ${getToken("docs", "panelBackgroundColor")};
`

/** The panel's header bar: its title small and in capitals, on the header step, ruled off from the body. */
export const StyledCalloutHeader = styled.div`
  padding: ${getCoreToken("gap", "small")} ${getCoreToken("gap")};
  border-block-end: ${getToken("docs", "ruleWidth")} solid ${getToken("docs", "ruleColor")};
  background-color: ${getToken("docs", "panelHeaderBackgroundColor")};
  text-transform: uppercase;
`

/** The panel's body. */
export const StyledCalloutBody = styled.div`
  padding: ${getCoreToken("gap", "small")} ${getCoreToken("gap")};
`
