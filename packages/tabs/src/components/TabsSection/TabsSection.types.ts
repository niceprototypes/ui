import type * as React from "react"
import type { SettableBreakpoint } from "@niceprototypes/styles"
import type { SelectOnChangeEventType } from "@niceprototypes/select"
import type {
  TabsChildrenType,
  TabsDefaultSelectedType,
  TabsItemsType,
  TabsSelectedType,
  TabsSelectEventType,
  TabsSizeType,
  TabsVariantType,
} from "../Tabs/Tabs.types"

/**
 * TabsSectionTitleType
 *
 * The section's heading text, semibold, at the left of the heading row.
 */
export type TabsSectionTitleType = React.ReactNode

/**
 * TabsSectionLevelType
 *
 * The heading's element. A Flow column spaces the heading row as this heading level.
 *
 * Values:
 * - "h2": default. A page's section
 * - "h3": a subsection
 * - "h4": a subsection's part
 */
export type TabsSectionLevelType = "h2" | "h3" | "h4"

/**
 * TabsSectionSelectEventType
 *
 * The event that selected a tab: a click or key press on a tab, or the select's change event
 * below `selectBelow`.
 */
export type TabsSectionSelectEventType = TabsSelectEventType | SelectOnChangeEventType

/**
 * TabsSectionOnSelectType
 *
 * Selection handler: the selected tab's id first, then the event.
 */
export type TabsSectionOnSelectType = (id: string, event?: TabsSectionSelectEventType) => void

/**
 * TabsSectionSelectBelowType
 *
 * The breakpoint (its `breakpoints` token floor) below which the tabs become a select at the
 * right of the heading row, so a phone keeps the title and the choice on one row.
 *
 * Values:
 * - "tablet": default. A select on phone, tabs from tablet up
 * - "laptop": a select on phone and tablet
 * - "desktop": a select below desktop
 * - "none": tabs at every width
 */
export type TabsSectionSelectBelowType = SettableBreakpoint | "none"

/**
 * TabsSectionProps
 *
 * Complete prop definition for the TabsSection component: a heading row (the title, its tabs on
 * the right) and the selected tab's panel below it, as two siblings in a Flow column.
 */
export interface TabsSectionProps {
  /** The heading text */
  title: TabsSectionTitleType
  /** The heading's element @default "h2" */
  level?: TabsSectionLevelType
  /** The tabs, in order; each one's label is the select's option text below `selectBelow` */
  items: TabsItemsType
  /** id of the selected tab (controlled) */
  selected?: TabsSelectedType
  /** id of the tab selected first (uncontrolled) */
  defaultSelected?: TabsDefaultSelectedType
  /** Selection handler: id, then the event */
  onSelect?: TabsSectionOnSelectType
  /** The selected tab's panel content */
  children?: TabsChildrenType
  /** Tab and select size @default "base" */
  size?: TabsSizeType
  /** Tab look @default "underline" */
  variant?: TabsVariantType
  /** The breakpoint below which the tabs become a select @default "tablet" */
  selectBelow?: TabsSectionSelectBelowType
}

// Declaration merging: const + namespace creates exportable type namespace
const TabsSectionTypes = {} as const

namespace TabsSectionTypes {
  export type Title = TabsSectionTitleType
  export type Level = TabsSectionLevelType
  export type SelectEvent = TabsSectionSelectEventType
  export type OnSelect = TabsSectionOnSelectType
  export type SelectBelow = TabsSectionSelectBelowType
  export type Props = TabsSectionProps
}

export default TabsSectionTypes
