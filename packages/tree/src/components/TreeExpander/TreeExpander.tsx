import * as React from "react"
import Icon from "@niceprototypes/icon"
import { StyledTreeExpander, StyledTreeExpanderCaret, StyledTreeExpanderSlot } from "./TreeExpander.styles"
import type { TreeExpanderProps, TreeExpanderSlotProps } from "./TreeExpander.types"

/**
 * TreeExpander
 *
 * The circled caret that opens and closes a tree row (Tree's nav, DataTable's rows): placed right
 * after the row's TreeGuide, the guide's arm touching its left edge; a sub-row's rail drops from
 * its centre. Rows without one keep its place with TreeExpanderSlot (the arm drawn through it),
 * so labels line up. A button with `aria-expanded` when
 * given `onToggle`; `decorative` (a folder whose row is already the toggle) keeps it out of the
 * tab order and the accessibility tree, a click on it still toggling. One caret icon, turned by
 * transform (`caret`), the turn animated with the expander's animation tokens.
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
  decorative = false,
  stem,
}) => {
  const icon = (
    <StyledTreeExpanderCaret $caret={caret}>
      <Icon name="carat-right" />
    </StyledTreeExpanderCaret>
  )
  if (!onToggle || decorative)
    return (
      <StyledTreeExpander
        $active={active}
        $stem={stem}
        data-stem={stem}
        aria-hidden="true"
        data-decorative={onToggle ? "" : undefined}
        onClick={onToggle as React.MouseEventHandler<HTMLElement> | undefined}
      >
        {icon}
      </StyledTreeExpander>
    )
  return (
    <StyledTreeExpander
      as="button"
      type="button"
      $active={active}
      $stem={stem}
      data-stem={stem}
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

/** The expander's place in a row without one (see TreeExpanderSlotProps): circle-wide, so labels line up. */
export const TreeExpanderSlot: React.FC<TreeExpanderSlotProps> = ({ arm = false, active = false }) => (
  <StyledTreeExpanderSlot $arm={arm} $active={active} aria-hidden="true" />
)

export default TreeExpander
