import * as React from "react"
import { withBreakpoints, type WithBreakpointsProps } from "@niceprototypes/styles"
import BaseTabsSection from "./TabsSection"
import type { TabsSectionProps } from "./TabsSection.types"

// Explicit return-type annotation, as Tabs': keeps the `breakpoints` prop in the declaration emit.
const TabsSection: React.FC<WithBreakpointsProps<TabsSectionProps>> = withBreakpoints<TabsSectionProps>(BaseTabsSection)

export { TabsSection }
export * from "./TabsSection.types"
export { default as TabsSectionTypes } from "./TabsSection.types"
