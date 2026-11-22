/** The share of the viewport height, from its top, a section's top must pass to become active. */
const SPY_LINE = 0.25

/**
 * The element the sections scroll in: their nearest ancestor that scrolls (an app's region), else
 * the document.
 */
const scrollerOf = (element: HTMLElement): Element => {
  for (let parent = element.parentElement; parent; parent = parent.parentElement) {
    const overflow = getComputedStyle(parent).overflowY
    if ((overflow === "auto" || overflow === "scroll") && parent.scrollHeight > parent.clientHeight) return parent
  }
  return document.scrollingElement ?? document.documentElement
}

/**
 * The id of the section in view: the last one, in page order, whose top has passed the spy
 * line. Once the sections' scroller (an app's region, else the page) is at its end, the last
 * section whose top is on screen wins,
 * so short closing sections still activate. Before the first section passes, the first.
 */
export const getSpiedId = (ids: readonly string[]): string | undefined => {
  const sections = ids
    .map(id => ({ id, element: document.getElementById(id) }))
    .filter((section): section is { id: string; element: HTMLElement } => section.element !== null)
  if (sections.length === 0) return undefined

  const viewport = window.innerHeight
  const page = scrollerOf(sections[0].element)
  const atEnd = page.scrollTop > 0 && page.scrollTop + page.clientHeight >= page.scrollHeight - 1
  const line = atEnd ? viewport : viewport * SPY_LINE

  let active = sections[0].id
  for (const { id, element } of sections) {
    if (element.getBoundingClientRect().top <= line) active = id
  }
  return active
}
