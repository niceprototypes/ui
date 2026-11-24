import * as React from "react"
import App, { type AppProps } from "@niceprototypes/app"
import DocsGlobalStyle from "../DocsGlobalStyle"
import ThemeToggle from "../ThemeToggle"
import { DocsEndProvider, DocsEndTarget, useDocsEnd } from "../DocsEnd"
import { DocsSettingsContext } from "../DocsPage"

/** The App, its end column (Contents and settings) shown while the page asks for it (DocsPage). */
const DocsShell = (props: Omit<AppProps, "end">) => <App {...props} end={useDocsEnd().shown ? <DocsEndTarget /> : null} />

/**
 * DocsApp
 *
 * A docs site's shell: App (nav with the pages, search) with the docs end column, where each
 * DocsPage puts its Contents and the settings (the Dark switch, ThemeToggle), and the docs global
 * style. Takes App's props but `end`. The site registers DocsSiteTokenMap and sets the theme
 * before first paint (config-vite niceThemeBootstrap).
 */
const DocsApp: React.FC<Omit<AppProps, "end">> = props => (
  <>
    <DocsGlobalStyle />
    <DocsSettingsContext.Provider value={<ThemeToggle />}>
      <DocsEndProvider>
        <DocsShell {...props} />
      </DocsEndProvider>
    </DocsSettingsContext.Provider>
  </>
)

export default DocsApp
