import * as React from "react"
import Flex from "@niceprototypes/flex"
import Ink from "@niceprototypes/ink"
import { getToken } from "@niceprototypes/styles"
import { Label } from "./Metrics.styles"
import type { MetricsProps } from "./Metrics.types"

/**
 * Metrics
 *
 * A metric: the value in a large mono Ink, the label below it in a small base-font Ink, both centred.
 * The label is at most `maxWidth` wide (the `metrics.label.maxWidth` token by default).
 *
 * @example
 * ```tsx
 * <Metrics value="2.5 GB/s" label="Decode throughput, measured natively" />
 * ```
 */
const Metrics: React.FC<MetricsProps> = ({ value, label, maxWidth = getToken("metrics.label.maxWidth") }) => (
  <Flex direction="column" gap="smaller">
    <Ink code size="large" align="center">
      {value}
    </Ink>
    <Label size="small" align="center" $maxWidth={maxWidth}>
      {label}
    </Label>
  </Flex>
)

export default Metrics
