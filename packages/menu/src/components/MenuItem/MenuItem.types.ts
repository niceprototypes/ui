import * as React from "react"
import type { IconNameType } from "@niceprototypes/icon"

/**
 * MenuItemChildrenType
 *
 * The item's label. Its text is what typeahead matches.
 */
export type MenuItemChildrenType = React.ReactNode

/**
 * MenuItemIconType
 *
 * Re-export of IconNameType from @niceprototypes/icon. Icon shown before the label, decorative
 * (hidden from assistive technology); the label names the item.
 */
export type MenuItemIconType = IconNameType

/**
 * MenuItemDisabledType
 *
 * Shown, announced as disabled (`aria-disabled`), but not activated, focused or matched by
 * typeahead.
 */
export type MenuItemDisabledType = boolean

/**
 * MenuItemOnSelectEventType
 *
 * The click that activated the item: a pointer press, or the click Enter and Space dispatch.
 */
export type MenuItemOnSelectEventType = React.MouseEvent<HTMLDivElement>

/**
 * MenuItemOnSelectType
 *
 * Runs when the item is activated (click, Enter or Space). A transient menu then asks to close;
 * call `event.preventDefault()` to keep it open.
 */
export type MenuItemOnSelectType = (event: MenuItemOnSelectEventType) => void

/**
 * MenuItemProps
 *
 * Complete prop definition for the MenuItem component.
 */
export interface MenuItemProps {
  /** The item's label. */
  children?: MenuItemChildrenType
  /** Icon before the label. */
  icon?: MenuItemIconType
  /** Shown but not selectable; skipped by the keyboard. @default false */
  disabled?: MenuItemDisabledType
  /** Runs when the item is activated. */
  onSelect?: MenuItemOnSelectType
}

// Declaration merging: const + namespace creates an exportable type namespace.
const MenuItemTypes = {} as const

namespace MenuItemTypes {
  export type Children = MenuItemChildrenType
  export type Icon = MenuItemIconType
  export type Disabled = MenuItemDisabledType
  export type OnSelectEvent = MenuItemOnSelectEventType
  export type OnSelect = MenuItemOnSelectType
  export type Props = MenuItemProps
}

export default MenuItemTypes
