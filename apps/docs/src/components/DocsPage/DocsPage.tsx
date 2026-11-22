import * as React from "react"
import { createPortal } from "react-dom"
import { breakpointKeyMatches, parseBreakpointKey, useBreakpoint } from "@niceprototypes/styles"
import { useDocsEnd } from "../DocsEnd"
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
  StyledDocsPageColumn,
  StyledDocsPageContents,
  StyledDocsPageMain,
  StyledDocsPageSection,
  StyledDocsPageSettings,
  StyledDocsPageSettingsContent,
  StyledDocsPageEndSettings,
  StyledDocsPageTile,
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
 * A section, a Flow column inside the page's (a top-level one a tile, with its `measure`; `false`
 * for no measure): its heading, its content (on a two-column page,
 * beside its aside when it has the key, in the prose column when the aside is null), then its
 * nested sections (a parameter list's items, subsections), a subsection rule a base gap from
 * each between two of them: rules separate siblings, never underline a heading.
 */
const Section = ({ section, split, measure }: { section: DocsPageSectionType; split: boolean; measure?: TileMeasureType | false }) => {
  const Element = measure === undefined ? StyledDocsPageSection : StyledDocsPageTile
  return (
    <Element id={section.id} $measure={measure || undefined} {...{ [FLOW_ATTRIBUTE]: "" }}>
      {section.heading}
      {split && section.aside !== undefined ? <DocsColumns aside={section.aside}>{section.content}</DocsColumns> : section.content}
      {section.sections?.length ? (
        <Flow space={{ block: { after: "base" }, h3: { after: "base" }, rule: { before: "base", after: "base" } }}>
          {section.sections.map((nested, index) => (
            <React.Fragment key={nested.id}>
              {index > 0 ? <DocsRule level="subsection" /> : null}
              <Section section={nested} split={split} />
            </React.Fragment>
          ))}
        </Flow>
      ) : null}
    </Element>
  )
}

/** A tile's text measure: one prose column, or two and the gutter. */
type TileMeasureType = "column" | "split"

/**
 * DocsPage
 *
 * A docs page in Stripe's API reference layout, on a grid: a line on the nav's end edge (App's
 * `app.sidebar.rule`) and a line on the Contents column's start edge. The title block (`header`) and each top-level section are
 * tiles running edge to edge between the lines, their content and every rule inside them inset by
 * `docs.tilePadding` (more where the column is wider than the text measure); a section rule
 * (DocsRule) between two tiles that render something runs line to line, never after the title,
 * never two in a row. Each section is a Flow column, so headings, prose and blocks keep one rhythm.
 * A page with code beside its prose (a section with an `aside`) is two columns from laptop up.
 * Contents lists the sections (nested sections nested) in a sticky column on the right, from
 * laptop up (desktop up on a two-column page, where the code column needs the room), and the
 * site's settings (DocsSettingsContext) sit right of that; below laptop they are a row above the
 * sections.
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
  // Each tile keeps the text measure: two columns and the gutter on a two-column page, one column
  // when wrapped, none otherwise.
  const measure: TileMeasureType | false = split ? "split" : wrapped ? "column" : false
  // The rows Contents lists, reported to the nav with the section in view (useAppContents). The
  // sections are rebuilt on every render, so the rows are compared by value: a report re-renders
  // the shell, and with it this page.
  const itemsKey = JSON.stringify(contents ?? toItems(sections))
  const items = React.useMemo<AppContentsType>(() => JSON.parse(itemsKey), [itemsKey])
  const { setItems, setActiveId } = useAppContents()
  React.useEffect(() => setItems(items), [items, setItems])
  // Contents and the settings go to the end column (App's, outside the scrolling page) where there
  // is room for it: laptop and up, desktop and up on a two-column page; else the settings are a row here.
  const end = useDocsEnd()
  const endShown = breakpointKeyMatches(parseBreakpointKey(split ? "desktop+" : "laptop+"), useBreakpoint())
  const { setShown } = end
  React.useEffect(() => {
    setShown(endShown)
    return () => setShown(false)
  }, [endShown, setShown])
  const settings = React.useContext(DocsSettingsContext)
  return (
    <StyledDocsPage>
      <StyledDocsPageMain>
        <StyledDocsPageColumn {...{ [FLOW_ATTRIBUTE]: "" }}>
          {header ? <StyledDocsPageTile as="div" $measure={measure || undefined} {...{ [FLOW_ATTRIBUTE]: "" }}>{header}</StyledDocsPageTile> : null}
          {sections.map((section, index) => (
            <React.Fragment key={section.id}>
              {index > 0 ? <DocsRule /> : null}
              <Section section={section} split={split} measure={measure} />
            </React.Fragment>
          ))}
        </StyledDocsPageColumn>
      </StyledDocsPageMain>
      {endShown && end.element ? (
        createPortal(
          <>
            <StyledDocsPageContents>
              <Contents size="base" items={items} onActiveChange={setActiveId} />
            </StyledDocsPageContents>
            <StyledDocsPageEndSettings aria-label="Settings">{settings}</StyledDocsPageEndSettings>
          </>,
          end.element,
        )
      ) : (
        <>
          <StyledDocsPageSettings aria-label="Settings">
            <StyledDocsPageSettingsContent>{settings}</StyledDocsPageSettingsContent>
          </StyledDocsPageSettings>
          {/* No room for the column: Contents stays mounted, hidden, so its scroll-spy still tells the nav the section in view. */}
          <div hidden>
            <Contents size="base" items={items} onActiveChange={setActiveId} />
          </div>
        </>
      )}
    </StyledDocsPage>
  )
}

export default DocsPage
