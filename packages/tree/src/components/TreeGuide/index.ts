import * as React from "react"
import { withBreakpoints, type WithBreakpointsProps } from "@niceprototypes/styles"
import BaseTreeGuide from "./TreeGuide"
import type { TreeGuideProps } from "./TreeGuide.types"

// Explicit return-type annotation keeps the `breakpoints` prop in the emitted declarations.
const TreeGuide: React.FC<WithBreakpointsProps<TreeGuideProps>> = withBreakpoints<TreeGuideProps>(BaseTreeGuide)

export { TreeGuide }
export * from "./TreeGuide.types"
export { default as TreeGuideTypes } from "./TreeGuide.types"
