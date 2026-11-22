import type { TreeItemsType, TreeNodeType } from "@niceprototypes/tree"
import type { AppContentsType, AppEntryType, AppSectionType } from "../components/App/App.types"

type MutableNode = Omit<TreeNodeType, "items"> & { items?: MutableNode[] }

/** The separator between a page's id and one of its sections' anchors in a nav row's id. */
export const CONTENTS_SEPARATOR = "#"

/**
 * A page's in-page sections as its sub-rows: links to their anchors, the one in view active. A
 * section repeating the page's name, an ancestor folder's (a page title read as a section) or a
 * page's beside it in its folder is left out, so a page never shows itself, or a sibling page,
 * again under it.
 */
const contentsRows = (
  entry: AppEntryType,
  contents: AppContentsType,
  url: string,
  activeId: string | undefined,
  siblingNames: readonly string[],
): MutableNode[] => {
  const names = new Set([...entry.names, ...siblingNames].map(name => name.trim().toLowerCase()))
  const rows = (items: AppContentsType): MutableNode[] =>
    items
      .filter(item => !names.has(item.label.trim().toLowerCase()))
      .map(item => ({
        id: `${entry.id}${CONTENTS_SEPARATOR}${item.id}`,
        name: item.label,
        icon: null,
        url: `${url}${CONTENTS_SEPARATOR}${item.id}`,
        status: item.id === activeId ? ("active" as const) : undefined,
        ...(item.items?.length ? { items: rows(item.items) } : {}),
      }))
  return rows(contents)
}

/** Whether any row, at any depth, is the active one. */
const hasActiveRow = (rows: readonly MutableNode[]): boolean =>
  rows.some(row => row.status === "active" || hasActiveRow(row.items ?? []))

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
  // The names of the pages in an entry's folder, itself left out.
  const folderOf = (entry: AppEntryType) => entry.id.split("/").slice(0, -1).join("/")
  const siblingNamesOf = (entry: AppEntryType) =>
    entries.filter(other => other !== entry && folderOf(other) === folderOf(entry)).map(other => other.names[other.names.length - 1])
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
        const items = contents?.length ? contentsRows(entry, contents, url, activeId, siblingNamesOf(entry)) : []
        // The page is the active row unless one of its section rows is: a section in view with
        // no row (none listed, or left out) keeps the page active.
        level.push({
          id,
          name,
          icon: null,
          url,
          status: entry === current && !hasActiveRow(items) ? "active" : undefined,
          ...(items.length ? { items } : {}),
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
