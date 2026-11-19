import * as React from "react"
import { withBreakpoints, type WithBreakpointsProps } from "@niceprototypes/styles"
import BaseMenuItem from "./MenuItem"
import type { MenuItemProps } from "./MenuItem.types"

// Explicit return-type annotation — without it, TS declaration emit can leave an unbound
// generic `<P>` in dist or collapse to `any`, erasing the `breakpoints` prop on consumers.
const MenuItem: React.FC<WithBreakpointsProps<MenuItemProps>> = withBreakpoints<MenuItemProps>(BaseMenuItem)

export { MenuItem }
export * from "./MenuItem.types"
export { default as MenuItemTypes } from "./MenuItem.types"
