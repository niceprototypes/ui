import type * as React from "react"

/**
 * MetricsValueType
 *
 * The metric's value, rendered in a large Ink in the mono font: `"2.5 GB/s"`, `"90%"`.
 */
export type MetricsValueType = React.ReactNode

/**
 * MetricsLabelType
 *
 * What the value measures, rendered below it in a small Ink in the base font.
 */
export type MetricsLabelType = React.ReactNode

/**
 * MetricsMaxWidthType
 *
 * The label's maximum width, a CSS length (`"30ch"`, `"200px"`). Defaults to the
 * `metrics.label.maxWidth` component token (16ch).
 */
export type MetricsMaxWidthType = string

/**
 * MetricsProps
 *
 * Complete prop definition for the Metrics component: a value with its label below, centred.
 */
export interface MetricsProps {
  /** The metric's value */
  value: MetricsValueType
  /** What the value measures */
  label: MetricsLabelType
  /** The label's maximum width; defaults to the `metrics.label.maxWidth` token */
  maxWidth?: MetricsMaxWidthType
}

// Declaration merging: const + namespace creates exportable type namespace
const MetricsTypes = {} as const

namespace MetricsTypes {
  export type Value = MetricsValueType
  export type Label = MetricsLabelType
  export type MaxWidth = MetricsMaxWidthType
  export type Props = MetricsProps
}

export default MetricsTypes
