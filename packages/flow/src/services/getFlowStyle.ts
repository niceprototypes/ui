import { getToken } from "@niceprototypes/styles"
import { FLOW_ATTRIBUTE } from "../constants"
import type { FlowRoleType } from "../components/Flow/Flow.types"

/** A child role's `flow` token group (`flow.h2`, `flow.text`, …). */
type FlowRoleGroup = `flow.${FlowRoleType}`

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

/** How many nested flow columns deep an edge child still loses its outer margin. */
const EDGE_DEPTH = 6

/**
 * The outermost flow column's edge children on one side, as one selector list: its own first (or
 * last) child, and the first (or last) child of each flow column nested on that edge, down
 * `EDGE_DEPTH` levels. Each chain runs from the root through edge children only, so a column
 * that is not on the edge keeps its margins; it never looks above the root, so a root inside
 * another flow's later child (a grid cell under a page's column, every Flow sharing one class)
 * still flushes its own nested columns. `&&&` outranks a nested container's role rules.
 */
const edgeChains = (side: "first" | "last") => {
  const flow = `[${FLOW_ATTRIBUTE}]`
  const edge = `:where(:${side}-child)`
  const root = `&&&:not(:where(${flow} > *))`
  return Array.from({ length: EDGE_DEPTH + 1 }, (_, depth) =>
    `${root}${` > :where(${flow}:${side}-child)`.repeat(depth)} > ${edge}`,
  ).join(", ")
}

/** Every heading level, as one selector. */
const HEADINGS = "h1, h2, h3, h4, h5, h6"

/**
 * A heading straight after a rule, as one selector list: the rule's next sibling when it is a
 * heading, or the heading that opens the flow column after it (its first child, down
 * `EDGE_DEPTH` nested columns). Such a heading drops its before-space, so the rule's after-space
 * alone separates them (Stripe's section rule sits close above its heading), whatever the level.
 */
const headingAfterRule = () => {
  const flow = `[${FLOW_ATTRIBUTE}]`
  const start = "&&& > :where(hr) +"
  return [
    `${start} :where(${HEADINGS})`,
    ...Array.from({ length: EDGE_DEPTH }, (_, depth) =>
      `${start} :where(${flow})${` > :where(${flow}:first-child)`.repeat(depth)} > :where(:is(${HEADINGS}):first-child)`,
    ),
  ].join(", ")
}

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
 * - Each side is its own declaration (`margin-block-start`, `margin-block-end`).
 * - The doubled `&&` outranks a child's own single-class margin reset; `:where` keeps the
 *   element part at no specificity. Grandchildren are untouched.
 * - A flow container that is a child of another keeps its edge margins, so they collapse
 *   through it into the outer rhythm (no double counting). The outermost one sits flush: its
 *   first and last child, and the first and last child of each nested container on that edge,
 *   lose their outer margin (edgeChains), judged from the root down only, so a root inside
 *   another flow's later child (a grid cell under a page's column) still flushes its nested
 *   containers' ends.
 * - A heading straight after a rule (or opening the column after it) drops its before-space,
 *   so the rule's after-space alone sits between them (headingAfterRule).
 *
 * @example
 * const Column = styled.div`${getFlowStyle()}`
 * <Column data-flow>…</Column>
 */
export const getFlowStyle = (): string =>
  [
    ...FLOW_ROLES.map(
      ([selector, group]) =>
        `&& > :where(${selector}) { margin-block-start: ${space(group, "before")}; margin-block-end: ${space(group, "after")}; }`,
    ),
    `${edgeChains("first")} { margin-block-start: 0; }`,
    `${edgeChains("last")} { margin-block-end: 0; }`,
    `${headingAfterRule()} { margin-block-start: 0; }`,
  ].join("\n")
