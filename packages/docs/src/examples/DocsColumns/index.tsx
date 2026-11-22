// DocsColumns example configs: one ComponentExample per facet. The docs site renders each as a
// prop item's examples (aside, children) or a subsection of the Examples section.
import type * as React from "react"
import Flow from "@niceprototypes/flow"
import Ink from "@niceprototypes/ink"
import Code from "@niceprototypes/code"
import DocsColumns from "../../components/DocsColumns"
import DocsRule from "../../components/DocsRule"
import PropDocs from "../../components/PropDocs"
import type { ComponentExample } from "../../dataTables/components/demos/Components"

const IMPORT = `import DocsColumns from "@niceprototypes/docs/components/DocsColumns"`

/** A short prose paragraph for the main column. */
const Prose = () => <Ink as="p">Every list method takes a limit and a cursor. The response carries the page and whether more follow.</Ink>

const SOURCE = `const page = await list({ limit: 3 })`

const asides: Record<string, { node: React.ReactNode; code: string }> = {
  code: {
    node: <Code language="tsx" code={SOURCE} />,
    code: `<DocsColumns aside={<Code language="tsx" code={source} />}>\n  <Ink as="p">Every list method takes a limit and a cursor.</Ink>\n</DocsColumns>`,
  },
  "live preview": {
    node: (
      <Code language="tsx" code={`<Ink as="p">Hello</Ink>`}>
        <Ink as="p">Hello</Ink>
      </Code>
    ),
    code: `<DocsColumns\n  aside={\n    <Code language="tsx" code={source}>\n      <Ink as="p">Hello</Ink>\n    </Code>\n  }\n>\n  <Ink as="p">Every list method takes a limit and a cursor.</Ink>\n</DocsColumns>`,
  },
  "several blocks": {
    node: (
      <>
        <Code language="tsx" code={SOURCE} />
        <Code language="json" code={`{ "data": [], "hasMore": false }`} />
      </>
    ),
    code: `<DocsColumns\n  aside={\n    <>\n      <Code language="tsx" code={request} />\n      <Code language="json" code={response} />\n    </>\n  }\n>\n  <Ink as="p">Every list method takes a limit and a cursor.</Ink>\n</DocsColumns>`,
  },
  none: {
    node: undefined,
    code: `<DocsColumns>\n  <Ink as="p">Every list method takes a limit and a cursor.</Ink>\n</DocsColumns>`,
  },
}

export const docsColumnsAside = {
  name: "aside",
  description:
    "The code column: code, live previews, or several blocks in a Flow column, sticky from laptop up while the main column scrolls past, after the main column below laptop. Without one the main column keeps the left half and the right stays empty.",
  variants: Object.keys(asides),
  default: "code",
  preview: variant => (
    <DocsColumns aside={asides[variant].node}>
      <Prose />
    </DocsColumns>
  ),
  code: variant => asides[variant].code,
} satisfies ComponentExample

const limit = { name: "limit", type: "number", default: "10", description: "How many objects to return, between 1 and 100." }
const cursor = { name: "startingAfter", type: "string", description: "The object ID the page starts after." }

const mains: Record<string, { node: React.ReactNode; code: string }> = {
  prose: {
    node: <Prose />,
    code: `<DocsColumns aside={<Code language="tsx" code={source} />}>\n  <Ink as="p">Every list method takes a limit and a cursor.</Ink>\n</DocsColumns>`,
  },
  "parameter list": {
    node: (
      <>
        <Ink as="h3">Parameters</Ink>
        <PropDocs prop={limit} />
        <DocsRule level="subsection" />
        <PropDocs prop={cursor} />
      </>
    ),
    code: `<DocsColumns aside={<Code language="tsx" code={source} />}>\n  <Ink as="h3">Parameters</Ink>\n  <PropDocs prop={{ name: "limit", type: "number", default: "10", description: "…" }} />\n  <DocsRule level="subsection" />\n  <PropDocs prop={{ name: "startingAfter", type: "string", description: "…" }} />\n</DocsColumns>`,
  },
  subsection: {
    node: (
      <>
        <Prose />
        <DocsRule level="subsection" />
        <Ink as="h3">List response</Ink>
        <Prose />
      </>
    ),
    code: `<DocsColumns aside={<Code language="tsx" code={source} />}>\n  <Ink as="p">Every list method takes a limit and a cursor.</Ink>\n  <DocsRule level="subsection" />\n  <Ink as="h3">List response</Ink>\n  <Ink as="p">The page and whether more follow.</Ink>\n</DocsColumns>`,
  },
}

export const docsColumnsChildren = {
  name: "children",
  description: "The main column, a Flow column: prose, a parameter list (PropDocs items, a subsection rule between them), or a subsection with its rule above its heading.",
  variants: Object.keys(mains),
  default: "prose",
  preview: variant => (
    <DocsColumns aside={<Code language="tsx" code={SOURCE} />}>{mains[variant].node}</DocsColumns>
  ),
  code: variant => mains[variant].code,
} satisfies ComponentExample

export const docsColumnsSection = {
  name: "A section",
  description:
    "A whole section as DocsPage builds one: the heading above both columns, then the prose and parameters beside the code, a subsection rule between parameters (never under a heading).",
  variants: ["base"],
  preview: () => (
    <Flow>
      <Ink as="h2">Pagination</Ink>
      <DocsColumns aside={<Code language="tsx" code={SOURCE} />}>
        <Prose />
        <Ink as="h3">Parameters</Ink>
        <PropDocs prop={limit} />
        <DocsRule level="subsection" />
        <PropDocs prop={cursor} />
      </DocsColumns>
    </Flow>
  ),
  code: () =>
    `${IMPORT}\n\n<Flow>\n  <Ink as="h2">Pagination</Ink>\n  <DocsColumns aside={<Code language="tsx" code={source} />}>\n    <Ink as="p">Every list method takes a limit and a cursor.</Ink>\n    <Ink as="h3">Parameters</Ink>\n    <PropDocs prop={limit} />\n    <DocsRule level="subsection" />\n    <PropDocs prop={startingAfter} />\n  </DocsColumns>\n</Flow>`,
} satisfies ComponentExample

export const docsColumnsExamples = {
  aside: docsColumnsAside,
  children: docsColumnsChildren,
  section: docsColumnsSection,
}
