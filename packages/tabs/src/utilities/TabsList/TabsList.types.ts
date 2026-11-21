import type { GapType } from "@niceprototypes/styles"
import type { TabsItemsType, TabsSelectEventType, TabsSizeType, TabsVariantType } from "../../components/Tabs/Tabs.types"

/**
 * TabsListProps
 *
 * The tab list Tabs and TabsSection share: the tabs, which one is selected, and how each tab's and
 * the panel's ids are built, so the tabs point at a panel the caller renders.
 */
export interface TabsListProps {
  /** The tabs, in order */
  items: TabsItemsType
  /** id of the selected tab */
  selectedId?: string
  /** Called with a tab's id and the click or key press that selected it */
  onSelect: (id: string, event: TabsSelectEventType) => void
  /** A tab's element id */
  tabId: (id: string) => string
  /** The panel's element id, the selected tab's aria-controls */
  panelId: string
  /** Tab padding, gap and font size */
  size: TabsSizeType
  /** Gap between tabs; overrides the size's gap */
  gap?: GapType
  /** Tab look */
  variant: TabsVariantType
  /** Accessible name of the tab list */
  "aria-label"?: string
  /** id of the element that names the tab list */
  "aria-labelledby"?: string
}
