// Flow example configs: one ComponentExample per facet. The Flow docs page renders each prop's
// entry under the prop, and the rest (every role, nesting, the three modification levels) under Examples.
import Flow, { FlowItem, type FlowDensityType, type FlowSpaceType } from "@niceprototypes/flow"
import Ink from "@niceprototypes/ink"
import Code from "@niceprototypes/code"
import type { ComponentExample } from "../../dataTables/components/demos/Components"

/** One child of every role Flow spaces, in reading order. */
const EveryRole = () => (
  <>
    <Ink as="h2">Release notes</Ink>
    <Ink as="p">Every package reads its spacing from tokens, so a reading column keeps one rhythm.</Ink>
    <Ink as="h3">Changes</Ink>
    <ul>
      <li>Space by role, from the flow tokens</li>
      <li>Density per instance, scale per breakpoint</li>
    </ul>
    <Ink as="blockquote" italic>A heading sits closer to its content than to the block above it.</Ink>
    <Code code={`<Flow density="compact">…</Flow>`} language="tsx" margin="none" />
    <table>
      <tbody>
        <tr><td>h2</td><td>larger + large before, larger after</td></tr>
        <tr><td>text</td><td>none before, large after</td></tr>
      </tbody>
    </table>
    <hr />
    <Ink as="h4">Next</Ink>
    <Ink as="p">The first and last child sit flush with the column's edges.</Ink>
  </>
)

const everyRoleCode = `  <Ink as="h2">Release notes</Ink>
  <Ink as="p">Every package reads its spacing from tokens…</Ink>
  <Ink as="h3">Changes</Ink>
  <ul>…</ul>
  <Ink as="blockquote" italic>…</Ink>
  <Code code="…" />
  <table>…</table>
  <hr />
  <Ink as="h4">Next</Ink>
  <Ink as="p">The first and last child sit flush…</Ink>`

export const flowChildren = {
  name: "children",
  description:
    "The content. Each direct child is spaced by its role: `h1`–`h6`, text (`p`, and a span or link laid out as a block), list, blockquote, table, code (`pre`), media, rule (`hr`), and any other block (a card, a component). Margins collapse, so a heading's larger before-space wins over the block above it.",
  variants: ["every role"],
  default: "every role",
  preview: () => (
    <Flow>
      <EveryRole />
    </Flow>
  ),
  code: () => `<Flow>\n${everyRoleCode}\n</Flow>`,
} satisfies ComponentExample

const DENSITIES = ["compact", "base", "spacious"] as const satisfies readonly FlowDensityType[]

export const flowDensity = {
  name: "density",
  description:
    "Multiplies the whole rhythm by a `flow.density` token, so every heading level keeps its order. Unset inherits the nearest Flow's density.",
  variants: DENSITIES,
  default: "base",
  preview: (variant: FlowDensityType) => (
    <Flow density={variant}>
      <EveryRole />
    </Flow>
  ),
  code: (variant: FlowDensityType) => `<Flow${variant === "base" ? "" : ` density="${variant}"`}>\n${everyRoleCode}\n</Flow>`,
} satisfies ComponentExample

const SPACES: Record<string, FlowSpaceType | undefined> = {
  none: undefined,
  "tight headings": { h2: { before: "large", after: "base" }, h3: { before: "large", after: "small" } },
  "loose code": { code: { before: "larger", after: "larger" } },
}

const spaceCode = (space?: FlowSpaceType) =>
  space
    ? `space={{ ${Object.entries(space)
        .map(([role, sides]) => `${role}: { ${Object.entries(sides ?? {}).map(([side, gap]) => `${side}: "${gap}"`).join(", ")} }`)
        .join(", ")} }}`
    : ""

export const flowSpace = {
  name: "space",
  description:
    "Per-instance overrides by role, each side a core `gap` token (times the density). They apply inside this Flow and the Flows nested in it; the roles not named keep the `flow` tokens.",
  variants: Object.keys(SPACES),
  default: "none",
  preview: (variant: string) => (
    <Flow space={SPACES[variant]}>
      <EveryRole />
    </Flow>
  ),
  code: (variant: string) => `<Flow${SPACES[variant] ? ` ${spaceCode(SPACES[variant])}` : ""}>\n${everyRoleCode}\n</Flow>`,
} satisfies ComponentExample

