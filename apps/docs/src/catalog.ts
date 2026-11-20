import { catalogEntries, type CatalogEntryType } from "@niceprototypes/docs/data/catalog"

export type { CatalogPropType } from "@niceprototypes/docs/data/catalog"
export { tokenUnions, subcomponentsOf } from "@niceprototypes/docs/data/catalog"

/** One component with its own page: its catalog entry, its section and its docs folder (Forms, Scroll) if any. */
export type CatalogComponentType = CatalogEntryType & {
  /** Its nav section, from its docs id's first segment: "components" (primitives) or "widgets" (built on them) */
  section: string
  /** Its folder under Components, from its docs id (`components-forms-button--docs` → Forms) */
  folder?: string
  /** Its docs page id (`components-forms-button--docs`), the Storybook id the page replaces */
  docsId: string
}

/** A folder segment of a docs id as a name: `forms` → Forms. */
const folderName = (segment: string) => segment.charAt(0).toUpperCase() + segment.slice(1)

/**
 * Every component with its own page (a docs id in the catalog: it has live examples; subcomponents are
 * sections of their parent's page), in catalog order. The docs id's segments between
 * `components` and the page are its folders; the first is kept, so a page nested under another
 * page's folder (Forms/Field/Fieldset) sits beside it.
 */
const catalogPages: CatalogComponentType[] = catalogEntries.flatMap(entry => {
  if (!entry.docs || entry.parent) return []
  const [section, ...rest] = entry.docs.replace(/--docs$/, "").split("-")
  const segments = rest.slice(0, -1)
  return [{ ...entry, section, folder: segments.length ? folderName(segments[0]) : undefined, docsId: entry.docs }]
})

/** The primitives: every component page under Components. */
export const catalogComponents = catalogPages.filter(component => component.section === "components")

/**
 * Widgets: higher-level, context-specific components built from the primitives (DataTable), in a
 * section of their own after Components (Storybook title `Widgets/…`).
 */
export const catalogWidgets = catalogPages.filter(component => component.section === "widgets")
