import * as React from "react"
import App, { type AppProps } from "@niceprototypes/app"
import { breakpointKeyMatches, parseBreakpointKey, useBreakpoint } from "@niceprototypes/styles"
import DocsGlobalStyle from "../DocsGlobalStyle"
import ThemeToggle from "../ThemeToggle"
import { DocsEndProvider, DocsEndTarget, useDocsEnd } from "../DocsEnd"
import { DocsSettingsContext } from "../DocsPage"

/** From laptop up the settings sit beside Contents or above the page (DocsPage); below, in the header row. */
const SETTINGS_IN_PAGE = parseBreakpointKey("laptop+")

/**
 * The App, its end column (Contents and settings) shown while the page asks for it (DocsPage), and
 * below laptop the settings in its header row, between the search and the menu button.
 */
const DocsShell = (props: Omit<AppProps, "end">) => {
  const settings = React.useContext(DocsSettingsContext)
  const inPage = breakpointKeyMatches(SETTINGS_IN_PAGE, useBreakpoint())
  return <App {...props} headerActions={inPage ? undefined : settings} end={useDocsEnd().shown ? <DocsEndTarget /> : null} />
}

/**
 * DocsApp
 *
 * A docs site's shell: App (nav with the pages, search) with the docs end column, where each
 * DocsPage puts its Contents and the settings (the theme switch, ThemeToggle; in the header row
 * below laptop), and the docs global style. Takes App's props but `end`; the logo links to niceprototypes.com unless `logoHref` says
 * otherwise. The site registers DocsSiteTokenMap and sets the theme before first paint
 * (config-vite niceThemeBootstrap).
 */
const DocsApp: React.FC<Omit<AppProps, "end">> = ({ logoHref = "https://niceprototypes.com", ...props }) => (
  <>
    <DocsGlobalStyle />
    <DocsSettingsContext.Provider value={<ThemeToggle />}>
      <DocsEndProvider>
        <DocsShell logoHref={logoHref} {...props} />
      </DocsEndProvider>
    </DocsSettingsContext.Provider>
  </>
)

export default DocsApp
