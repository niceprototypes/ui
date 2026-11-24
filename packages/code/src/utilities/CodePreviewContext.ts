import * as React from "react"

/**
 * True inside a Code block's live demo (its children). A code block there renders flat, so a
 * code box never nests inside another.
 */
export const CodePreviewContext = React.createContext(false)
