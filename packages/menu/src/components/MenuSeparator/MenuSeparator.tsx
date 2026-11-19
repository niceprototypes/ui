import * as React from "react"
import { StyledMenuSeparator } from "./MenuSeparator.styles"
import type { MenuSeparatorProps } from "./MenuSeparator.types"

/**
 * MenuSeparator
 *
 * A rule between two runs of items in a Menu (`role="separator"`). Not focusable; keyboard
 * travel passes over it.
 *
 * @example
 * ```tsx
 * <MenuItem onSelect={copy}>Copy</MenuItem>
 * <MenuSeparator />
 * <MenuItem onSelect={remove}>Delete</MenuItem>
 * ```
 */
const MenuSeparator: React.FC<MenuSeparatorProps> = () => <StyledMenuSeparator role="separator" />

export default MenuSeparator
