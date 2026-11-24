import type * as React from "react"
import { getAppPageUrl, type AppContentsType, type AppEntryType, type AppPagesType } from "@niceprototypes/app"
import { getItem, getTree, sanitize, type DataItem } from "@niceprototypes/docs/data"
import ComponentPage, { componentContents } from "./components/ComponentPage"
import MdxPage, { type MdxModuleType } from "./components/MdxPage"
import { docsHeadingsOfSource } from "@niceprototypes/docs/services"
import TokensPage, { tokensContents } from "./components/TokensPage"
import ScrollPageBehaviour from "./components/ScrollPageBehaviour"
import { catalogComponents, catalogWidgets, subcomponentsOf, type CatalogComponentType } from "./catalog"

/** A loaded page module for the App's `pages`. */
const pageOf = (Page: React.ComponentType) => () => Promise.resolve({ default: Page })

/** Names in alphabetical order. */
const byName = (a: string, b: string) => a.localeCompare(b, "en", { sensitivity: "base" })

/** The docs pages (@niceprototypes/docs content), as text (to read each one's Meta title) and as lazy modules. */
const mdxText = import.meta.glob<string>("../../../packages/docs/src/content/*/*.mdx", { query: "?raw", import: "default", eager: true })
const mdxModules = import.meta.glob<MdxModuleType>("../../../packages/docs/src/content/*/*.mdx")

/** Each MDX page's file by its data item id: the sanitized Meta title (`CLI/Dev & Watch` → `cli-dev-watch`). */
const mdxByItemId = new Map(
  Object.entries(mdxText).flatMap(([path, text]) => {
    const title = /<Meta[\s\S]*?title="([^"]+)"/.exec(text)?.[1]
    return title ? [[sanitize(title), path] as const] : []
  }),
)

/** Each MDX page's title (its nav label) by its data item id, as its page shows it. */
const mdxLabelByItemId = new Map<string, string>()

/** An item's MDX page, wrapped as storybook.json says; none when no file has its title. */
const mdxPage = (item: DataItem, label: string) => {
  const path = mdxByItemId.get(item.id)
  if (!path) return undefined
  mdxLabelByItemId.set(item.id, label)
  return () =>
    mdxModules[path]().then(module => ({
      default: () => <MdxPage id={item.id} label={label} wrapped={item.settings.wrapped === true} Content={module.default} />,
    }))
}

/** A component's page, bound to its catalog entry. */
const componentPage = (component: CatalogComponentType) => pageOf(() => <ComponentPage component={component} />)

/** Pages of a folder that are not a component's, after its components: Scroll's page-wide behaviours. */
const folderPages: Record<string, [string, AppPagesType[string]][]> = {
  Scroll: [["Page behaviour", pageOf(ScrollPageBehaviour)]],
}

/**
 * The Components section, as the Storybook sidebar orders it: the folders (Field, Scroll)
 * alphabetically, then the pages outside a folder alphabetically, each folder's pages alphabetically
 * after the component the folder is named for.
 */
const componentPages = (section: string, list: CatalogComponentType[]): [string, AppPagesType[string], string?][] => {
  const folders = [...new Set(list.flatMap(component => (component.folder ? [component.folder] : [])))].sort(byName)
  /** A component's page name: its page title (ChatLog's page is Chat), else its own name. */
  const pageName = (component: CatalogComponentType) => component.title ?? component.name
  const sorted = [...list].sort((a, b) => byName(pageName(a), pageName(b)))
  // A component named like a folder (Scroll beside StickySection and the others in Scroll) is that
  // folder's first page: a page and a folder cannot share a URL.
  const folderOf = (component: CatalogComponentType) => component.folder ?? (folders.includes(component.name) ? component.name : undefined)
  const inFolder = (component: CatalogComponentType, folder: string) =>
    folderOf(component) === folder ? (component.name === folder ? 0 : 1) : -1
  return [
    ...folders.flatMap((folder, folderIndex) => {
      const components = sorted.filter(component => inFolder(component, folder) >= 0).sort((a, b) => inFolder(a, folder) - inFolder(b, folder))
      return [
        ...components.map((component, index): [string, AppPagesType[string], string] => [
          `./docs/${section}/${folderIndex + 1} ${folder}/${index + 1} ${pageName(component)}/index.tsx`,
          componentPage(component),
          component.docsId,
        ]),
        ...(folderPages[folder] ?? []).map(([name, page], index): [string, AppPagesType[string]] => [
          `./docs/${section}/${folderIndex + 1} ${folder}/${components.length + index + 1} ${name}/index.tsx`,
          page,
        ]),
      ]
    }),
    ...sorted
      .filter(component => !folderOf(component))
      .map((component, index): [string, AppPagesType[string], string] => [
        `./docs/${section}/${folders.length + index + 1} ${pageName(component)}/index.tsx`,
        componentPage(component),
        component.docsId,
      ]),
  ]
}

