/**
 * DocsRuleLevelType
 *
 * Which break the rule marks: `section`, between a page's top-level sections (DocsPage puts those
 * between its tiles, line to line); `subsection`, under a subsection heading or between a list's
 * items. Both are as wide as their column, so inside a tile they keep its content inset.
 */
export type DocsRuleLevelType = "section" | "subsection"

/**
 * DocsRuleProps
 *
 * Complete prop definition for the DocsRule component.
 */
export interface DocsRuleProps {
  /** The break it marks. @default "section" */
  level?: DocsRuleLevelType
}
