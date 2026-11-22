import styled, { css } from "styled-components"
import { getToken as getCoreToken } from "@niceprototypes/styles"
import { getToken } from "../../nice/tokens"
import type { DocsRuleLevelType } from "./DocsRule.types"

/**
 * A docs rule as an `<hr>` (a Flow column spaces it with the `flow.rule` tokens), `docs.ruleWidth`
 * thick in `docs.ruleColor`, as wide as its column: inside a DocsPage tile it keeps the tile's
 * content inset (the gutter); DocsPage places its section rules between tiles, line to line.
 */
export const getDocsRuleStyle = (_level: DocsRuleLevelType) => css`
  box-sizing: content-box;
  height: 0;
  margin-inline: 0;
  border: 0;
  border-block-start: ${getToken("docs", "ruleWidth")} solid ${getToken("docs", "ruleColor")};
`

export const StyledDocsRule = styled.hr<{ $level: DocsRuleLevelType }>`
  ${({ $level }) => getDocsRuleStyle($level)}
`

/**
 * The rule each heading level carries above it, the one place to change it: an h2 a rule running
 * edge to edge (inside a DocsPage tile, out to the grid lines), an h3 a rule as wide as its column
 * (the tile's content inset), h4 and below none.
 */
export const HEADING_RULES = { h2: "edge", h3: "inset" } as const

/** Every heading level, for "straight after a heading" (a title). */
const HEADINGS = "h1, h2, h3, h4, h5, h6"

/** The attribute a DocsPage tile carries, so an edge rule inside it can reach the grid lines. */
export const DOCS_TILE_ATTRIBUTE = "data-docs-tile"

/** A tile's content inset as seen from inside it (the tile is a size container): its padding, or more where it keeps the text measure. */
const tileInsetInside = `max(${getToken("docs", "tilePadding")}, calc((100cqi - ${getToken("docs", "tileMeasure")}) / 2))`

/**
 * getHeadingRuleStyle
 *
 * A Flow column's heading rules from HEADING_RULES (for DocsContent): each mapped heading draws its
 * rule as its own top border, the rule-then-heading space (`flow.rule` after) below it; an edge
 * rule inside a tile reaches the grid lines. No rule on a first heading, one straight after a
 * heading, or the first one after the page's title block (an element holding the h1), whose
 * before-space also gives way to the title's after-space, so a rule never sits under a title; an author's `<hr>` straight before a
 * heading gives way to the heading's own rule (or to none, for h4 and below), so rules never double.
 */
export const getHeadingRuleStyle = () => css`
  && > hr:has(+ :is(${HEADINGS})) {
    display: none;
  }

  /* The first heading after the page's title block (a StoryHeader, its h1 inside) sits the
     title's own after-space below it, with no rule: nothing underlines a title. */
  && > :has(h1) + :is(${HEADINGS}),
  && > :has(h1) + hr + :is(${HEADINGS}) {
    margin-block-start: 0;
  }

  ${Object.entries(HEADING_RULES).map(
    ([level, kind]) => css`
      && > ${level}:not(:first-child):not(:is(${HEADINGS}, :has(h1)) + ${level}):not(:is(${HEADINGS}, :has(h1)) + hr + ${level}) {
        padding-block-start: calc(${getCoreToken("flow.rule:after")} * ${getCoreToken("flow.density")} * ${getCoreToken("flow.scale")});
        border-block-start: ${getToken("docs", "ruleWidth")} solid ${getToken("docs", "ruleColor")};
        ${kind === "edge"
          ? css`
              [${DOCS_TILE_ATTRIBUTE}] & {
                margin-inline: calc(-1 * ${tileInsetInside});
                padding-inline: ${tileInsetInside};
              }
            `
          : ""}
      }
    `,
  )}
`
