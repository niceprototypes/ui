import * as React from "react"
import Ink from "@niceprototypes/ink"
import DocsPage, { docsPageContents, type DocsPageSectionType } from "../DocsPage"
import { usePlayground, type PlaygroundPartsType } from "../Playground"
import { hasPlayground } from "../Playground/Playground.controls"
import { subcomponentsOf, type CatalogComponentType, type CatalogPropType } from "../../catalog"
import PropDocs from "@niceprototypes/docs/components/PropDocs"
import Props, { type PropsStoryType } from "@niceprototypes/docs/components/Props"
import ExampleBlocks, { ExampleValues } from "@niceprototypes/docs/components/ExampleBlocks"
import DocsRule from "@niceprototypes/docs/components/DocsRule"
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

/** A story's text: its name and description, then its values (one code line per demo beside it). */
const StoryText = ({ example, name, level = "h3" }: { example: ComponentExample; name: string; level?: "h3" | "h4" }) => (
  <>
    <DocsInk as={level}>{example.name}</DocsInk>
    {example.description ? (
      <DocsInk as="p">{typeof example.description === "string" ? renderInline(example.description) : example.description}</DocsInk>
    ) : null}
    <ExampleValues name={name} example={example} />
  </>
)

/** An example that is not one prop, as a subsection in the story layout: its text beside its demos. */
const exampleSection = (example: ComponentExample, id: string): DocsPageSectionType => ({
  id,
  label: example.name,
  content: <StoryText example={example} name={example.name} />,
  aside: <ExampleBlocks example={example} labels={false} />,
  sticky: "main",
})

/**
 * A whole's parts in one section's content (Chat's ChatComposer, ChatMessage, …): each part's name
 * (an h3, not a section, so it lists nowhere), its import, then its props and other examples as
 * stories (Props); a section rule between parts.
 */
const PartsApi = ({ parts }: { parts: ReturnType<typeof subcomponentsOf> }) => (
  <>
    {parts.map((part, partIndex) => {
      const anchor = part.name.toLowerCase()
      return (
        <React.Fragment key={part.name}>
          {partIndex > 0 ? <DocsRule /> : null}
          <DocsInk as="h3">{part.name}</DocsInk>
          <Code language="tsx" code={`import { ${part.name} } from "${part.package}"`} />
          {part.props.length === 0 && <Ink as="p">No props of its own.</Ink>}
          <Props aria-label={`${part.name} props`} stories={partStories(part, anchor)} />
        </React.Fragment>
      )
    })}
  </>
)

/** Each prop as a story (Props): its parameter list item (PropDocs) and values beside its live examples. */
const propStories = (props: CatalogPropType[], examples: Record<string, ComponentExample>, anchor: string): PropsStoryType[] =>
  props.map(prop => ({
    id: `${anchor}${prop.name}`,
    label: prop.name,
    content: (
      <>
        <PropDocs prop={prop} example={examples[prop.name]} />
        {examples[prop.name] ? <ExampleValues name={prop.name} example={examples[prop.name]} /> : null}
      </>
    ),
    aside: examples[prop.name] ? <ExampleBlocks example={examples[prop.name]} labels={false} /> : undefined,
  }))

/** A component's examples that are not one prop (a lifecycle), as stories: name, description and values beside the demos. */
const otherStories = (props: CatalogPropType[], examples: Record<string, ComponentExample>, anchor: string): PropsStoryType[] =>
  Object.entries(examples)
    .filter(([key]) => !props.some(prop => prop.name === key))
    .map(([key, example]) => ({
      id: `${anchor}${key}`,
      label: example.name,
      content: <StoryText example={example} name={example.name} level="h4" />,
      aside: <ExampleBlocks example={example} labels={false} />,
    }))

/** A subcomponent's props, then its other examples, as stories. */
const partStories = (part: ReturnType<typeof subcomponentsOf>[number], anchor: string): PropsStoryType[] => {
  const examples = componentExamples[part.name] ?? {}
  return [...propStories(part.props, examples, `${anchor}-prop-`), ...otherStories(part.props, examples, `${anchor}-example-`)]
}

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
      content: <Props stories={propStories(component.props, examples, "prop-")} />,
    },
    // Each subcomponent (CardHeader on Card) as a section: its import, then its props; or, for a
    // whole made of parts (Chat), every part in one API section, none a section of its own.
    ...(component.partsSection
      ? subcomponentsOf(component.name).length
        ? [{ id: "api", label: "API", heading: <SectionHeading title="API" />, content: <PartsApi parts={subcomponentsOf(component.name)} /> }]
        : []
      : subcomponentsOf(component.name).map(sub => {
          const anchor = sub.name.toLowerCase()
          return {
            id: anchor,
            label: sub.name,
            heading: <SectionHeading title={sub.name} />,
            content: (
              <>
                <Code language="tsx" code={`import { ${sub.name} } from "${sub.package}"`} />
                {sub.props.length === 0 && <Ink as="p">No props of its own.</Ink>}
                <Props aria-label={`${sub.name} props`} stories={partStories(sub, anchor)} />
              </>
            ),
          }
        })),
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
