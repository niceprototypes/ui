import * as React from "react"
import { withBreakpoints, type WithBreakpointsProps } from "@niceprototypes/styles"
import BaseHeader from "./Header"
import type { HeaderProps } from "./Header.types"

// Explicit return-type annotation — without it, TS declaration emit can leave
// an unbound generic `<P>` in dist or collapse to `any`, erasing the
// `breakpoints` prop on consumers.
const Header: React.FC<WithBreakpointsProps<HeaderProps>> = withBreakpoints<HeaderProps>(BaseHeader)

export default Header
export * from "./Header.types"
export { default as HeaderTypes } from "./Header.types"
