import * as React from "react"
import Ink from "@niceprototypes/ink"
import { StyledMenuGroup, StyledMenuGroupLabel } from "./MenuGroup.styles"
import type { MenuGroupProps } from "./MenuGroup.types"
import { useMenuContext } from "../Menu/Menu.context"

/**
 * MenuGroup
 *
 * Related items under a heading, inside a Menu: `role="group"` named by its label. Keyboard
 * travel and typeahead pass over the label and run through the groups as one list.
 *
 * @example
 * ```tsx
 * <MenuGroup label="Sort by">
 *   <MenuItem onSelect={byName}>Name</MenuItem>
 *   <MenuItem onSelect={byDate}>Date</MenuItem>
 * </MenuGroup>
 * ```
 */
const MenuGroup: React.FC<MenuGroupProps> = ({ label, children }) => {
  const { size } = useMenuContext("MenuGroup")
  const labelId = React.useId()

  return (
    <StyledMenuGroup role="group" aria-labelledby={labelId}>
      <StyledMenuGroupLabel id={labelId}>
        <Ink size={size} weight="semibold">
          {label}
        </Ink>
      </StyledMenuGroupLabel>
      {children}
    </StyledMenuGroup>
  )
}

export default MenuGroup
