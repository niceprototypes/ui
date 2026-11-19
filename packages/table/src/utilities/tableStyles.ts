import { getToken } from "@niceprototypes/styles"

/** The divider and card border. */
export const tableBorder = `${getToken("table.borderWidth")} solid ${getToken("table.borderColor")}`

/** The focus ring of rows and cells, drawn inside them so neighbours never cover it. */
export const tableFocusRing = `
  outline: ${getToken("table.focusRing.width")} solid ${getToken("table.focusRing.color")};
  outline-offset: calc(-1 * ${getToken("table.focusRing.width")});
`
