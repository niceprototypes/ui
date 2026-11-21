import { createGlobalStyle } from "styled-components"
import { getToken } from "../../tokens"

/** The site's own global rule: selected text in the docs selection colour. */
const DocsGlobalStyle = createGlobalStyle`
  ::selection {
    background-color: ${getToken("docs", "selectionColor")};
  }
`

export default DocsGlobalStyle
