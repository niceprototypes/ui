import * as React from "react"

/**
 * MenuGroupLabelType
 *
 * The group's visible heading; it names the group (`aria-labelledby`). Keyboard travel never
 * lands on it.
 */
export type MenuGroupLabelType = React.ReactNode

/**
 * MenuGroupChildrenType
 *
 * The group's MenuItem elements.
 */
export type MenuGroupChildrenType = React.ReactNode

/**
 * MenuGroupProps
 *
 * Complete prop definition for the MenuGroup component.
 */
export interface MenuGroupProps {
  /** The group's heading. */
  label: MenuGroupLabelType
  /** The group's items. */
  children?: MenuGroupChildrenType
}

// Declaration merging: const + namespace creates an exportable type namespace.
const MenuGroupTypes = {} as const

namespace MenuGroupTypes {
  export type Label = MenuGroupLabelType
  export type Children = MenuGroupChildrenType
  export type Props = MenuGroupProps
}

export default MenuGroupTypes
