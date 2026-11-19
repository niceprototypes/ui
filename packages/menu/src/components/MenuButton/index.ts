import * as React from "react"
import { withBreakpoints, type WithBreakpointsProps } from "@niceprototypes/styles"
import BaseMenuButton from "./MenuButton"
import type { MenuButtonProps } from "./MenuButton.types"

// Explicit return-type annotation — without it, TS declaration emit can leave an unbound
// generic `<P>` in dist or collapse to `any`, erasing the `breakpoints` prop on consumers.
const MenuButton: React.FC<WithBreakpointsProps<MenuButtonProps>> = withBreakpoints<MenuButtonProps>(BaseMenuButton)

export { MenuButton }
export * from "./MenuButton.types"
export { default as MenuButtonTypes } from "./MenuButton.types"
