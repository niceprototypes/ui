import { createRoot } from "react-dom/client"
import App from "@niceprototypes/app"
import { applyTheme, StylesProvider } from "@niceprototypes/styles"
import "@niceprototypes/styles/reset.css"
import "@niceprototypes/icon-vendor"
import "@niceprototypes/image-vendor"
import "./tokens"
import ThemeToggle from "./components/ThemeToggle"
import DocsGlobalStyle from "./components/DocsGlobalStyle"
import { DocsEndProvider, DocsEndTarget, useDocsEnd } from "./components/DocsEnd"
import { DocsSettingsContext } from "./components/DocsPage"
import { DocsNavigationContext } from "@niceprototypes/docs/components/DocsNavigation"
import { docsUrlOf, pageContents, pages, redirectOf } from "./pages"
import { docsRouter, withBase, withoutBase } from "./router"

// Old addresses (moved pages, Storybook links) open where their page is now.
const redirect = redirectOf(withoutBase(window.location.pathname), window.location.search)
if (redirect) window.history.replaceState(null, "", withBase(redirect))

// The site opens in the OS theme; ThemeToggle switches it.
applyTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "night" : "day")

/** Docs links written for Storybook open the docs page of their Storybook id. */
const openStory = (storyId: string) => {
  const url = docsUrlOf(storyId)
  if (url) window.location.assign(withBase(url))
}

/** The App, its end column (Contents and settings) shown while the page asks for it. */
const DocsShell = () => (
  <App
    pages={pages}
    contents={pageContents}
    router={docsRouter}
    aria-label="Docs"
    navSize="base"
    search
    end={useDocsEnd().shown ? <DocsEndTarget /> : null}
  />
)

createRoot(document.getElementById("root")!).render(
  <StylesProvider links={[{ rel: "stylesheet", href: `${import.meta.env.BASE_URL}fonts/avenir.css` }]}>
    <DocsGlobalStyle />
    <DocsNavigationContext.Provider value={openStory}>
    <DocsSettingsContext.Provider value={<ThemeToggle />}>
      <DocsEndProvider>
        <DocsShell />
      </DocsEndProvider>
    </DocsSettingsContext.Provider>
    </DocsNavigationContext.Provider>
  </StylesProvider>,
)
