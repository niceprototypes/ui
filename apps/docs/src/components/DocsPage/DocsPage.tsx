import * as React from "react"
import Contents from "@niceprototypes/contents"
import type { ContentsItemsType } from "@niceprototypes/contents"
import Flow, { FLOW_ATTRIBUTE } from "@niceprototypes/flow"
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
const toItems = (sections: ReadonlyArray<DocsPageSectionType>): ContentsItemsType =>
  sections.map(({ id, label, sections: nested }) => ({ id, label, ...(nested?.length ? { items: toItems(nested) } : {}) }))

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
 * A docs page in Stripe's API reference layout: its sections in one Flow column, a section rule
 * (DocsRule, edge to edge) between top-level sections, each section a nested Flow column (so
 * headings, prose and blocks keep one rhythm across sections). A page with code beside its prose
 * (a section with an `aside`) is two columns wide from laptop up, else capped at
 * `docs.columnWidth` (unless not `wrapped`). Contents lists the sections (nested sections nested)
 * in a sticky column on the right, from laptop up (from desktop up on a two-column page, where
 * the code column needs the room), and the site's settings (DocsSettingsContext) sit in a sticky
 * column right of that; the columns sit centred in the page. Below laptop the settings are a row
 * above the sections.
 */
const DocsPage: React.FC<DocsPageProps> = ({ sections, wrapped = true, contents }) => {
  // A link to a section or heading (`#cardheader`, `#for-agents`) lands on it once the page is in:
  // a passive effect, after every section and heading id is set.
  React.useEffect(() => {
    if (window.location.hash) document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView()
  }, [])
  const split = hasAside(sections)
  return (
    <StyledDocsPage>
      <StyledDocsPageMain $wrapped={wrapped} $split={split}>
        <Flow>
          {sections.map((section, index) => (
            <React.Fragment key={section.id}>
              {index > 0 ? <DocsRule /> : null}
              <Section section={section} split={split} />
            </React.Fragment>
          ))}
        </Flow>
      </StyledDocsPageMain>
      <StyledDocsPageAside $split={split}>
        <Contents size="base" items={contents ?? toItems(sections)} />
      </StyledDocsPageAside>
      <StyledDocsPageSettings aria-label="Settings">
        <StyledDocsPageSettingsContent>{React.useContext(DocsSettingsContext)}</StyledDocsPageSettingsContent>
      </StyledDocsPageSettings>
    </StyledDocsPage>
  )
}

export default DocsPage
