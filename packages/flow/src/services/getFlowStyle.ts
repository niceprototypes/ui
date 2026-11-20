import { getToken, type TokenGroup } from "@niceprototypes/styles"
import { FLOW_ATTRIBUTE } from "../constants"

/** A child role's `flow` token group (`flow.h2`, `flow.text`, …); `flow.density` and `flow.scale` are multipliers, not roles. */
type FlowRoleGroup = Exclude<Extract<TokenGroup, `flow.${string}`>, "flow.density" | "flow.scale">

/** Each child role's selector and token group, in cascade order: the generic block first, so every specific role after it wins. */
const FLOW_ROLES: readonly [selector: string, group: FlowRoleGroup][] = [
  ["*", "flow.block"],
  ["h1", "flow.h1"],
  ["h2", "flow.h2"],
  ["h3", "flow.h3"],
  ["h4", "flow.h4"],
  ["h5", "flow.h5"],
  ["h6", "flow.h6"],
  // A span or link a column lays out as a block; an inline one ignores block margins.
  ["p, span, a", "flow.text"],
  ["ul, ol, dl", "flow.list"],
  ["blockquote", "flow.blockquote"],
  ["table", "flow.table"],
  ["pre", "flow.code"],
  ["figure, img, picture, video, iframe, canvas, svg", "flow.media"],
  ["hr", "flow.rule"],
]

/** One side's space for a role: its `flow` token times the instance density and the breakpoint scale. */
const space = (group: FlowRoleGroup, side: "before" | "after") =>
  `calc(${getToken(`${group}:${side}`)} * ${getToken("flow.density")} * ${getToken("flow.scale")})`

/**
 * getFlowStyle
 *
 * Vertical rhythm for any container, as nested CSS for its rule (a styled-components template,
 * or native CSS nesting); the element carries `data-flow` (FLOW_ATTRIBUTE). Each direct child takes
 * its role's `flow` tokens times `flow.density` (per instance) and `flow.scale` (per breakpoint:
 * a tighter rhythm on phone and tablet): each heading level more space before than after,
 * text, lists, blockquotes, tables, code, media and other blocks a step after, rules a step on
 * each side. Margins collapse, so a heading's larger before-space wins over the block above it.
 *
 * - Each side is its own declaration: a side mapped to `gap: none` (a unitless 0) makes its
 *   calc a number, which a margin rejects, so that side alone falls back to 0.
 * - The doubled `&&` outranks a child's own single-class margin reset; `:where` keeps the
 *   element part at no specificity. Grandchildren are untouched.
 * - A flow container that is a child of another keeps its edge margins, so they collapse
 *   through it into the outer rhythm (no double counting). The outermost one sits flush: its
 *   first and last child, and the first and last child of each nested container on that edge,
 *   lose their outer margin.
 *
 * @example
 * const Column = styled.div`${getFlowStyle()}`
 * <Column data-flow>…</Column>
 */
export const getFlowStyle = (): string => {
  const flow = `[${FLOW_ATTRIBUTE}]`
  const root = `&&:not(:where(${flow} > *))`
  return [
    ...FLOW_ROLES.map(
      ([selector, group]) =>
        `&& > :where(${selector}) { margin-block-start: ${space(group, "before")}; margin-block-end: ${space(group, "after")}; }`,
    ),
    `${root} > :where(:first-child), ${root} :where(${flow}) > :where(:first-child):not(${flow} :not(:first-child) *) { margin-block-start: 0; }`,
    `${root} > :where(:last-child), ${root} :where(${flow}) > :where(:last-child):not(${flow} :not(:last-child) *) { margin-block-end: 0; }`,
  ].join("\n")
}
