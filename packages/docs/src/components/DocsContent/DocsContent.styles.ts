import styled from "styled-components"
import { getFlowStyle } from "@niceprototypes/flow"
import { getToken as getCoreToken } from "@niceprototypes/styles"
import { getToken } from "../../nice/tokens"
import { getHeadingRuleStyle } from "../DocsRule"

/**
 * A docs page's content as a Flow column (getFlowStyle; the element carries `data-flow`): the
 * `flow` tokens space the headings, prose, code, tables and rules (Flow makes inline links and
 * spans blocks). These rules only shape MDX output for that flow: `<br>` spacers give way to it.
 */
export const StyledDocsContent = styled.div`
  ${getFlowStyle()}

  && > br {
    display: none;
  }

  /* Bare markdown elements are semibold, as the docs Ink headings are: the docs use no bold. A component's own element (it carries a class) keeps its weight. */
  :is(strong, b, th, h1, h2, h3, h4, h5, h6):not([class]) {
    font-weight: ${getCoreToken("fontWeight", "semibold")};
  }

  /* Rules above headings, by level (DocsRule's HEADING_RULES). */
  ${getHeadingRuleStyle()}

  /* Headings scroll to where Contents sticks, like sections. */
  h2[id],
  h3[id] {
    scroll-margin-top: ${getToken("contents.top")};
  }
`
