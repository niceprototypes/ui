import type * as React from "react"
import type { AppContentsType } from "@niceprototypes/app"
import type { DocsColumnsSplitType } from "../DocsColumns"

/**
 * DocsPageSectionType
 *
 * One section of a docs page: an anchor `id` (unique on the page), the `label` Contents lists it
 * by, its `heading` (above both columns), its `content`, an optional `aside` beside the content
 * (code and live previews: the page becomes two columns, DocsColumns; `null` keeps the content in
 * the prose column with nothing beside it), and optional nested `sections`, rendered after the
 * content and listed one level deeper in Contents.
 */
export type DocsPageSectionType = {
  id: string
  label: string
  heading?: React.ReactNode
  content?: React.ReactNode
  aside?: React.ReactNode
  /** Which column stays in view beside the other (DocsColumns `sticky`). @default "aside" */
  sticky?: "main" | "aside"
  /** How the content and the aside share the width (DocsColumns `split`). @default "even" */
  split?: DocsColumnsSplitType
  sections?: ReadonlyArray<DocsPageSectionType>
}

/**
 * DocsPageProps
 *
 * Complete prop definition for the DocsPage component.
 */
export interface DocsPageProps {
  /** The page's title block (a StoryHeader), above the first section with no rule after it */
  header?: React.ReactNode

  /** The page's sections, in page order; a section with nothing to render is left out */
  sections: ReadonlyArray<DocsPageSectionType>

  /** Keep each tile's text to the measure (`docs.columnWidth`, two of them on a two-column page); off, tiles use the full width. @default true */
  wrapped?: boolean

  /** Contents rows in place of the sections' (an MDX page lists its headings) */
  contents?: AppContentsType
}
