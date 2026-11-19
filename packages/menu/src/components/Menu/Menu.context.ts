import * as React from "react"
import type { MenuSizeType } from "./Menu.types"

/** What a Menu shares with its items and groups. */
export type MenuContextType = {
  /** Id of the item in the tab order (roving tabindex); null before any item has had focus */
  activeId: string | null
  /** Text size of the labels and icons */
  size: MenuSizeType
  /** Called after an item's onSelect ran without `event.preventDefault()` */
  onItemSelect: () => void
}

/** Null outside a Menu: MenuItem, MenuGroup and MenuSeparator render only inside one. */
export const MenuContext = React.createContext<MenuContextType | null>(null)

/**
 * The enclosing Menu's context.
 *
 * @param component - Name of the calling component, for the error
 * @returns The context
 */
export function useMenuContext(component: string): MenuContextType {
  const context = React.useContext(MenuContext)
  if (!context) throw new Error(`${component} must be rendered inside a Menu`)
  return context
}
