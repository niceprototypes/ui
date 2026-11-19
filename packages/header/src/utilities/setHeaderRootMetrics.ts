import { getToken } from "@niceprototypes/styles"

/** The variables written on the root, by name (defaults: the `header.height` and `header.inset` tokens). */
const HEIGHT_KEY = getToken("header.height", { as: "key" })
const INSET_KEY = getToken("header.inset", { as: "key" })

/** The attribute that opts a root into the scroll-padding rule (`:where([data-np-header-root])`). */
export const HEADER_ROOT_ATTRIBUTE = "data-np-header-root"

/** Each root's positioned headers and their metrics. */
const roots = new Map<HTMLElement, Map<symbol, { height: number; inset: number }>>()

/**
 * Record one header's metrics on its root and write the tallest of the root's headers: the height to
 * `--np--header--height` and the covered top (height plus offset) to `--np--header--inset`. Two headers
 * on one root never overwrite each other; the last one removed clears the variables and the attribute.
 *
 * @param root - The page's `html`, or the scroll container
 * @param id - The header's identity
 * @param metrics - Its height and inset in pixels, or null to remove it
 */
export const setHeaderRootMetrics = (root: HTMLElement, id: symbol, metrics: { height: number; inset: number } | null) => {
  const headers = roots.get(root) ?? new Map()
  if (metrics) headers.set(id, metrics)
  else headers.delete(id)
  if (headers.size === 0) {
    roots.delete(root)
    root.style.removeProperty(HEIGHT_KEY)
    root.style.removeProperty(INSET_KEY)
    root.removeAttribute(HEADER_ROOT_ATTRIBUTE)
    return
  }
  roots.set(root, headers)
  const values = Array.from(headers.values())
  root.style.setProperty(HEIGHT_KEY, `${Math.max(...values.map(value => value.height))}px`)
  root.style.setProperty(INSET_KEY, `${Math.max(...values.map(value => value.inset))}px`)
  root.setAttribute(HEADER_ROOT_ATTRIBUTE, "")
}
