import * as React from "react"
import { StyledDocsEnd } from "./DocsEnd.styles"

type DocsEndContextValue = {
  /** The end column's element, where the page portals its Contents and settings */
  element: HTMLElement | null
  setElement: (element: HTMLElement | null) => void
  /** Whether the page wants the end column now (App renders it only then) */
  shown: boolean
  setShown: (shown: boolean) => void
}

const DocsEndContext = React.createContext<DocsEndContextValue | null>(null)

/** The docs site's end column state, around the App. */
export const DocsEndProvider = ({ children }: { children: React.ReactNode }) => {
  const [element, setElement] = React.useState<HTMLElement | null>(null)
  const [shown, setShown] = React.useState(false)
  const value = React.useMemo(() => ({ element, setElement, shown, setShown }), [element, shown])
  return <DocsEndContext.Provider value={value}>{children}</DocsEndContext.Provider>
}

/** The end column's state; throws outside DocsEndProvider. */
export const useDocsEnd = () => {
  const value = React.useContext(DocsEndContext)
  if (!value) throw new Error("useDocsEnd runs only inside DocsEndProvider")
  return value
}

/**
 * DocsEndTarget
 *
 * The element App's `end` column holds: the page (DocsPage) portals its Contents and settings
 * into it, so they stay put like the nav while the page scrolls, and scroll on their own when taller.
 */
export const DocsEndTarget = () => <StyledDocsEnd ref={useDocsEnd().setElement} />
