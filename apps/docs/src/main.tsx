import { createRoot } from "react-dom/client"
import { StylesProvider } from "@niceprototypes/styles"
import "@niceprototypes/styles/reset.css"
import "@niceprototypes/icon-vendor"
import "@niceprototypes/image-vendor"
import "./tokens"
import DocsApp from "@niceprototypes/docs/components/DocsApp"
import { DocsNavigationContext } from "@niceprototypes/docs/components/DocsNavigation"
import { docsUrlOf, pageContents, pages, redirectOf } from "./pages"
import { docsRouter, withBase, withoutBase } from "./router"

// Old addresses (moved pages, Storybook links) open where their page is now, at the same section.
const redirect = redirectOf(withoutBase(window.location.pathname), window.location.search)
if (redirect) window.history.replaceState(null, "", withBase(redirect.includes("#") ? redirect : `${redirect}${window.location.hash}`))

/** Docs links written for Storybook open the docs page of their Storybook id. */
const openStory = (storyId: string) => {
  const url = docsUrlOf(storyId)
  if (url) window.location.assign(withBase(url))
}

createRoot(document.getElementById("root")!).render(
  <StylesProvider links={[{ rel: "stylesheet", href: `${import.meta.env.BASE_URL}fonts/avenir.css` }]}>
    <DocsNavigationContext.Provider value={openStory}>
      <DocsApp pages={pages} contents={pageContents} router={docsRouter} aria-label="Docs" navSize="base" search />
    </DocsNavigationContext.Provider>
  </StylesProvider>,
)
