import * as React from "react"
import { findTabIndex, type TabsNavigationKey } from "../findTabIndex"
import { StyledTab, StyledTabList } from "../../components/Tabs/Tabs.styles"
import type { TabsListProps } from "./TabsList.types"

const NAVIGATION_KEYS: string[] = ["ArrowRight", "ArrowLeft", "Home", "End"] satisfies TabsNavigationKey[]

/**
 * TabsList
 *
 * The WAI-ARIA tab list. The selected tab is the only one in the tab order (roving tabindex);
 * on a focused tab ArrowLeft / ArrowRight move to and select the previous / next enabled tab,
 * wrapping, Home and End go to the first and last, Enter and Space select. Keys pressed inside a
 * label's own control stay with that control. Internal: Tabs and TabsSection render it.
 */
const TabsList: React.FC<TabsListProps> = ({
  items,
  selectedId,
  onSelect,
  tabId,
  panelId,
  size,
  gap,
  variant,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}) => {
  // The one tab in the tab order: the selected tab, or the first enabled one if it is disabled.
  const focusableId = items.some(item => item.id === selectedId && !item.disabled)
    ? selectedId
    : items.find(item => !item.disabled)?.id
  const tabRefs = React.useRef(new Map<string, HTMLDivElement>())

  const onTabKeyDown = (index: number) => (event: React.KeyboardEvent<HTMLDivElement>) => {
    // Keys pressed inside a label's own control (e.g. arrow keys in an input) belong to it.
    if (event.target !== event.currentTarget) return
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      onSelect(items[index].id, event)
      return
    }
    if (!NAVIGATION_KEYS.includes(event.key)) return
    event.preventDefault()
    const next = findTabIndex(items, index, event.key as TabsNavigationKey)
    if (next === -1) return
    tabRefs.current.get(items[next].id)?.focus()
    onSelect(items[next].id, event)
  }

  return (
    <StyledTabList role="tablist" aria-label={ariaLabel} aria-labelledby={ariaLabelledBy} $size={size} $gap={gap}>
      {items.map((item, index) => {
        const isSelected = item.id === selectedId
        const disabled = !!item.disabled
        return (
          <StyledTab
            key={item.id}
            ref={node => {
              if (node) tabRefs.current.set(item.id, node)
              else tabRefs.current.delete(item.id)
            }}
            role="tab"
            id={tabId(item.id)}
            aria-selected={isSelected}
            aria-controls={isSelected ? panelId : undefined}
            aria-disabled={disabled || undefined}
            tabIndex={item.id === focusableId ? 0 : -1}
            onClick={event => {
              if (!disabled) onSelect(item.id, event)
            }}
            onKeyDown={onTabKeyDown(index)}
            $size={size}
            $selected={isSelected}
            $disabled={disabled}
            $variant={variant}
          >
            {item.label}
          </StyledTab>
        )
      })}
    </StyledTabList>
  )
}

export default TabsList
