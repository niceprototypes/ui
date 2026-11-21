import { createGlobalStyle } from "styled-components"
import { getToken as getCoreToken } from "@niceprototypes/styles"
import { getToken } from "../../tokens"

/**
 * The site's own global rules: selected text in the docs selection colour, and the sidebar's
 * active page row (the App's Tree nav, labelled "Docs") as Stripe's API reference marks it: the
 * active colour (`tree.activeColor`) on a faint tint of it, rounded, its text kept in line with
 * the other rows. Tree has no active background token yet (backlog), so the row is reached here.
 */
const DocsGlobalStyle = createGlobalStyle`
  ::selection {
    background-color: ${getToken("docs", "selectionColor")};
  }

  nav[aria-label="Docs"] a[aria-current="page"] {
    margin-inline-start: calc(-1 * ${getCoreToken("gap", "smaller")});
    padding-inline: ${getCoreToken("gap", "smaller")};
    border-radius: ${getCoreToken("borderRadius", "small")};
    background-color: ${getToken("docs", "activeBackgroundColor")};
  }
`

export default DocsGlobalStyle
