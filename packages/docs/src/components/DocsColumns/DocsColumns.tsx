import * as React from "react"
import Flow from "@niceprototypes/flow"
import { StyledDocsColumns, StyledDocsColumnsAside, StyledDocsColumnsCell } from "./DocsColumns.styles"
import type { DocsColumnsProps } from "./DocsColumns.types"

/**
 * DocsColumns
 *
 * A docs section's body in Stripe's API reference layout: the main column (prose, parameters,
 * subsections) and the aside (code and live previews) side by side from laptop up, the aside
 * sticky; one column below laptop, the aside after its section's prose. Each column is its own
 * Flow column.
 *
 * @example
 * <DocsColumns aside={<Code code={source} language="tsx" />}>
 *   <Ink as="p">What the example shows.</Ink>
 * </DocsColumns>
 */
const DocsColumns: React.FC<DocsColumnsProps> = ({ children, aside }) => (
  <StyledDocsColumns>
    <StyledDocsColumnsCell>
      <Flow>{children}</Flow>
    </StyledDocsColumnsCell>
    {aside ? (
      <StyledDocsColumnsAside>
        <Flow>{aside}</Flow>
      </StyledDocsColumnsAside>
    ) : null}
  </StyledDocsColumns>
)

export default DocsColumns
