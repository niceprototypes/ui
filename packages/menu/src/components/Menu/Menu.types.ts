import * as React from "react"
import type { SizeType, ThemeType } from "@niceprototypes/styles"

/**
 * MenuChildrenType
 *
 * The menu's content: MenuItem, MenuGroup and MenuSeparator elements, in order.
 */
export type MenuChildrenType = React.ReactNode

/**
 * MenuAutoFocusType
 *
 * Which item takes focus when the menu mounts. Disabled items are passed over.
 *
 * Values:
 * - "first": the first enabled item (a menu button opened by click, Enter, Space or ArrowDown)
 * - "last": the last enabled item (a menu button opened by ArrowUp)
 */
export type MenuAutoFocusType = "first" | "last"

/**
 * MenuCloseReasonType
 *
 * Why a transient menu asks to close.
 *
 * Values:
 * - "select": an item was activated (click, Enter or Space) and its onSelect did not call `event.preventDefault()`
 * - "escape": Escape was pressed inside the menu
 * - "tab": Tab or Shift+Tab was pressed inside the menu
 */
export type MenuCloseReasonType = "select" | "escape" | "tab"

/**
 * MenuOnCloseType
 *
 * Makes the menu transient (a menu button's popup, a context menu) and is called with the reason
 * it asks to close. With it, Escape and Tab are held by the menu (their default action and
 * propagation stop) and reported; without it, Tab moves focus out as on any page.
 */
export type MenuOnCloseType = (reason: MenuCloseReasonType) => void

/**
 * MenuSizeType
 *
 * Re-export of SizeType from @niceprototypes/styles. Text size of the item and group labels (Ink),
 * and of the item icons.
 *
 * Values:
 * - "smaller", "small", "base", "large", "larger"
 */
export type MenuSizeType = SizeType

/**
 * MenuIdType
 *
 * Id of the menu element (e.g. for a trigger's `aria-controls`).
 */
export type MenuIdType = string

/**
 * MenuAriaLabelType
 *
 * Accessible name of the menu. A menu needs this or `aria-labelledby`.
 */
export type MenuAriaLabelType = string

/**
 * MenuAriaLabelledByType
 *
 * Id of the element that names the menu (a menu button's trigger).
 */
export type MenuAriaLabelledByType = string

/**
 * MenuRefType
 *
 * Ref to the rendered `role="menu"` element (React 19 ref-as-prop).
 */
export type MenuRefType = React.Ref<HTMLDivElement>

/**
 * MenuThemeType
 *
 * Re-export of ThemeType from @niceprototypes/styles.
 * Pin token resolution to a specific theme.
 * Extensible for consumer-defined custom themes.
 */
export type MenuThemeType = ThemeType

/**
 * MenuProps
 *
 * Complete prop definition for the Menu component.
 */
export interface MenuProps {
  /** MenuItem, MenuGroup and MenuSeparator elements. */
  children?: MenuChildrenType
  /** Item focused on mount. Unset focuses nothing. */
  autoFocus?: MenuAutoFocusType
  /** Makes the menu transient: called with "select", "escape" or "tab" when it asks to close. */
  onClose?: MenuOnCloseType
  /** Text size of the labels and icons. @default "base" */
  size?: MenuSizeType
  /** Id of the menu element. */
  id?: MenuIdType
  /** Accessible name of the menu. */
  "aria-label"?: MenuAriaLabelType
  /** Id of the element that names the menu. */
  "aria-labelledby"?: MenuAriaLabelledByType
  /** Ref to the menu element. */
  ref?: MenuRefType
  /** Pin token resolution to a specific theme instead of responding to media query. */
  theme?: MenuThemeType
}

// Declaration merging: const + namespace creates an exportable type namespace.
const MenuTypes = {} as const

namespace MenuTypes {
  export type Children = MenuChildrenType
  export type AutoFocus = MenuAutoFocusType
  export type CloseReason = MenuCloseReasonType
  export type OnClose = MenuOnCloseType
  export type Size = MenuSizeType
  export type Id = MenuIdType
  export type AriaLabel = MenuAriaLabelType
  export type AriaLabelledBy = MenuAriaLabelledByType
  export type Ref = MenuRefType
  export type Theme = MenuThemeType
  export type Props = MenuProps
}

export default MenuTypes
