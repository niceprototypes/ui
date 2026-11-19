/**
 * MenuSeparatorProps
 *
 * MenuSeparator takes no props: it is a rule between two runs of items.
 */
export interface MenuSeparatorProps {}

// Declaration merging: const + namespace creates an exportable type namespace.
const MenuSeparatorTypes = {} as const

namespace MenuSeparatorTypes {
  export type Props = MenuSeparatorProps
}

export default MenuSeparatorTypes
