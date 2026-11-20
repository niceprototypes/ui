import * as React from "react"
import Contents from "@niceprototypes/contents"
import type { ContentsItemsType } from "@niceprototypes/contents"
import Flow, { FLOW_ATTRIBUTE } from "@niceprototypes/flow"
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

/** A section, a Flow column inside the page's: its content, then its nested sections. */
const Section = ({ section }: { section: DocsPageSectionType }) => (
  <StyledDocsPageSection id={section.id} {...{ [FLOW_ATTRIBUTE]: "" }}>
    {section.content}
    {section.sections?.map(nested => <Section key={nested.id} section={nested} />)}
  </StyledDocsPageSection>
)

/**
 * DocsPage
 *
 * A docs page: its sections in one Flow column (each section a nested Flow column, so
 * headings, prose and blocks keep one rhythm across sections) capped at `docs.columnWidth` (unless not
 * `wrapped`), and Contents
 * listing them (nested sections nested) in a sticky column on the right, from laptop up, and the
 * site's settings (DocsSettingsContext) in a sticky column right of that; the columns sit centred
 * in the page. Below laptop the settings are a row above the sections.
 */
const DocsPage: React.FC<DocsPageProps> = ({ sections, wrapped = true, contents }) => {
  // A link to a section or heading (`#cardheader`, `#for-agents`) lands on it once the page is in:
  // a passive effect, after every section and heading id is set.
  React.useEffect(() => {
    if (window.location.hash) document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView()
  }, [])
  return (
    <StyledDocsPage>
      <StyledDocsPageMain $wrapped={wrapped}>
        <Flow>
          {sections.map(section => <Section key={section.id} section={section} />)}
        </Flow>
      </StyledDocsPageMain>
      <StyledDocsPageAside>
        <Contents size="base" items={contents ?? toItems(sections)} />
      </StyledDocsPageAside>
      <StyledDocsPageSettings aria-label="Settings">
        <StyledDocsPageSettingsContent>{React.useContext(DocsSettingsContext)}</StyledDocsPageSettingsContent>
      </StyledDocsPageSettings>
    </StyledDocsPage>
  )
}

export default DocsPage
