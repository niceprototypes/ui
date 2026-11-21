// TabsSection example configs: one ComponentExample per facet. The docs site renders each as a
// prop item's examples (level, selectBelow, variant, children) or a subsection of the Examples section.
import { useState } from "react"
import Flow from "@niceprototypes/flow"
import Ink from "@niceprototypes/ink"
import Code from "@niceprototypes/code"
import { TabsSection, type TabsItemType, type TabsSectionProps } from "@niceprototypes/tabs"
import type { ComponentExample } from "../../dataTables/components/demos/Components"

const IMPORT = `import { TabsSection } from "@niceprototypes/tabs"`

const LANGUAGES: TabsItemType[] = [
  { id: "html", label: "HTML/CSS" },
  { id: "js", label: "Vanilla JS" },
  { id: "react", label: "React" },
]

const SOURCES: Record<string, { code: string; language: string }> = {
  html: { code: `<p class="metric">2.5 GB/s</p>`, language: "html" },
  js: { code: `metric.textContent = "2.5 GB/s"`, language: "js" },
  react: { code: `<Metrics value="2.5" label="GB/s" />`, language: "tsx" },
}

/** A controlled TabsSection in a Flow column: each language's source in the panel. */
const Languages = (props: Omit<TabsSectionProps, "items" | "selected" | "onSelect" | "children">) => {
  const [selected, setSelected] = useState("html")
  return (
    <Flow>
      <TabsSection items={LANGUAGES} selected={selected} onSelect={setSelected} {...props}>
        <Code code={SOURCES[selected].code} language={SOURCES[selected].language} />
      </TabsSection>
    </Flow>
  )
}

const usage = (props: string) =>
  `<Flow>\n  <TabsSection title="After"${props} items={languages} selected={id} onSelect={setId}>\n    <Code code={sources[id]} />\n  </TabsSection>\n</Flow>`

export const tabsSectionLevel = {
  name: "level",
  description:
    "The heading's element. A Flow column spaces the heading row as that heading, and the tab list and the phone select take their accessible name from it.",
  variants: ["h2", "h3", "h4"],
  default: "h2",
  preview: variant => <Languages title="After" level={variant as TabsSectionProps["level"]} />,
  code: variant => usage(variant === "h2" ? "" : ` level="${variant}"`),
} satisfies ComponentExample

export const tabsSectionSelectBelow = {
  name: "selectBelow",
  description:
    "The breakpoint below which the tabs become a native Select at the right of the heading row, driving the same panel. The default keeps tabs from tablet up and a select on phone; in a window between the laptop and desktop floors, tablet and laptop show tabs and desktop shows the select.",
  variants: ["tablet", "laptop", "desktop", "none"],
  default: "tablet",
  preview: variant => <Languages title="After" selectBelow={variant as TabsSectionProps["selectBelow"]} />,
  code: variant => usage(variant === "tablet" ? "" : ` selectBelow="${variant}"`),
} satisfies ComponentExample

export const tabsSectionVariant = {
  name: "variant",
  description: "The tabs' look, as Tabs': an underline under the selected tab, or a rounded border on each.",
  variants: ["underline", "pill"],
  default: "underline",
  preview: variant => <Languages title="After" variant={variant as TabsSectionProps["variant"]} />,
  code: variant => usage(variant === "underline" ? "" : ` variant="${variant}"`),
} satisfies ComponentExample

export const tabsSectionPage = {
  name: "A page's sections",
  description:
    "Two sections in one Flow column: a plain heading over its content, then a TabsSection. Both headings take the same before-space; the panel sits a block's space under its heading row.",
  variants: ["base"],
  preview: () => (
    <Flow>
      <Ink as="h2" weight="semibold">Before</Ink>
      <Ink as="p">The hand-written version.</Ink>
      <TabsSection title="After" items={LANGUAGES}>
        <Ink as="p">The Nice UI version, one tab per implementation.</Ink>
      </TabsSection>
    </Flow>
  ),
  code: () =>
    `${IMPORT}\n\n<Flow>\n  <Ink as="h2" weight="semibold">Before</Ink>\n  <Ink as="p">The hand-written version.</Ink>\n  <TabsSection title="After" items={languages}>\n    <Ink as="p">The Nice UI version, one tab per implementation.</Ink>\n  </TabsSection>\n</Flow>`,
} satisfies ComponentExample

export const tabsSectionExamples = {
  level: tabsSectionLevel,
  selectBelow: tabsSectionSelectBelow,
  variant: tabsSectionVariant,
  page: tabsSectionPage,
}
