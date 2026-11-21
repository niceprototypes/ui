import * as React from "react"
import Icon from "@niceprototypes/icon"
import { StyledTreeExpander, StyledTreeExpanderSlot } from "./TreeExpander.styles"
import type { TreeExpanderProps, TreeExpanderSlotProps } from "./TreeExpander.types"

/**
 * TreeExpander
 *
 * The circled caret that opens and closes a tree row (Tree's nav, DataTable's rows): a button
 * with `aria-expanded` when given `onToggle`, else a decorative mark inside the row's own button.
 * It sits in the icon slot, so the guide's arm runs into its circle and its rail drops from its
 * centre. Rows without one keep the slot with TreeExpanderSlot, so labels line up.
 *
 * @example
 * <TreeExpander caret={open ? "bottom" : "right"} expanded={open} aria-label="src" onToggle={toggle} />
 */
const TreeExpander: React.FC<TreeExpanderProps> = ({
  caret,
  expanded,
  active = false,
  onToggle,
  controls,
  "aria-label": ariaLabel,
  tabIndex,
  onKeyDown,
}) => {
  const icon = <Icon name={caret === "right" ? "carat-right" : "carat-bottom"} />
  if (!onToggle)
    return (
      <StyledTreeExpander $active={active} aria-hidden="true">
        {icon}
      </StyledTreeExpander>
    )
  return (
    <StyledTreeExpander
      as="button"
      type="button"
      $active={active}
      aria-label={ariaLabel}
      aria-expanded={expanded}
      aria-controls={controls}
      tabIndex={tabIndex}
      onClick={onToggle}
      onKeyDown={onKeyDown}
    >
      {icon}
    </StyledTreeExpander>
  )
}

/** The expander's slot in a row without one (see TreeExpanderSlotProps). */
export const TreeExpanderSlot: React.FC<TreeExpanderSlotProps> = ({ arm = false, active = false }) => (
  <StyledTreeExpanderSlot $arm={arm} $active={active} aria-hidden="true" />
)

export default TreeExpander
