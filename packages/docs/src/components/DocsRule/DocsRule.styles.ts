import styled, { css } from "styled-components"
import { getToken as getCoreToken } from "@niceprototypes/styles"
import { getToken } from "../../nice/tokens"
import type { DocsRuleLevelType } from "./DocsRule.types"

/**
 * A docs rule as an `<hr>` (a Flow column spaces it with the `flow.rule` tokens), `docs.ruleWidth`
 * thick in `docs.ruleColor`. A section rule runs past the column's sides by the page's bleed
 * (`flow.bleed`: the gutter on phone), so it reaches the page's edges; a subsection rule keeps to
 * its column.
 */
export const getDocsRuleStyle = (level: DocsRuleLevelType) => css`
  box-sizing: content-box;
  height: 0;
  border: 0;
  border-block-start: ${getToken("docs", "ruleWidth")} solid ${getToken("docs", "ruleColor")};
  margin-inline: ${level === "section" ? `calc(-1 * ${getCoreToken("flow.bleed")})` : 0};
`

export const StyledDocsRule = styled.hr<{ $level: DocsRuleLevelType }>`
  ${({ $level }) => getDocsRuleStyle($level)}
`
