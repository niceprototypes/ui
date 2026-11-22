import styled from "styled-components"
import { getToken, type BorderColorType, type SpacingShorthandType } from "@niceprototypes/styles"
import { getSpacingValue, styleSpacing } from "@niceprototypes/flex"
import { getDocsRuleStyle } from "../DocsRule"

/**
 * Styled `<hr>` for storybook docs: a section rule (DocsRule), as wide as its column (inside a docs
 * tile, the tile's content inset).
 *
 * - `$margin` is a gap-token shorthand, parsed the same way as Flex's `margin`
 *   (`"larger none"` → top/bottom `larger`, left/right `none`); the rule's own inline margin (none)
 *   comes after it. Inside a Flow column the `flow.rule` tokens space it.
 * - `$color` sets the rule colour from a border-color token.
 */
export const LineStyled = styled.hr<{ $margin: SpacingShorthandType; $color: BorderColorType }>`
  ${({ $margin }) => styleSpacing("margin", getSpacingValue($margin))}
  ${getDocsRuleStyle("section")}
  border-block-start-color: ${({ $color }) => getToken("borderColor", $color)};
`
