import * as React from "react"
import { BREAKPOINT_ORDER, useBreakpoint } from "@niceprototypes/styles"
import { FLOW_ROLE_ATTRIBUTE } from "@niceprototypes/flow"
import Ink from "@niceprototypes/ink"
import Select from "@niceprototypes/select"
import TabsList from "../../utilities/TabsList"
import { StyledTabsSectionControl, StyledTabsSectionRow, StyledTabsSectionTitle } from "./TabsSection.styles"
import type { TabsSectionProps, TabsSectionSelectEventType } from "./TabsSection.types"

/**
 * TabsSection
 *
 * A section whose heading carries its tabs: the title at the left of the heading row, the tabs at
 * its right edge, and the selected tab's panel below. Below `selectBelow` (phone, by default) the
 * tabs become a native Select at the right of the same row, which the heading names; it drives
 * the same selected id and panel.
 *
 * It renders the heading row and the panel as two siblings, so in a Flow column the row is spaced
 * as its heading level (`data-flow-role`) and the panel as a block. The tab list is named by the
 * heading; the panel is the tabs' `tabpanel`, or, with the select, a region named by the heading.
 *
 * Controlled with `selected` + `onSelect`, or uncontrolled with `defaultSelected`.
 *
 * @example
 * ```tsx
 * <Flow>
 *   <TabsSection title="After" items={implementations} selected={id} onSelect={setId}>
 *     {panels[id]}
 *   </TabsSection>
 * </Flow>
 * ```
 */
const TabsSection: React.FC<TabsSectionProps> = ({
  title,
  level = "h2",
  items,
  selected,
  defaultSelected,
  onSelect,
  children,
  size = "base",
  variant = "underline",
  selectBelow = "tablet",
}) => {
  const baseId = React.useId()
  const breakpoint = useBreakpoint()
  const [ownSelected, setOwnSelected] = React.useState(
    () => defaultSelected ?? items.find(item => !item.disabled)?.id,
  )
  const selectedId = selected ?? ownSelected
  const headingId = `${baseId}-heading`
  const panelId = `${baseId}-panel`
  const tabId = (id: string) => `${baseId}-tab-${id}`
  const asSelect = selectBelow !== "none" && BREAKPOINT_ORDER.indexOf(breakpoint) < BREAKPOINT_ORDER.indexOf(selectBelow)

  const select = (id: string, event?: TabsSectionSelectEventType) => {
    if (selected === undefined) setOwnSelected(id)
    onSelect?.(id, event)
  }

  return (
    <>
      <StyledTabsSectionRow {...{ [FLOW_ROLE_ATTRIBUTE]: level }}>
        <StyledTabsSectionTitle>
          <Ink as={level} id={headingId} weight="semibold">
            {title}
          </Ink>
        </StyledTabsSectionTitle>
        <StyledTabsSectionControl>
          {asSelect ? (
            <Select
              native
              size={size}
              aria-labelledby={headingId}
              aria-controls={panelId}
              value={selectedId}
              onChange={select}
              options={items.map(item => ({
                value: item.id,
                // A native option renders text only: a node label falls back to the tab's id.
                label: typeof item.label === "string" || typeof item.label === "number" ? item.label : item.id,
                disabled: item.disabled,
              }))}
            />
          ) : (
            <TabsList
              items={items}
              selectedId={selectedId}
              onSelect={select}
              tabId={tabId}
              panelId={panelId}
              size={size}
              variant={variant}
              aria-labelledby={headingId}
            />
          )}
        </StyledTabsSectionControl>
      </StyledTabsSectionRow>
      {selectedId !== undefined &&
        (asSelect ? (
          <div role="region" id={panelId} aria-labelledby={headingId}>
            {children}
          </div>
        ) : (
          <div role="tabpanel" id={panelId} aria-labelledby={tabId(selectedId)} tabIndex={0}>
            {children}
          </div>
        ))}
    </>
  )
}

export default TabsSection
