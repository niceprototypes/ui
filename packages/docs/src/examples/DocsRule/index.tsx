// DocsRule example configs: one ComponentExample per facet. The docs site renders each as a prop
// item's examples (level) or a subsection of the Examples section.
import Flow from "@niceprototypes/flow"
import Ink from "@niceprototypes/ink"
import Code from "@niceprototypes/code"
import DocsColumns from "../../components/DocsColumns"
import DocsRule from "../../components/DocsRule"
import PropDocs from "../../components/PropDocs"
import type { ComponentExample } from "../../dataTables/components/demos/Components"

const IMPORT = `import DocsRule from "@niceprototypes/docs/components/DocsRule"`

export const docsRuleLevel = {
  name: "level",
  description:
    "The break it marks. A section rule runs past its column by the page's bleed (to the screen's edges on phone) and, between two-column sections, across the gutter; a subsection rule stays inside its column. In a Flow column the flow.rule tokens space both, and a heading straight after a rule sits the rule's after-space below it.",
  variants: ["section", "subsection"],
  default: "section",
  preview: variant => (
    <Flow>
      <Ink as="p">The section above ends here.</Ink>
      <DocsRule level={variant} />
      <Ink as={variant === "section" ? "h2" : "h3"}>{variant === "section" ? "Pagination" : "Parameters"}</Ink>
      <Ink as="p">Its first paragraph.</Ink>
    </Flow>
  ),
  code: variant =>
    variant === "section"
      ? `<Flow>\n  <Ink as="p">The section above ends here.</Ink>\n  <DocsRule />\n  <Ink as="h2">Pagination</Ink>\n  <Ink as="p">Its first paragraph.</Ink>\n</Flow>`
      : `<Flow>\n  <Ink as="p">The section above ends here.</Ink>\n  <DocsRule level="subsection" />\n  <Ink as="h3">Parameters</Ink>\n  <Ink as="p">Its first paragraph.</Ink>\n</Flow>`,
} satisfies ComponentExample

export const docsRuleGutter = {
  name: "Section and subsection",
  description:
    "Both levels on a two-column section: the section rule spans the prose column, the gutter and the code column; the subsection rule under the heading stops at the gutter.",
  variants: ["base"],
  preview: () => (
    <Flow>
      <DocsRule />
      <DocsColumns aside={<Code language="tsx" code={`const page = await list({ limit: 3 })`} />}>
        <Ink as="h3">Parameters</Ink>
        <DocsRule level="subsection" />
        <Ink as="p">Every list method takes a limit and a cursor.</Ink>
      </DocsColumns>
    </Flow>
  ),
  code: () =>
    `${IMPORT}\n\n<Flow>\n  <DocsRule />\n  <DocsColumns aside={<Code language="tsx" code={source} />}>\n    <Ink as="h3">Parameters</Ink>\n    <DocsRule level="subsection" />\n    <Ink as="p">Every list method takes a limit and a cursor.</Ink>\n  </DocsColumns>\n</Flow>`,
} satisfies ComponentExample

export const docsRuleList = {
  name: "Between list items",
  description: "A parameter list: each PropDocs item opens with a subsection rule, a base gap above its name.",
  variants: ["base"],
  preview: () => (
    <Flow>
      <Ink as="h3">Parameters</Ink>
      <PropDocs prop={{ name: "limit", type: "number", default: "10", description: "How many objects to return." }} />
      <PropDocs prop={{ name: "startingAfter", type: "string", description: "The object ID the page starts after." }} />
      <PropDocs prop={{ name: "apiKey", type: "string", required: true, description: "The key the request is made with." }} />
    </Flow>
  ),
  code: () =>
    `<Flow>\n  <Ink as="h3">Parameters</Ink>\n  <PropDocs prop={limit} />\n  <PropDocs prop={startingAfter} />\n  <PropDocs prop={apiKey} />\n</Flow>`,
} satisfies ComponentExample

export const docsRuleExamples = {
  level: docsRuleLevel,
  gutter: docsRuleGutter,
  list: docsRuleList,
}
