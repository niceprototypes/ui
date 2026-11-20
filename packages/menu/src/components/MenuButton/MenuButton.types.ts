import * as React from "react"
import type { SizeType, ThemeType } from "@niceprototypes/styles"
import type { IconNameType } from "@niceprototypes/icon"
import type { PopoverAlignType, PopoverPositionType } from "@niceprototypes/popover"
import type { ButtonGhostType, ButtonIconColorType } from "@niceprototypes/button"

/**
 * MenuButtonItemType
 *
 * One command in the menu.
 * - type: "item", or left out
 * - id: unique within the menu
 * - label: the item's text; typeahead matches it
 * - icon: icon before the label
 * - disabled: shown but not selectable, skipped by the keyboard
 * - onSelect: runs when the item is chosen, after the menu closed and focus returned to the trigger
 */
export type MenuButtonItemType = {
  type?: "item"
  id: string
  label: string
  icon?: IconNameType
  disabled?: boolean
  onSelect: () => void
}

/**
 * MenuButtonSeparatorType
 *
 * A rule between two runs of items.
 * - type: "separator"
 * - id: unique within the menu
 */
export type MenuButtonSeparatorType = {
  type: "separator"
  id: string
}

/**
 * MenuButtonGroupType
 *
 * Items under a heading that names them.
 * - type: "group"
 * - id: unique within the menu
 * - label: the heading
 * - items: the group's items
 */
export type MenuButtonGroupType = {
  type: "group"
  id: string
  label: string
  items: ReadonlyArray<MenuButtonItemType>
}

/**
 * MenuButtonEntryType
 *
 * One entry of `items`: an item, a separator or a group, told apart by `type`.
 */
export type MenuButtonEntryType = MenuButtonItemType | MenuButtonSeparatorType | MenuButtonGroupType

/**
 * MenuButtonItemsType
 *
 * The menu's entries, in order.
 */
export type MenuButtonItemsType = ReadonlyArray<MenuButtonEntryType>

/**
 * MenuButtonLabelType
 *
 * The trigger's visible text. Without it, the trigger is icon-only and needs `aria-label`.
 */
export type MenuButtonLabelType = string

/**
 * MenuButtonAriaLabelType
 *
 * Accessible name of the trigger and the menu. Required when there is no `label`; with one, it
 * should start with the label's words, so voice control finds it.
 */
export type MenuButtonAriaLabelType = string

/**
 * MenuButtonNameType
 *
 * The trigger needs a name: a `label`, an `aria-label`, or both.
 */
export type MenuButtonNameType = { label: MenuButtonLabelType } | { "aria-label": MenuButtonAriaLabelType }

/**
 * MenuButtonIconType
 *
 * Re-export of IconNameType from @niceprototypes/icon. Icon before the trigger's text. Defaults to
 * "menu" (two lines) when there is no `label`.
 */
export type MenuButtonIconType = IconNameType

/**
 * MenuButtonAppearanceType
 *
 * How the trigger looks.
 *
 * Values:
 * - "button": a Button with the label and icon (default)
 * - "select": a select field's look, for a menu chosen like a value: the label (or placeholder) at
 *   the start, the caret at the end
 */
export type MenuButtonAppearanceType = "button" | "select"

/**
 * MenuButtonPlaceholderType
 *
 * Text the "select" trigger shows, in the placeholder colour, while there is no `label`.
 */
export type MenuButtonPlaceholderType = string

/**
 * MenuButtonGhostType
 *
 * Re-export of ButtonGhostType from @niceprototypes/button. Transparent trigger background and
 * border: `true` at rest only, or per interaction state (`{ rest, hover, focus, active }`), e.g.
 * all four for an icon trigger that never shows a box. A select-look trigger that is not ghosted
 * shows the `menu.trigger.borderColor` border, which follows the Checkbox's unchecked border.
 */
export type MenuButtonGhostType = ButtonGhostType

/**
 * MenuButtonIconColorType
 *
 * Re-export of ButtonIconColorType from @niceprototypes/button. Colour of the trigger's icons: one
 * colour token, or one per interaction state.
 */
export type MenuButtonIconColorType = ButtonIconColorType

/**
 * MenuButtonSizeType
 *
 * Re-export of SizeType from @niceprototypes/styles. Size of the trigger (Button's `size`).
 *
 * Values:
 * - "smaller", "small", "base", "large", "larger"
 */
export type MenuButtonSizeType = SizeType

/**
 * MenuButtonDisabledType
 *
 * Whether the trigger is disabled; the menu cannot open.
 */
