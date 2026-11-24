import * as React from "react"
import { createPortal } from "react-dom"
import { breakpointKeyMatches, parseBreakpointKey, useBreakpoint } from "@niceprototypes/styles"
import { useDocsEnd } from "../DocsEnd"
import Contents from "@niceprototypes/contents"
import type { AppContentsType } from "@niceprototypes/app"
import Flow, { FLOW_ATTRIBUTE } from "@niceprototypes/flow"
import { useAppContents } from "@niceprototypes/app"
import DocsColumns from "../DocsColumns"
import DocsRule from "../DocsRule"
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

/** Whether rows hold the id, at any depth. */
const holds = (rows: AppContentsType | undefined, id: string): boolean =>
  (rows ?? []).some(row => row.id === id || holds(row.items, id))

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
  const body = (
    <>
      {section.heading}
      {split && section.aside !== undefined ? <DocsColumns aside={section.aside} sticky={section.sticky} split={section.split}>{section.content}</DocsColumns> : section.content}
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
    </>
  )
  // A nested section, or a top-level one as a tile. Two elements, not one variable over both: a
  // union of styled components is not callable in every consumer's type setup.
  return measure === undefined ? (
    <StyledDocsPageSection id={section.id} {...{ [FLOW_ATTRIBUTE]: "" }}>
      {body}
    </StyledDocsPageSection>
  ) : (
    <StyledDocsPageTile id={section.id} $measure={measure || undefined} {...{ [FLOW_ATTRIBUTE]: "" }}>
      {body}
    </StyledDocsPageTile>
  )
}

/** From laptop up the settings are on the page (beside Contents, or a row above the sections); below, in the header row. */
const SETTINGS_IN_PAGE = parseBreakpointKey("laptop+")

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
 * site's settings (DocsSettingsContext) sit right of that; where the end column is not shown they
 * are a row above the sections from laptop up, and in the App's header row below (DocsApp).
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
  // Links are split between the columns, never in both: the nav lists the top-level sections (as
  // leaves), the Contents column the section in view's own sections under its name (the one link
  // both show). A hidden Contents spies the whole tree, so both follow the section in view.
  const { setItems, setActiveId } = useAppContents()
  const navItems = React.useMemo(() => items.map(({ id, label }) => ({ id, label })), [items])
  React.useEffect(() => setItems(navItems), [navItems, setItems])
  const [spiedId, setSpiedId] = React.useState<string>()
  const top = (spiedId !== undefined ? items.find(item => item.id === spiedId || holds(item.items, spiedId)) : undefined) ?? items[0]
  React.useEffect(() => {
    if (spiedId !== undefined && top) setActiveId(top.id)
  }, [spiedId, top, setActiveId])
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
  // Below laptop the settings are in the App's header row (DocsApp), not on the page.
  const settingsInPage = breakpointKeyMatches(SETTINGS_IN_PAGE, useBreakpoint())
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
              {top ? <Contents size="base" heading={{ id: top.id, label: top.label }} items={top.items ?? []} activeId={spiedId ?? top.id} /> : null}
            </StyledDocsPageContents>
            <StyledDocsPageEndSettings aria-label="Settings">{settings}</StyledDocsPageEndSettings>
          </>,
          end.element,
        )
      ) : settingsInPage ? (
        <StyledDocsPageSettings aria-label="Settings">
          <StyledDocsPageSettingsContent>{settings}</StyledDocsPageSettingsContent>
        </StyledDocsPageSettings>
      ) : null}
      {/* The scroll-spy over every section, mounted at every width (hidden): it tells the nav and the Contents column the section in view. */}
      <div hidden>
        <Contents items={items} onActiveChange={setSpiedId} />
      </div>
    </StyledDocsPage>
  )
}

export default DocsPage
