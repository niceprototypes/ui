import * as React from "react"
import { StyledDocsRule } from "./DocsRule.styles"
import type { DocsRuleProps } from "./DocsRule.types"

/**
 * DocsRule
 *
 * The docs pages' horizontal rule, as Stripe's API reference draws them: a section rule between
 * top-level sections runs edge to edge, a subsection rule stays inside its column, so the gutter
 * shows beside it. Inside a Flow column, the `flow.rule` tokens space it.
 *
 * @example
 * <DocsRule />
 * <Ink as="h3">Parameters</Ink>
 * <DocsRule level="subsection" />
 */
const DocsRule: React.FC<DocsRuleProps> = ({ level = "section" }) => <StyledDocsRule $level={level} />

export default DocsRule