export type MenuButtonDisabledType = boolean

/**
 * MenuButtonOpenType
 *
 * Whether the menu is open. Set it to control the menu; leave it out to let the MenuButton keep
 * its own state.
 */
export type MenuButtonOpenType = boolean

/**
 * MenuButtonOnOpenChangeType
 *
 * Called with the open state the MenuButton asks for: true on a trigger press, Enter, Space,
 * ArrowDown or ArrowUp; false on a choice, Escape, Tab, a press outside or a second trigger press.
 */
export type MenuButtonOnOpenChangeType = (open: boolean) => void

/**
 * MenuButtonPositionType
 *
 * Re-export of PopoverPositionType from @niceprototypes/popover. Side of the trigger the menu
 * opens on; it flips to the other side when this one has no room.
 */
export type MenuButtonPositionType = PopoverPositionType

/**
 * MenuButtonAlignType
 *
 * Re-export of PopoverAlignType from @niceprototypes/popover. Alignment of the menu along the
 * trigger; it shifts to stay inside the viewport.
 */
export type MenuButtonAlignType = PopoverAlignType

/**
 * MenuButtonRefType
 *
 * Ref to the trigger `<button>` (React 19 ref-as-prop).
 */
export type MenuButtonRefType = React.Ref<HTMLButtonElement>

/**
 * MenuButtonThemeType
 *
 * Re-export of ThemeType from @niceprototypes/styles.
 * Pin token resolution to a specific theme.
 * Extensible for consumer-defined custom themes.
 */
export type MenuButtonThemeType = ThemeType

/**
 * MenuButtonProps
 *
 * Complete prop definition for the MenuButton component. A trigger needs a `label` or an
 * `aria-label` (MenuButtonNameType).
 */
export type MenuButtonProps = {
  /** The menu's items, separators and groups. */
  items: MenuButtonItemsType
  /** The trigger's visible text. */
  label?: MenuButtonLabelType
  /** Accessible name of the trigger and menu; required without `label`. */
  "aria-label"?: MenuButtonAriaLabelType
  /** Icon before the trigger's text. @default "menu" without a label */
  icon?: MenuButtonIconType
  /** Trigger look. @default "button" */
  appearance?: MenuButtonAppearanceType
  /** The "select" trigger's text while there is no label. */
  placeholder?: MenuButtonPlaceholderType
  /** Transparent trigger: at rest, or per interaction state. @default false */
  ghost?: MenuButtonGhostType
  /** Colour of the trigger's icons, or one per interaction state. */
  iconColor?: MenuButtonIconColorType
  /** Trigger size. @default "base" */
  size?: MenuButtonSizeType
  /** Disable the trigger. @default false */
  disabled?: MenuButtonDisabledType
  /** Whether the menu is open (controlled). */
  open?: MenuButtonOpenType
  /** Called with the open state the MenuButton asks for. */
  onOpenChange?: MenuButtonOnOpenChangeType
  /** Side of the trigger the menu opens on. @default "bottom" */
  position?: MenuButtonPositionType
  /** Alignment of the menu along the trigger. @default "start" */
  align?: MenuButtonAlignType
  /** Ref to the trigger. */
  ref?: MenuButtonRefType
  /** Pin token resolution to a specific theme instead of responding to media query. */
  theme?: MenuButtonThemeType
} & MenuButtonNameType

// Declaration merging: const + namespace creates an exportable type namespace.
const MenuButtonTypes = {} as const

namespace MenuButtonTypes {
  export type Item = MenuButtonItemType
  export type Separator = MenuButtonSeparatorType
  export type Group = MenuButtonGroupType
  export type Entry = MenuButtonEntryType
  export type Items = MenuButtonItemsType
  export type Label = MenuButtonLabelType
  export type AriaLabel = MenuButtonAriaLabelType
  export type Name = MenuButtonNameType
  export type Icon = MenuButtonIconType
  export type Appearance = MenuButtonAppearanceType
  export type Placeholder = MenuButtonPlaceholderType
  export type Ghost = MenuButtonGhostType
  export type IconColor = MenuButtonIconColorType
  export type Size = MenuButtonSizeType
  export type Disabled = MenuButtonDisabledType
  export type Open = MenuButtonOpenType
  export type OnOpenChange = MenuButtonOnOpenChangeType
  export type Position = MenuButtonPositionType
  export type Align = MenuButtonAlignType
  export type Ref = MenuButtonRefType
  export type Theme = MenuButtonThemeType
  export type Props = MenuButtonProps
}

export default MenuButtonTypes
