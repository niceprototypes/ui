import * as React from "react"
import { Theme } from "@niceprototypes/styles"
import TabsList from "../../utilities/TabsList"
import { StyledPanel, StyledRow } from "./Tabs.styles"
import type { TabsProps, TabsSelectEventType } from "./Tabs.types"

/**
 * Tabs renders a WAI-ARIA tab list, optional `end` content after the tabs (such as an add
 * button), and the selected tab's panel (`children`). Tab labels may be any node, including
 * an input: tabs are not buttons, and keys pressed inside a label's own control stay with
 * that control.
 *
 * The selected tab is the only one in the tab order (roving tabindex); the panel follows it
 * in the tab order (`tabIndex={0}`). On a focused tab,
 * ArrowLeft / ArrowRight move to and select the previous / next enabled tab, wrapping; Home
 * and End go to the first and last; Enter and Space select.
 *
 * Controlled with `selected` + `onSelect`, or uncontrolled with `defaultSelected`.
 *
 * @example
 * ```tsx
 * <Tabs
 *   items={[{ id: "page-1", label: "Page 1" }, { id: "page-2", label: "Page 2" }]}
 *   selected={page}
 *   onSelect={setPage}
 *   end={<Button iconLeft="plus" aria-label="Add page" />}
 * >
 *   {panel}
 * </Tabs>
 * ```
 */
const Tabs: React.FC<TabsProps> = ({
  items,
  selected,
  defaultSelected,
  onSelect,
  end,
  children,
  size = "base",
  justifyContent,
  gap,
  variant = "underline",
  "aria-label": ariaLabel,
  ref,
  className,
  theme,
}) => {
  const baseId = React.useId()
  const [ownSelected, setOwnSelected] = React.useState(
    () => defaultSelected ?? items.find(item => !item.disabled)?.id,
  )
  const selectedId = selected ?? ownSelected
  const tabId = (id: string) => `${baseId}-tab-${id}`
  const panelId = `${baseId}-panel`

  const select = (id: string, event: TabsSelectEventType) => {
    if (selected === undefined) setOwnSelected(id)
    onSelect?.(id, event)
  }

  const element = (
    <div ref={ref} className={className}>
      <StyledRow $size={size} $gap={gap} $justifyContent={justifyContent} $variant={variant}>
        <TabsList
          items={items}
          selectedId={selectedId}
          onSelect={select}
          tabId={tabId}
          panelId={panelId}
          size={size}
          gap={gap}
          variant={variant}
          aria-label={ariaLabel}
        />
        {end}
      </StyledRow>
      {selectedId !== undefined && (
        <StyledPanel role="tabpanel" id={panelId} aria-labelledby={tabId(selectedId)} tabIndex={0} $size={size}>
          {children}
        </StyledPanel>
      )}
    </div>
  )

  return theme ? <Theme name={theme}>{element}</Theme> : element
}

export default Tabs
