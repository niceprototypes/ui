import * as React from "react"
import Contents from "@niceprototypes/contents"
import type { AppContentsType } from "@niceprototypes/app"
import Flow, { FLOW_ATTRIBUTE } from "@niceprototypes/flow"
import { useAppContents } from "@niceprototypes/app"
import DocsColumns from "@niceprototypes/docs/components/DocsColumns"
import DocsRule from "@niceprototypes/docs/components/DocsRule"
import { DocsSettingsContext } from "./DocsSettings"
import type { DocsPageProps, DocsPageSectionType } from "./DocsPage.types"
import {
  StyledDocsPage,
  StyledDocsPageAside,
  StyledDocsPageMain,
  StyledDocsPageSection,
  StyledDocsPageSettings,
  StyledDocsPageSettingsContent,
} from "./DocsPage.styles"

/** Contents rows for a level of sections, nested sections one level deeper. */
const toItems = (sections: ReadonlyArray<DocsPageSectionType>): AppContentsType =>
  sections.map(({ id, label, sections: nested }) => ({ id, label, ...(nested?.length ? { items: toItems(nested) } : {}) }))

/** Whether a section renders anything: a heading, content, an aside or a nested section. */
const hasContent = (section: DocsPageSectionType): boolean =>
  section.heading != null || section.content != null || section.aside != null || (section.sections ?? []).some(hasContent)

/**
 * A page's Contents rows from its sections: the rows the Contents column lists and the nav shows
 * under the page, from the sections that render something.
 */
export const docsPageContents = (sections: ReadonlyArray<DocsPageSectionType>): AppContentsType => toItems(sections.filter(hasContent))

/** Whether any section, at any depth, has an aside: the page is laid out in two columns. */
const hasAside = (sections: ReadonlyArray<DocsPageSectionType>): boolean =>
  sections.some(section => section.aside != null || hasAside(section.sections ?? []))

/**
 * A section, a Flow column inside the page's: its heading, its content (on a two-column page,
 * beside its aside when it has the key, in the prose column when the aside is null), then its
 * nested sections (a parameter list's items, subsections) a base gap apart, a subsection heading
 * and a rule a base gap above what follows them.
 */
const Section = ({ section, split }: { section: DocsPageSectionType; split: boolean }) => (
  <StyledDocsPageSection id={section.id} {...{ [FLOW_ATTRIBUTE]: "" }}>
    {section.heading}
    {split && section.aside !== undefined ? <DocsColumns aside={section.aside}>{section.content}</DocsColumns> : section.content}
    {section.sections?.length ? (
      <Flow space={{ block: { after: "base" }, h3: { after: "base" }, rule: { after: "base" } }}>
        {section.sections.map(nested => <Section key={nested.id} section={nested} split={split} />)}
      </Flow>
    ) : null}
  </StyledDocsPageSection>
)

/**
 * DocsPage
 *
 * A docs page in Stripe's API reference layout: its title block (`header`), then its sections in
 * one Flow column, a section rule (DocsRule, edge to edge) only between two top-level sections
 * that render something (never after the title, never two in a row), each section a nested Flow column (so
 * headings, prose and blocks keep one rhythm across sections). A page with code beside its prose
 * (a section with an `aside`) is two columns wide from laptop up, else capped at
 * `docs.columnWidth` (unless not `wrapped`). Contents lists the sections (nested sections nested)
 * in a sticky column on the right, from laptop up (from desktop up on a two-column page, where
 * the code column needs the room), and the site's settings (DocsSettingsContext) sit in a sticky
 * column right of that; the columns sit centred in the page. Below laptop the settings are a row
 * above the sections.
 */
const DocsPage: React.FC<DocsPageProps> = ({ header, sections: allSections, wrapped = true, contents }) => {
  // A link to a section or heading (`#cardheader`, `#for-agents`) lands on it once the page is in:
  // a passive effect, after every section and heading id is set.
  React.useEffect(() => {
    if (window.location.hash) document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView()
  }, [])
  // Only sections with something to render, so a rule always has a section with content on each side.
  const sections = allSections.filter(hasContent)
  const split = hasAside(sections)
  // The rows Contents lists, reported to the nav with the section in view (useAppContents). The
  // sections are rebuilt on every render, so the rows are compared by value: a report re-renders
  // the shell, and with it this page.
  const itemsKey = JSON.stringify(contents ?? toItems(sections))
  const items = React.useMemo<AppContentsType>(() => JSON.parse(itemsKey), [itemsKey])
  const { setItems, setActiveId } = useAppContents()
  React.useEffect(() => setItems(items), [items, setItems])
  return (
    <StyledDocsPage>
      <StyledDocsPageMain $wrapped={wrapped} $split={split}>
        <Flow>
          {header}
          {sections.map((section, index) => (
            <React.Fragment key={section.id}>
              {index > 0 ? <DocsRule /> : null}
              <Section section={section} split={split} />
            </React.Fragment>
          ))}
        </Flow>
      </StyledDocsPageMain>
      <StyledDocsPageAside $split={split}>
        <Contents size="base" items={items} onActiveChange={setActiveId} />
      </StyledDocsPageAside>
      <StyledDocsPageSettings aria-label="Settings">
        <StyledDocsPageSettingsContent>{React.useContext(DocsSettingsContext)}</StyledDocsPageSettingsContent>
      </StyledDocsPageSettings>
    </StyledDocsPage>
  )
}

export default DocsPage
