import * as React from "react"
import Icon from "@niceprototypes/icon"
import { StyledTreeExpander, StyledTreeExpanderCaret, StyledTreeExpanderSlot } from "./TreeExpander.styles"
import type { TreeExpanderProps } from "./TreeExpander.types"

/**
 * TreeExpander
 *
 * The circled caret that opens and closes a tree row (Tree's nav, DataTable's rows), drawn as a
 * node on the guide: placed right after the row's TreeGuide, it sits on the row's own junction,
 * the rail through it hidden, the arm leaving its right edge. A button with `aria-expanded` when
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

/** The expander's place in a row without one: no width, so labels line up in a row that spaces its items with a gap. */
export const TreeExpanderSlot: React.FC = () => <StyledTreeExpanderSlot aria-hidden="true" />

export default TreeExpander
