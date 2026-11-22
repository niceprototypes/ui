import * as React from "react"
import { StyledDocsRule } from "./DocsRule.styles"
import type { DocsRuleProps } from "./DocsRule.types"

/**
 * DocsRule
 *
 * The docs pages' horizontal rule, as wide as its column: inside a DocsPage tile it keeps the
 * tile's content inset, and DocsPage's own rules between tiles run line to line. Inside a Flow
 * column, the `flow.rule` tokens space it.
 *
 * @example
 * <DocsRule />
 * <Ink as="h3">Parameters</Ink>
 * <DocsRule level="subsection" />
 */
const DocsRule: React.FC<DocsRuleProps> = ({ level = "section" }) => <StyledDocsRule $level={level} />

export default DocsRule