export const flowNesting = {
  name: "Nesting",
  description:
    "A Flow inside a Flow joins the outer rhythm instead of adding to it: its edge margins collapse through it, so the heading inside the nested Flow gets the same space as one outside. A Flow inside another layout (a card, a grid cell) starts its own rhythm, flush with that container.",
  variants: ["nested"],
  default: "nested",
  preview: () => (
    <Flow>
      <Ink as="p">Text in the outer Flow.</Ink>
      <Flow>
        <Ink as="h3">Heading in a nested Flow</Ink>
        <Ink as="p">Its space before is the h3 token, not the h3 plus a block step.</Ink>
      </Flow>
    </Flow>
  ),
  code: () => `<Flow>
  <Ink as="p">Text in the outer Flow.</Ink>
  <Flow>
    <Ink as="h3">Heading in a nested Flow</Ink>
    <Ink as="p">Its space before is the h3 token…</Ink>
  </Flow>
</Flow>`,
} satisfies ComponentExample

export const flowModifyGlobal = {
  name: "Modify: global",
  description:
    "Re-map the `flow` tokens for the whole project with setTokens: a role's `before`/`after`, the `density` variants, or the breakpoint `scale` (phone 0.5, tablet 0.75, laptop and up 1 by default). The preview shows the defaults this page uses.",
  variants: ["setTokens"],
  default: "setTokens",
  preview: () => (
    <Flow>
      <EveryRole />
    </Flow>
  ),
  code: () => `import { getToken as getCoreToken, setTokens } from "@niceprototypes/styles"

export const getToken = setTokens({
  flow: {
    h2: { before: getCoreToken("gap", "larger"), after: getCoreToken("gap", "base") },
    scale: { base: { phone: "0.6", "tablet+": "0.8", "laptop+": "1" } },
  },
})`,
} satisfies ComponentExample

export const flowModifyInstance = {
  name: "Modify: per instance",
  description: "`density` scales one Flow's whole rhythm; `space` re-maps named roles in it. Both cascade into nested Flows.",
  variants: ["density and space"],
  default: "density and space",
  preview: () => (
    <Flow density="compact" space={{ h2: { after: "small" } }}>
      <EveryRole />
    </Flow>
  ),
  code: () => `<Flow density="compact" space={{ h2: { after: "small" } }}>\n${everyRoleCode}\n</Flow>`,
} satisfies ComponentExample

export const flowModifyElement = {
  name: "Modify: per element",
  description:
    "FlowItem gives one child its own space before and after, as core `gap` tokens (times the density): it wraps the child in a block and re-maps the block tokens on it. The first and last child still sit flush. `bleed` lets a tile reach past the column by `flow.bleed` (App: its gutter on phone), and `getBleedRadius` squares the tile's corners while it does. `getFlowStyle` applies the same rules to any container that carries `data-flow`.",
  variants: ["FlowItem"],
  default: "FlowItem",
  preview: () => (
    <Flow>
      <Ink as="h3">Results</Ink>
      <FlowItem before="smaller" after="larger">
        <Ink size="small" color="lighter">Updated today</Ink>
      </FlowItem>
      <Ink as="p">The note sits tight under the heading, and a larger step above this text.</Ink>
    </Flow>
  ),
  code: () => `<Flow>
  <Ink as="h3">Results</Ink>
  <FlowItem before="smaller" after="larger">
    <Ink size="small" color="lighter">Updated today</Ink>
  </FlowItem>
  <Ink as="p">The note sits tight under the heading…</Ink>
</Flow>`,
} satisfies ComponentExample

/** Every Flow example facet: the props, then every role, nesting and the three modification levels. */
export const flowExamples = {
  children: flowChildren,
  density: flowDensity,
  space: flowSpace,
  nesting: flowNesting,
  modifyGlobal: flowModifyGlobal,
  modifyInstance: flowModifyInstance,
  modifyElement: flowModifyElement,
} satisfies Record<string, ComponentExample>
