import * as React from "react"
import { withBreakpoints, type WithBreakpointsProps } from "@niceprototypes/styles"
import BaseMetrics from "./Metrics"
import type { MetricsProps } from "./Metrics.types"

// Explicit return-type annotation — without it, TS declaration emit can leave
// an unbound generic `<P>` in dist or collapse to `any`, erasing the
// `breakpoints` prop on consumers.
const Metrics: React.FC<WithBreakpointsProps<MetricsProps>> = withBreakpoints<MetricsProps>(BaseMetrics)

export default Metrics
export * from "./Metrics.types"
export { default as MetricsTypes } from "./Metrics.types"