/**
 * One section of storybook.json: its overview page (an MDX titled as the section) first, then
 * each page in data order, each a folder's pages in turn.
 */
const sectionPages = (item: DataItem, section: string): [string, AppPagesType[string], string?][] => {
  const overview = mdxPage(item, "Overview")
  const own: [string, AppPagesType[string], string?][] = overview ? [[`./docs/${section}/0 Overview/index.tsx`, overview, item.id]] : []
  return [
    ...own,
    ...item.children.flatMap((child, index) => {
      const folder = `${section}/${index + 1} ${child.name}`
      if (child.isFolder) return sectionPages(child, folder)
      const page = mdxPage(child, child.name)
      return page ? [[`./docs/${folder}/index.tsx`, page, child.id] as [string, AppPagesType[string], string]] : []
    }),
  ]
}

/**
 * Every page in nav order, with the Storybook id each one replaces: the storybook.json sections
 * (Basics, Manifest, Bindings, Configuration, CLI), where Tokens is the all-tokens page and the
 * catalog's Components, then its Widgets, follow it.
 */
const entries: [string, AppPagesType[string], string?][] = getTree().flatMap((item, index) => {
  const section = `${index + 1} ${item.name}`
  if (item.id === "tokens")
    return [
      [`./docs/${section}/index.tsx`, pageOf(TokensPage), item.id],
      ...componentPages(`${index + 1}.5 Components`, catalogComponents),
      ...componentPages(`${index + 1}.6 Widgets`, catalogWidgets),
    ] as [string, AppPagesType[string], string?][]
  return sectionPages(item, section)
})

/** Every page of the site, keyed as `@niceprototypes/app` reads docs section pages. */
export const pages: AppPagesType = Object.fromEntries(entries.map(([key, load]) => [key, load]))

/**
 * Each page's in-page sections by URL, from what lists its Contents column: a component page's
 * sections, the Tokens page's groups, an MDX page's headings (read from its source).
 */
const contentsByUrl = new Map<string, () => AppContentsType | undefined>(
  entries.flatMap(([key, , itemId]): [string, () => AppContentsType | undefined][] => {
    const url = getAppPageUrl(key)
    const component = [...catalogComponents, ...catalogWidgets].find(candidate => candidate.docsId === itemId)
    if (component) return [[url, () => componentContents(component)]]
    if (itemId === "tokens") return [[url, tokensContents]]
    const path = itemId ? mdxByItemId.get(itemId) : undefined
    if (!path || !itemId) return []
    // A page whose data says `navContents: false` lists no sections in the nav (an empty list, so
    // the page's own report cannot add them either).
    if (getItem(itemId)?.settings.navContents === false) return [[url, () => []]]
    return [[url, () => docsHeadingsOfSource(mdxText[path], mdxLabelByItemId.get(itemId))]]
  }),
)
const contentsCache = new Map<string, AppContentsType | undefined>()

/** A page's in-page sections for the nav (App `contents`), worked out once per page. */
export const pageContents = (entry: AppEntryType): AppContentsType | undefined => {
  if (!contentsCache.has(entry.url)) contentsCache.set(entry.url, contentsByUrl.get(entry.url)?.())
  return contentsCache.get(entry.url)
}

/** The docs URL of a Storybook page id (`onboarding-tokens--docs`, `components-button--docs`; the former `components-forms-…` ids too), for links written for Storybook. */
/**
 * Subcomponents' old pages (`/docs/components/cardheader`, `/docs/components/radio`): the
 * parent's URL with its last segment the subcomponent's, now the parent page at its section.
 */
const subcomponentPages = [...catalogComponents, ...catalogWidgets].flatMap(component => {
  const key = entries.find(([, , itemId]) => itemId === component.docsId)?.[0]
  if (!key) return []
  const url = getAppPageUrl(key)
  return subcomponentsOf(component.name).map(sub => ({
    id: sub.name.toLowerCase(),
    from: url.replace(/[^/]+$/, sub.name.toLowerCase()),
    to: `${url}#${sub.name.toLowerCase()}`,
  }))
})

