import type { TreeItemsType, TreeNodeType } from "@niceprototypes/tree"
import type { AppContentsType, AppEntryType, AppSectionType } from "../components/App/App.types"

type MutableNode = Omit<TreeNodeType, "items"> & { items?: MutableNode[] }

/** The separator between a page's id and one of its sections' anchors in a nav row's id. */
export const CONTENTS_SEPARATOR = "#"

/** A page's in-page sections as its sub-rows: links to their anchors, the one in view active. */
const contentsRows = (entry: AppEntryType, contents: AppContentsType, url: string, activeId: string | undefined): MutableNode[] =>
  contents.map(item => ({
    id: `${entry.id}${CONTENTS_SEPARATOR}${item.id}`,
    name: item.label,
    icon: null,
    url: `${url}${CONTENTS_SEPARATOR}${item.id}`,
    status: item.id === activeId ? "active" : undefined,
    ...(item.items?.length ? { items: contentsRows(entry, item.items, url, activeId) } : {}),
  }))

/** Whether an entry is in the docs section (`/docs`) rather than the stories (`/stories`). */
const isDocs = (entry: AppEntryType | undefined) => entry?.kind === "page"

/**
 * The nav's rows from the index, for the current page's section only: on a story page the stories,
 * on a docs section page the docs pages, at the top level; a folder per story, chapter of several
 * pages or docs folder, and a link per page (a one-scene chapter is one link). Links keep the URL's
 * query string (`search`), so a setting such as `?device=` survives the switch; the current page is active.
 * Each link's URL goes through `href` (the router's, which adds a base path) when given.
 * After them, a link per section (`/<id>`), active when it is the current page (`section`).
 * A page with in-page sections (`contentsOf`) lists them as its sub-rows; on the current page the
 * one in view (`activeContentId`) is the active row, the page its ancestor.
 */
export const buildAppTree = (
  entries: AppEntryType[],
  current: AppEntryType | undefined,
  search: string,
  href: (to: string) => string = to => to,
  sections: AppSectionType[] = [],
  section?: AppSectionType,
  contentsOf: (entry: AppEntryType) => AppContentsType | undefined = () => undefined,
  activeContentId?: string,
): TreeItemsType => {
  const root: MutableNode[] = []
  // Before a page is current (the root, on its way to the first page), the first page's section.
  const docs = isDocs(current ?? entries[0])
  for (const entry of entries.filter(entry => isDocs(entry) === docs)) {
    let level = root
    const slugs = entry.id.split("/")
    // A row's depth starts under the section: its id still carries the section slug.
    entry.names.forEach((name, depth) => {
      const id = slugs.slice(0, depth + 2).join("/")
      if (depth === entry.names.length - 1) {
        const url = href(`${entry.url}${search}`)
        const contents = contentsOf(entry)
        const activeId = entry === current ? activeContentId : undefined
        level.push({
          id,
          name,
          icon: null,
          url,
          status: entry === current && activeId === undefined ? "active" : undefined,
          ...(contents?.length ? { items: contentsRows(entry, contents, url, activeId) } : {}),
        })
        return
      }
      let folder = level.find(node => node.id === id)
      if (!folder) {
        folder = { id, name, icon: null, items: [] }
        level.push(folder)
      }
      level = folder.items ?? []
    })
  }
  for (const item of sections)
    root.push({ id: item.id, name: item.name, icon: null, url: href(`/${item.id}${search}`), status: item === section ? "active" : undefined })
  return root
}

/**
 * The ids of the folders above an entry: its section's, its story's, and its chapter's for a scene of
 * several (a docs page's folders likewise). The section's id has no row and expands nothing.
 */
export const getAppAncestorIds = (entry: AppEntryType) =>
  entry.id
    .split("/")
    .slice(0, -1)
    .map((_, depth, slugs) => slugs.slice(0, depth + 1).join("/"))

/** The nav row ids above a page's section (its nested sections' parents), the page's own first. */
export const getAppContentsAncestorIds = (entry: AppEntryType, contents: AppContentsType, sectionId: string): string[] => {
  const walk = (items: AppContentsType, parents: string[]): string[] | undefined => {
    for (const item of items) {
      if (item.id === sectionId) return parents
      const found = item.items && walk(item.items, [...parents, `${entry.id}${CONTENTS_SEPARATOR}${item.id}`])
      if (found) return found
    }
    return undefined
  }
  return walk(contents, [entry.id]) ?? [entry.id]
}
