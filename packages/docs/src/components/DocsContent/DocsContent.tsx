import * as React from "react"
import { FLOW_ATTRIBUTE } from "@niceprototypes/flow"
import { StyledDocsContent } from "./DocsContent.styles"

/**
 * DocsContent
 *
 * A docs page's content (an MDX page, a docs section page) as a Flow column:
 * headings, prose, code, tables and rules spaced from the `flow` tokens.
 */
const DocsContent = ({ children, ref }: { children: React.ReactNode; ref?: React.Ref<HTMLDivElement> }) => (
  <StyledDocsContent ref={ref} {...{ [FLOW_ATTRIBUTE]: "" }}>
    {children}
  </StyledDocsContent>
)

export default DocsContent