/** A docs id from before the Forms folder was flattened (`components-forms-button--docs`) as it is now (`components-button--docs`). */
const unfolded = (id: string) => id.replace(/^components-forms-/, "components-").replace(/^components-chat-chatlog(?=--|$)/, "components-chat")

export const docsUrlOf = (rawStoryId: string): string | undefined => {
  const storyId = unfolded(rawStoryId)
  // A subcomponent's old Storybook id (`components-cardheader--docs`): its parent's section.
  const sub = storyId.startsWith("components-") ? subcomponentPages.find(page => storyId.replace(/--.*$/, "").endsWith(`-${page.id}`)) : undefined
  if (sub) return sub.to
  // A page of its own wins (Tokens is a folder with its own page); otherwise where it moved.
  // Component pages keep their `--docs` id, so a story of the same component (`--primary`) matches too.
  const exact = entries.find(([, , itemId]) => itemId?.replace(/--.*$/, "") === storyId.replace(/--.*$/, ""))?.[0]
  if (exact) return getAppPageUrl(exact)
  const id = moved(storyId.replace(/--.*$/, ""))
  const key = entries.find(([, , itemId]) => itemId === id.page || itemId === storyId)?.[0]
  return key && getAppPageUrl(key) + id.hash
}

/** A folder's first page, depth first: where a group's own (now removed) Overview page went. */
const firstPageOf = (item: DataItem): DataItem => (item.isFolder && item.children.length ? firstPageOf(item.children[0]) : item)

/**
 * Pages that moved: Basics is Onboarding; the Manifest pages are the Welcome page's "For agents"
 * section; a group's Overview (`bindings--docs`) is its first page; CLI pages lost their numbers
 * (`cli-4-dev-watch` is `cli-dev-watch`).
 */
const moved = (id: string): { page: string; hash: string } => {
  if (id === "manifest" || id.startsWith("manifest-")) return { page: "onboarding-welcome", hash: "#for-agents" }
  const renamed = id.replace(/^basics-/, "onboarding-").replace(/^cli-\d+-/, "cli-")
  const item = getItem(renamed)
  return { page: item?.isFolder ? firstPageOf(item).id : renamed, hash: "" }
}

/**
 * The docs URL for an address that no longer exists, or undefined: the Basics and Manifest
 * pages before they moved, subcomponents' old pages, groups' removed Overview pages, numbered
 * CLI pages, and Storybook links
 * (`/?path=/docs/onboarding-themes--docs`).
 */
export const redirectOf = (pathname: string, search: string): string | undefined => {
  const params = new URLSearchParams(search)
  const story = params.get("path")?.replace(/^\/(docs|story)\//, "")
  if (story) return docsUrlOf(story)
  // Storybook's preview frame (`/iframe.html?id=components-forms-button--primary`) opens the docs page of its id.
  if (pathname === "/iframe.html") return (params.get("id") && docsUrlOf(params.get("id")!)) || "/"
  if (pathname === "/index.html") return "/"
  if (pathname.startsWith("/docs/manifest")) return docsUrlOf("manifest")
  if (pathname.startsWith("/docs/basics")) return pathname.replace(/^\/docs\/basics/, "/docs/onboarding")
  // Chat's parts were pages in a Chat folder; they are sections of the Chat page now
  // (`/docs/components/chat/chatcomposer` → `/docs/components/chat#chatcomposer`; ChatLog's page is the Chat page).
  const chatPart = /^\/docs\/components\/chat\/([^/]+)\/?$/.exec(pathname)
  if (chatPart) return chatPart[1] === "chatlog" ? "/docs/components/chat" : `/docs/components/chat#${chatPart[1]}`
  // The Forms folder is flattened: its pages sit under Components (`/docs/components/forms/button` → `/docs/components/button`).
  if (pathname.startsWith("/docs/components/forms/")) return pathname.replace(/^\/docs\/components\/forms\//, "/docs/components/")
  // A group's removed Overview opens its first page; a numbered CLI page, its unnumbered one.
  const path = pathname.replace(/\/+$/, "")
  const urls = entries.map(([key]) => getAppPageUrl(key))
  if (path.endsWith("/overview") && !urls.includes(path)) return urls.find(url => url.startsWith(path.replace(/overview$/, "")))
  if (/^\/docs\/cli\/\d+-/.test(path)) return path.replace(/^\/docs\/cli\/\d+-/, "/docs/cli/")
  return subcomponentPages.find(page => page.from === path)?.to
}
