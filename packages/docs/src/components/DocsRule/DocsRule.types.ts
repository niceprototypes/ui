/**
 * DocsRuleLevelType
 *
 * Which break the rule marks: `section`, between a page's top-level sections, edge to edge with
 * no gutter; `subsection`, under a subsection heading or between a list's items, inset to its column.
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
