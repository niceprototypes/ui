import * as React from "react"
import { withBreakpoints, type WithBreakpointsProps } from "@niceprototypes/styles"
import BaseMenu from "./Menu"
import type { MenuProps } from "./Menu.types"

// Explicit return-type annotation keeps the `breakpoints` prop in the emitted declarations.
const Menu: React.FC<WithBreakpointsProps<MenuProps>> = withBreakpoints<MenuProps>(BaseMenu)

export { Menu }
export * from "./Menu.types"
export { default as MenuTypes } from "./Menu.types"
