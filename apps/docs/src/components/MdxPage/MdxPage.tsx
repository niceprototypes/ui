import * as React from "react"
import Code from "@niceprototypes/code"
import type { AppContentsItemType } from "@niceprototypes/app"
import { ShikiPre } from "@niceprototypes/docs/components/ShikiPre"
import DocsPage from "../DocsPage"
import DocsContent from "@niceprototypes/docs/components/DocsContent"

/** Markdown inline code as the inline Code chip; fenced code goes through ShikiPre, which reads its own `<code>`. */
const InlineCode = ({ children }: { children?: React.ReactNode }) => <Code code={String(children)} inlined margin="none" />

/** An MDX page module: its default export takes the element overrides. */
export type MdxModuleType = { default: React.ComponentType<{ components?: Record<string, React.ComponentType<never>> }> }

/** A heading's text as an anchor id: lower case, runs of other characters as one dash. */
const slugOf = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

/**
 * The page's headings as Contents rows, each h3 under the h2 before it. An h3 with no h2 above
 * it is a top-level row, and so are the h3s after it: an h3 nests only under an h2, so sibling
 * sections stay siblings. A heading without an id gets one from its text, made unique on the page.
 */
const headingsOf = (root: HTMLElement): AppContentsItemType[] => {
  const taken = new Set<string>()
  const rows: { id: string; label: string; items: AppContentsItemType[]; h2: boolean }[] = []
  for (const heading of root.querySelectorAll<HTMLElement>("h2, h3")) {
    const label = heading.textContent?.trim() ?? ""
    if (!label) continue
    if (!heading.id) {
      const base = slugOf(label) || "section"
      let id = base
      for (let n = 2; taken.has(id) || document.getElementById(id); n++) id = `${base}-${n}`
      heading.id = id
    }
    taken.add(heading.id)
    const row = { id: heading.id, label, items: [] as AppContentsItemType[], h2: heading.tagName === "H2" }
    const parent = rows[rows.length - 1]
    if (!row.h2 && parent?.h2) parent.items.push({ id: row.id, label: row.label })
    else rows.push(row)
  }
  return rows.map(({ items, h2: _h2, ...row }) => (items.length ? { ...row, items } : row))
}

/** A JSX heading's inner source as its text: a Code chip as its code, a string expression as its string, other tags dropped. */
const textOfSource = (source: string) =>
  source
    .replace(/<Code\b[^>]*\bcode="([^"]*)"[^>]*\/>/g, "$1")
    .replace(/\{"([^"]*)"\}/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim()

/** The end of the `<Ink …>` element opened at `from`: the index after its matching `</Ink>`, nested Inks counted. */
const inkEnd = (text: string, from: number) => {
  const tag = /<Ink\b[^>]*?(\/?)>|<\/Ink>/g
  tag.lastIndex = from
  let depth = 0
  for (let match = tag.exec(text); match; match = tag.exec(text)) {
    if (match[0] === "</Ink>") depth -= 1
    else if (match[1] !== "/") depth += 1
    if (depth === 0) return { inner: text.slice(text.indexOf(">", from) + 1, match.index), end: tag.lastIndex }
  }
  return undefined
}

/**
 * An MDX page's Contents rows from its source, without rendering it, for the nav: its h2 and h3
 * headings (markdown `##`/`###`, `<Ink as="h2">`, `<h2>`), nested and given ids as `headingsOf`
 * does on the rendered page (which the page reports in their place once it renders). A heading
 * whose text is a JavaScript expression reads as its literal text until then.
 */
export const mdxContents = (source: string): AppContentsItemType[] => {
  const headings: { level: 2 | 3; label: string; id?: string }[] = []
  const pattern = /^(#{2,3})\s+(.+)$|<Ink\b(?=[^>]*\bas="h([23])")([^>]*)>|<h([23])\b([^>]*)>([\s\S]*?)<\/h\5>/gm
  for (let match = pattern.exec(source); match; match = pattern.exec(source)) {
    if (match[1]) headings.push({ level: match[1].length as 2 | 3, label: textOfSource(match[2]) })
    else if (match[3]) {
      const element = inkEnd(source, match.index)
      if (!element) continue
      headings.push({ level: Number(match[3]) as 2 | 3, label: textOfSource(element.inner), id: /\bid="([^"]+)"/.exec(match[4])?.[1] })
      pattern.lastIndex = element.end
    } else headings.push({ level: Number(match[5]) as 2 | 3, label: textOfSource(match[7]), id: /\bid="([^"]+)"/.exec(match[6])?.[1] })
  }
  const taken = new Set<string>()
  const rows: { id: string; label: string; items: AppContentsItemType[]; h2: boolean }[] = []
  for (const heading of headings) {
    if (!heading.label) continue
    let id = heading.id
    if (!id) {
      const base = slugOf(heading.label) || "section"
      id = base
      for (let n = 2; taken.has(id); n++) id = `${base}-${n}`
    }
    taken.add(id)
    const row = { id, label: heading.label, items: [] as AppContentsItemType[], h2: heading.level === 2 }
    const parent = rows[rows.length - 1]
    if (!row.h2 && parent?.h2) parent.items.push({ id: row.id, label: row.label })
    else rows.push(row)
  }
  return rows.map(({ items, h2: _h2, ...row }) => (items.length ? { ...row, items } : row))
}

/**
 * MdxPage
 *
 * One MDX page on the docs site: its content as the page's one section, fenced code through
 * Code (ShikiPre), inline code as Code chips, the docs rhythm (DocsContent), Contents listing
 * its headings, the column capped
 * unless the page's data says `wrapped: false`.
 */
const MdxPage: React.FC<{ id: string; label: string; wrapped: boolean; Content: MdxModuleType["default"] }> = ({ id, label, wrapped, Content }) => {
  const content = React.useRef<HTMLDivElement>(null)
  const [contents, setContents] = React.useState<AppContentsItemType[]>()
  React.useLayoutEffect(() => {
    if (content.current) setContents(headingsOf(content.current))
  }, [Content])
  return (
    <DocsPage
      wrapped={wrapped}
      contents={contents?.length ? contents : undefined}
      sections={[
        {
          id,
          label,
          content: (
            <DocsContent ref={content}>
              <Content components={{ pre: ShikiPre, code: InlineCode }} />
            </DocsContent>
          ),
        },
      ]}
    />
  )
}

export default MdxPage
