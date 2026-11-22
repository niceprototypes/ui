/**
 * DocsHeadingType
 *
 * One of a docs page's sections from its headings, as its Contents column and the nav list it:
 * the heading's anchor `id`, its `label`, and the h3s under an h2 in `items`.
 */
export type DocsHeadingType = { id: string; label: string; items?: DocsHeadingType[] }

type FlatHeadingType = { level: 2 | 3; label: string; id?: string }

/** A heading's text as an anchor id: lower case, runs of other characters as one dash. */
export const slugOf = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

/** Whether a heading repeats the page's title (its nav name): it is the title, not a section. */
const isTitle = (label: string, title?: string) => title !== undefined && label.trim().toLowerCase() === title.trim().toLowerCase()

/**
 * Headings in page order as nested rows: an h3 under the h2 before it; an h3 with no h2 above it
 * is a top-level row, and so are the h3s after it (an h3 nests only under an h2, so a page of h3s
 * alone has no phantom level). Ids are made unique on the page (`taken`).
 */
const nest = (headings: FlatHeadingType[], taken: (id: string) => boolean): DocsHeadingType[] => {
  const used = new Set<string>()
  const rows: { id: string; label: string; items: DocsHeadingType[]; h2: boolean }[] = []
  for (const heading of headings) {
    let id = heading.id
    if (!id) {
      const base = slugOf(heading.label) || "section"
      id = base
      for (let n = 2; used.has(id) || taken(id); n++) id = `${base}-${n}`
    }
    used.add(id)
    heading.id = id
    const row = { id, label: heading.label, items: [] as DocsHeadingType[], h2: heading.level === 2 }
    const parent = rows[rows.length - 1]
    if (!row.h2 && parent?.h2) parent.items.push({ id: row.id, label: row.label })
    else rows.push(row)
  }
  return rows.map(({ items, h2: _h2, ...row }) => (items.length ? { ...row, items } : row))
}

/**
 * docsHeadingsOfContent
 *
 * A rendered docs page's sections: the h2 and h3 that are direct children of its content column
 * (the page's own headings; a component's headings inside it, such as a link card's title, are
 * not sections), less the one repeating the page's `title`. A heading without an id gets one from
 * its text, unique on the page.
 *
 * @example
 * docsHeadingsOfContent(contentElement, "Welcome")
 */
export const docsHeadingsOfContent = (root: HTMLElement, title?: string): DocsHeadingType[] => {
  const elements = [...root.querySelectorAll<HTMLElement>(":scope > h2, :scope > h3")].filter(
    element => element.textContent?.trim() && !isTitle(element.textContent, title),
  )
  const flat: FlatHeadingType[] = elements.map(element => ({
    level: element.tagName === "H2" ? 2 : 3,
    label: element.textContent!.trim(),
    id: element.id || undefined,
  }))
  const rows = nest(flat, id => !!root.ownerDocument.getElementById(id))
  elements.forEach((element, index) => {
    if (!element.id) element.id = flat[index].id!
  })
  return rows
}

/** A JSX heading's inner source as its text: a Code chip as its code, a string expression as its string, other tags dropped. */
const textOfSource = (source: string) =>
  source
    .replace(/<Code\b[^>]*\bcode="([^"]*)"[^>]*\/>/g, "$1")
    .replace(/\{"([^"]*)"\}/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim()

/** The end of the `<Ink …>` element opened at `from`: its inner source and the index after its matching `</Ink>`, nested Inks counted. */
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
 * docsHeadingsOfSource
 *
 * An MDX page's sections from its source, without rendering it: the h2 and h3 written at the top
 * level of the page (markdown `##`/`###`, and `<Ink as="h2">` or `<h2>` at the start of a line;
 * an indented one sits inside a component and is not a section), less the one repeating the
 * page's `title`, nested and given ids as `docsHeadingsOfContent` gives the rendered page. A
 * heading whose text is a JavaScript expression reads as its literal text.
 *
 * @example
 * docsHeadingsOfSource(welcomeMdx, "Welcome")
 */
export const docsHeadingsOfSource = (source: string, title?: string): DocsHeadingType[] => {
  const headings: FlatHeadingType[] = []
  const pattern = /^(#{2,3})\s+(.+)$|^<Ink\b(?=[^>]*\bas="h([23])")([^>]*)>|^<h([23])\b([^>]*)>([\s\S]*?)<\/h\5>/gm
  for (let match = pattern.exec(source); match; match = pattern.exec(source)) {
    if (match[1]) headings.push({ level: match[1].length as 2 | 3, label: textOfSource(match[2]) })
    else if (match[3]) {
      const element = inkEnd(source, match.index)
      if (!element) continue
      headings.push({ level: Number(match[3]) as 2 | 3, label: textOfSource(element.inner), id: /\bid="([^"]+)"/.exec(match[4])?.[1] })
      pattern.lastIndex = element.end
    } else headings.push({ level: Number(match[5]) as 2 | 3, label: textOfSource(match[7]), id: /\bid="([^"]+)"/.exec(match[6])?.[1] })
  }
  return nest(
    headings.filter(heading => heading.label && !isTitle(heading.label, title)),
    () => false,
  )
}
