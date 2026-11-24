import * as React from "react"
import Flow from "@niceprototypes/flow"
import { StyledDocsColumns, StyledDocsColumnsCell } from "./DocsColumns.styles"
import type { DocsColumnsProps } from "./DocsColumns.types"

/**
 * DocsColumns
 *
 * A docs section's body in Stripe's API reference layout: the main column (prose, parameters,
 * subsections) and the aside (code and live previews) side by side from laptop up, one of them
 * sticky (`sticky`: the aside by default; a story pins its text, `main`); one column below
 * laptop, the aside after its section's prose, nothing sticky. Each column is its own
 * Flow column.
 *
 * @example
 * <DocsColumns aside={<Code code={source} language="tsx" />}>
 *   <Ink as="p">What the example shows.</Ink>
 * </DocsColumns>
 */
const DocsColumns: React.FC<DocsColumnsProps> = ({ children, aside, sticky = "aside" }) => (
  <StyledDocsColumns data-docs-columns="">
    <StyledDocsColumnsCell $sticky={sticky === "main"}>
      <Flow>{children}</Flow>
    </StyledDocsColumnsCell>
    {aside ? (
      <StyledDocsColumnsCell $sticky={sticky === "aside"}>
        <Flow>{aside}</Flow>
      </StyledDocsColumnsCell>
    ) : null}
  </StyledDocsColumns>
)

export default DocsColumns
