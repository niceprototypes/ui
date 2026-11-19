import * as React from "react"
import { withBreakpoints, type WithBreakpointsProps } from "@niceprototypes/styles"
import BaseMenuGroup from "./MenuGroup"
import type { MenuGroupProps } from "./MenuGroup.types"

// Explicit return-type annotation — without it, TS declaration emit can leave an unbound
// generic `<P>` in dist or collapse to `any`, erasing the `breakpoints` prop on consumers.
const MenuGroup: React.FC<WithBreakpointsProps<MenuGroupProps>> = withBreakpoints<MenuGroupProps>(BaseMenuGroup)

export { MenuGroup }
export * from "./MenuGroup.types"
export { default as MenuGroupTypes } from "./MenuGroup.types"
