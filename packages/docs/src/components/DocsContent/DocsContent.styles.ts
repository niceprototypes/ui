import styled from "styled-components"
import { getFlowStyle } from "@niceprototypes/flow"
import { getToken as getCoreToken } from "@niceprototypes/styles"
import { getToken } from "../../nice/tokens"

/**
 * A docs page's content as a Flow column (getFlowStyle; the element carries `data-flow`): the
 * `flow` tokens space the headings, prose, code, tables and rules. These rules only shape MDX
 * output for that flow: prose and links laid out inline become blocks, and `<br>` spacers give
 * way to the flow.
 */
export const StyledDocsContent = styled.div`
  ${getFlowStyle()}

  && > br {
    display: none;
  }

  && > span {
    display: block;
  }

  /* Bare MDX links only: a styled link component (it carries a class) keeps its own display. */
  && > a:not([class]) {
    display: block;
    width: fit-content;
  }

  /* Bare markdown elements are semibold, as the docs Ink headings are: the docs use no bold. A component's own element (it carries a class) keeps its weight. */
  :is(strong, b, th, h1, h2, h3, h4, h5, h6):not([class]) {
    font-weight: ${getCoreToken("fontWeight", "semibold")};
  }

  /* A subsection heading is underlined by a subsection rule (DocsRule's tokens), inset to the
     column, a base gap below its text; the h3's flow after-space follows the rule. */
  && > h3 {
    padding-block-end: ${getCoreToken("gap", "base")};
    border-block-end: ${getToken("docs", "ruleWidth")} solid ${getToken("docs", "ruleColor")};
  }

  /* Headings scroll to where Contents sticks, like sections. */
  h2[id],
  h3[id] {
    scroll-margin-top: ${getToken("contents.top")};
  }
`
