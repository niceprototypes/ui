import * as React from "react"
import type { FontSizeType } from "@niceprototypes/styles"
import type { MarkdownToJSX } from "markdown-to-jsx/react"

/**
 * MarkdownChildrenType
 *
 * The markdown source. While a reply streams, pass the text received so far.
 */
export type MarkdownChildrenType = string

/**
 * MarkdownLinkComponentType
 *
 * Renders every link (`[label](href)`), e.g. a router link. Unset, links are anchors.
 */
export type MarkdownLinkComponentType = React.ComponentType<{ href: string; children: React.ReactNode }>

/**
 * MarkdownSizeType
 *
 * Re-export of FontSizeType from @niceprototypes/styles.
 * Font size of paragraphs and list items; headings keep their own sizes.
 */
export type MarkdownSizeType = FontSizeType

/**
 * MarkdownOverridesType
 *
 * Re-export of markdown-to-jsx's Overrides: elements by tag name, merged over the Nice defaults.
 * Overriding `pre` or `code` replaces the Code default for fenced code; `code` for inline code.
 */
export type MarkdownOverridesType = MarkdownToJSX.Overrides

/**
 * MarkdownListLimitType
 *
 * How many items a top-level list shows before a "Show N more" button reveals the rest (the
 * button then reads "Show less"). Unset, every item shows.
 */
export type MarkdownListLimitType = number

/**
 * MarkdownProps
 *
 * Complete prop definition for the Markdown component.
 */
export interface MarkdownProps {
  /** The markdown source */
  children: MarkdownChildrenType
  /** Renders links in place of an anchor */
  linkComponent?: MarkdownLinkComponentType
  /** Font size of paragraphs and list items */
  size?: MarkdownSizeType
  /** markdown-to-jsx overrides, merged over the Nice defaults */
  overrides?: MarkdownOverridesType
  /** Items a top-level list shows before a "Show N more" button; unset, all */
  listLimit?: MarkdownListLimitType
}

// Declaration merging: const + namespace creates an exportable type namespace.
const MarkdownTypes = {} as const

namespace MarkdownTypes {
  export type Children = MarkdownChildrenType
  export type LinkComponent = MarkdownLinkComponentType
  export type Size = MarkdownSizeType
  export type Overrides = MarkdownOverridesType
  export type ListLimit = MarkdownListLimitType
  export type Props = MarkdownProps
}

export default MarkdownTypes
