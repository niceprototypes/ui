// Metrics example configs: one ComponentExample per facet. ComponentDocs renders each entry as a
// section of the Metrics docs page, sorted by name.
import Metrics, { type MetricsProps } from "@niceprototypes/metrics"
import { Grid } from "@niceprototypes/grid"
import { setTokens } from "@niceprototypes/styles"
import type { ComponentExample } from "../../dataTables/components/demos/Components"

/** The label widths of the maxWidth examples (Metrics' maxWidth takes a CSS length). */
const getToken = setTokens({ length: { narrow: "12ch", wide: "40ch" } }, "metricsExamples")

/** fastcodec's four metrics. */
const METRICS: ReadonlyArray<MetricsProps> = [
  { value: "2.5 GB/s", label: "Decode throughput, measured natively" },
  { value: "~1 µs", label: "Per rank, range or quantile query" },
  { value: "90%", label: "Of channels answered exactly on ciphertext" },
  { value: "100%", label: "Lossless, bit for bit, every round-trip" },
]

const LABEL = "Of channels answered exactly on ciphertext, without decrypting"

export const metricsValue = {
  name: "value",
  description: "The metric's value, in a large Ink in the mono font: a rate, a duration, a share.",
  variants: METRICS.map(metric => String(metric.value)),
  default: "2.5 GB/s",
  preview: (variant: string) => <Metrics {...METRICS.find(metric => metric.value === variant)!} />,
  code: (variant: string) => {
    const metric = METRICS.find(item => item.value === variant)!
    return `<Metrics value="${metric.value}" label="${metric.label}" />`
  },
} satisfies ComponentExample

export const metricsLabel = {
  name: "label",
  description: "What the value measures, below it in a small Ink in the base font. It wraps at maxWidth.",
  variants: ["short", "long"],
  default: "short",
  preview: (variant: string) => <Metrics value="90%" label={variant === "short" ? "Exact answers" : LABEL} />,
  code: (variant: string) => `<Metrics value="90%" label="${variant === "short" ? "Exact answers" : LABEL}" />`,
} satisfies ComponentExample

/** maxWidth per variant: unset (the metrics.label.maxWidth token, 16ch) or a project length token. */
const WIDTHS: Record<string, string | undefined> = {
  "metrics.label.maxWidth token": undefined,
  "12ch": getToken("metricsExamples.length:narrow"),
  "40ch": getToken("metricsExamples.length:wide"),
}

export const metricsMaxWidth = {
  name: "maxWidth",
  description: "The label's maximum width, a CSS length; unset, the metrics.label.maxWidth token (16ch). Set it from a project token, not an inline literal.",
  variants: Object.keys(WIDTHS),
  default: "metrics.label.maxWidth token",
  preview: (variant: string) => <Metrics value="90%" label={LABEL} maxWidth={WIDTHS[variant]} />,
  code: (variant: string) =>
    WIDTHS[variant] === undefined
      ? `<Metrics value="90%" label="${LABEL}" />`
      : `const getToken = setTokens({ length: { labelWidth: "${variant}" } }, "project")\n\n<Metrics\n  value="90%"\n  label="${LABEL}"\n  maxWidth={getToken("project.length:labelWidth")}\n/>`,
} satisfies ComponentExample

export const metricsGrid = {
  name: "in a Grid",
  description: "Several metrics side by side, each centred in its cell: fastcodec's four, in two columns and in four.",
  variants: ["2 columns", "4 columns"],
  default: "2 columns",
  preview: (variant: string) => (
    <Grid columns={variant === "2 columns" ? 2 : 4} padding="large">
      {METRICS.map(metric => (
        <Metrics key={String(metric.value)} {...metric} />
      ))}
    </Grid>
  ),
  code: (variant: string) =>
    `<Grid columns={${variant === "2 columns" ? 2 : 4}} padding="large">\n${METRICS.map(metric => `  <Metrics value="${metric.value}" label="${metric.label}" />`).join("\n")}\n</Grid>`,
} satisfies ComponentExample

/** Every Metrics example facet: each one a section of the Metrics docs page. */
export const metricsExamples = {
  value: metricsValue,
  label: metricsLabel,
  maxWidth: metricsMaxWidth,
  grid: metricsGrid,
} satisfies Record<string, ComponentExample>
