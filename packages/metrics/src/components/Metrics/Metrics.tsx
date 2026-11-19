import * as React from "react"
import Flex from "@niceprototypes/flex"
import Ink from "@niceprototypes/ink"
import type { MetricsProps } from "./Metrics.types"

/**
 * Metrics
 *
 * A metric: the value in a large mono Ink, the label below it in a small base-font Ink, both centred.
 *
 * @example
 * ```tsx
 * <Metrics value="2.5 GB/s" label="Decode throughput, measured natively" />
 * ```
 */
const Metrics: React.FC<MetricsProps> = ({ value, label }) => (
  <Flex direction="column" gap="smaller">
    <Ink code size="large" align="center">
      {value}
    </Ink>
    <Ink size="small" align="center">
      {label}
    </Ink>
  </Flex>
)

export default Metrics
