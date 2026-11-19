import * as React from "react"
import { withBreakpoints, type WithBreakpointsProps } from "@niceprototypes/styles"
import BaseBadge from "./Badge"
import type { BadgeProps } from "./Badge.types"

// Explicit return-type annotation keeps the `breakpoints` prop in the emitted declarations.
const Badge: React.FC<WithBreakpointsProps<BadgeProps>> = withBreakpoints<BadgeProps>(BaseBadge)

export default Badge
export * from "./Badge.types"
export { default as BadgeTypes } from "./Badge.types"
