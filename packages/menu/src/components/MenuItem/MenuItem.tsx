import * as React from "react"
import Icon from "@niceprototypes/icon"
import Ink from "@niceprototypes/ink"
import { StyledMenuItem, StyledMenuItemIcon, StyledMenuItemLabel } from "./MenuItem.styles"
import type { MenuItemProps } from "./MenuItem.types"
import { useMenuContext } from "../Menu/Menu.context"

/**
 * MenuItem
 *
 * One command in a Menu (`role="menuitem"`): an optional icon, then its label. Activated by a
 * click, or Enter or Space while focused; it then runs `onSelect` and, unless that called
 * `event.preventDefault()`, a transient menu asks to close. A mouse moving over an enabled item
 * focuses it. A disabled item is announced (`aria-disabled`) but never focused or activated.
 *
 * @example
 * ```tsx
 * <MenuItem icon="trash" onSelect={remove}>Delete</MenuItem>
 * ```
 */
const MenuItem: React.FC<MenuItemProps> = ({ children, icon, disabled = false, onSelect }) => {
  const { activeId, size, onItemSelect } = useMenuContext("MenuItem")
  const id = React.useId()

  return (
    <StyledMenuItem
      id={id}
      role="menuitem"
      tabIndex={activeId === id && !disabled ? 0 : -1}
      aria-disabled={disabled ? "true" : undefined}
      onClick={event => {
        if (disabled) return
        onSelect?.(event)
        if (!event.defaultPrevented) onItemSelect()
      }}
      onPointerMove={event => {
        if (event.pointerType === "mouse" && !disabled && document.activeElement !== event.currentTarget) {
          event.currentTarget.focus()
        }
      }}
      // A press on a disabled item leaves focus where it is.
      onMouseDown={event => {
        if (disabled) event.preventDefault()
      }}
    >
      {icon ? (
        <StyledMenuItemIcon aria-hidden="true">
          <Icon name={icon} size={size} color={disabled ? "disabled" : "base"} />
        </StyledMenuItemIcon>
      ) : null}
      <StyledMenuItemLabel>
        <Ink size={size}>{children}</Ink>
      </StyledMenuItemLabel>
    </StyledMenuItem>
  )
}

export default MenuItem
