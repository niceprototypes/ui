import * as React from "react"
import Ink from "@niceprototypes/ink"
import DocsPage, { docsPageContents, type DocsPageSectionType } from "../DocsPage"
import { usePlayground, type PlaygroundPartsType } from "../Playground"
import { hasPlayground } from "../Playground/Playground.controls"
import { subcomponentsOf, type CatalogComponentType, type CatalogPropType } from "../../catalog"
import PropDocs from "@niceprototypes/docs/components/PropDocs"
import ExampleBlocks from "@niceprototypes/docs/components/ExampleBlocks"
import { ComponentTokenTable, componentPrefixesWithTokens, type ComponentPrefixWithTokens } from "@niceprototypes/docs/dataTables/components/tokens/Components"
import { componentExamples } from "@niceprototypes/docs/examples"
import type { ComponentExample } from "@niceprototypes/docs/dataTables/components/demos/Components"
import { StoryHeader } from "@niceprototypes/docs/components/Story"
import { StoryHeaderLevel } from "@niceprototypes/docs/components/Story/StoryHeader/StoryHeaderLevel"
import DocsInk from "@niceprototypes/docs/nice/Ink"
import Code from "@niceprototypes/docs/nice/Code"
import { renderInline } from "@niceprototypes/docs/data/text"


/** A section heading one level under the page title. */
const SectionHeading = ({ title }: { title: string }) => (
  <StoryHeaderLevel.Provider value="h2">
    <StoryHeader title={title} />
  </StoryHeaderLevel.Provider>
)

/** An example that is not one prop, as a subsection: its heading, its description beside its code. */
const exampleSection = (example: ComponentExample, id: string): DocsPageSectionType => ({
  id,
  label: example.name,
  heading: <DocsInk as="h3">{example.name}</DocsInk>,
  content: example.description ? (
    <DocsInk as="p">{typeof example.description === "string" ? renderInline(example.description) : example.description}</DocsInk>
  ) : null,
  aside: <ExampleBlocks example={example} />,
})

/** Each prop as a parameter list item (PropDocs), its live examples beside it when it has some. */
const propSections = (props: CatalogPropType[], examples: Record<string, ComponentExample>, anchor: string): DocsPageSectionType[] =>
  props.map(prop => ({
    id: `${anchor}${prop.name}`,
    label: prop.name,
    content: <PropDocs prop={prop} example={examples[prop.name]} />,
    aside: examples[prop.name] ? <ExampleBlocks example={examples[prop.name]} /> : null,
  }))

/**
 * componentSections
 *
 * One component's docs page sections (ComponentPage), from the catalog, in Stripe's API reference layout (DocsPage): the
 * overview (install and import), a playground (when the props allow one: its controls beside the
 * live preview and its JSX), every prop as a parameter list item beside its live examples, a
 * section per subcomponent with its props, the examples that are not one prop (each a subsection
 * beside its code), and the component tokens when its prefix has any.
 */
const componentSections = (component: CatalogComponentType, playground: PlaygroundPartsType): DocsPageSectionType[] => {
  const examples = componentExamples[component.name] ?? {}
  const propNames = new Set(component.props.map(prop => prop.name))
  const prefix = `${component.name.charAt(0).toLowerCase()}${component.name.slice(1)}` as ComponentPrefixWithTokens
  const importLine = component.named
    ? `import { ${component.name} } from "${component.package}"`
    : `import ${component.name} from "${component.package}"`

  const sections: DocsPageSectionType[] = [
    {
      id: "overview",
      label: "Overview",
      content: (
        <>
          <StoryHeader title={component.title ?? component.name} packageName={component.package} install />
          <Code language="tsx" code={importLine} />
          {component.section === "widgets" ? (
            <Ink as="p">{`Built from Nice UI: ${component.builtFrom.join(", ")}.`}</Ink>
          ) : null}
        </>
      ),
    },
    ...(hasPlayground(component)
      ? [
          {
            id: "playground",
            label: "Playground",
            heading: <SectionHeading title="Playground" />,
            content: playground.controls,
            aside: playground.preview,
          },
        ]
      : []),
    {
      id: "props",
      label: "Props",
      heading: <SectionHeading title="Props" />,
      sections: propSections(component.props, examples, "prop-"),
    },
    // Each subcomponent (CardHeader on Card) as a section: its import, then its props.
    ...subcomponentsOf(component.name).map(sub => {
      const anchor = sub.name.toLowerCase()
      return {
        id: anchor,
        label: sub.name,
        heading: <SectionHeading title={sub.name} />,
        content: (
          <>
            <Code language="tsx" code={`import { ${sub.name} } from "${sub.package}"`} />
            {sub.props.length === 0 && <Ink as="p">No props of its own.</Ink>}
          </>
        ),
        sections: [
          ...propSections(sub.props, componentExamples[sub.name] ?? {}, `${anchor}-prop-`),
          // The subcomponent's examples that are not one prop (a lifecycle), each a subsection.
          ...Object.entries(componentExamples[sub.name] ?? {})
            .filter(([key]) => !sub.props.some(prop => prop.name === key))
            .map(([key, example]) => exampleSection(example, `${anchor}-example-${key}`)),
        ],
      }
    }),
  ]

  const otherExamples = Object.entries(examples).filter(([key]) => !propNames.has(key))
  if (otherExamples.length)
    sections.push({
      id: "examples",
      label: "Examples",
      heading: <SectionHeading title="Examples" />,
      // Each example a subsection: its heading, its description beside its code.
      sections: otherExamples.map(([key, example]) => exampleSection(example, `example-${key}`)),
    })

  if (componentPrefixesWithTokens.includes(prefix))
    sections.push({
      id: "tokens",
      label: "Tokens",
      heading: <SectionHeading title="Tokens" />,
      content: <ComponentTokenTable prefix={prefix} />,
    })

  return sections
}

/** A component page's Contents rows, without rendering it: the nav lists them under the page. */
export const componentContents = (component: CatalogComponentType) =>
  docsPageContents(componentSections(component, { preview: null, controls: null }))

/** ComponentPage: one component's docs page (componentSections) with its live playground. */
const ComponentPage: React.FC<{ component: CatalogComponentType }> = ({ component }) => (
  <DocsPage sections={componentSections(component, usePlayground(component, hasPlayground(component)))} />
)

export default ComponentPage
