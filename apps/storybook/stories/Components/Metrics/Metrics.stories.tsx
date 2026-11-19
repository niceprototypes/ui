import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, within } from "storybook/test"
import Metrics from "@niceprototypes/metrics"
import type { MetricsProps } from "@niceprototypes/metrics"
import LifecycleStory from "@niceprototypes/docs/components/LifecycleStory"

/** Sample metrics, each a value and its label. */
const METRICS: ReadonlyArray<MetricsProps> = [
  { value: "2.5 GB/s", label: "Decode throughput, measured natively" },
  { value: "~1 µs", label: "Per rank, range or quantile query" },
  { value: "90%", label: "Of channels answered exactly on ciphertext" },
  { value: "100%", label: "Lossless, bit for bit, every round-trip" },
]

const meta = {
  title: "Components/Metrics",
  component: Metrics,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Metrics>

export default meta

type Story = StoryObj<MetricsProps>

export const Playground: Story = {
  args: METRICS[0],
  argTypes: {
    value: { control: "text", table: { category: "Content" } },
    label: { control: "text", table: { category: "Content" } },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const value = canvas.getByText(String(args.value))
    const label = canvas.getByText(String(args.label))
    // The label sits below the value, both centred.
    await expect(label.getBoundingClientRect().top).toBeGreaterThanOrEqual(value.getBoundingClientRect().bottom)
    await expect(getComputedStyle(value).textAlign).toBe("center")
    await expect(getComputedStyle(label).textAlign).toBe("center")
  },
}

/** `value` renders larger than the label, in the mono font. */
export const Value: Story = {
  ...Playground,
  args: METRICS[2],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const value = getComputedStyle(canvas.getByText(String(args.value)))
    const label = getComputedStyle(canvas.getByText(String(args.label)))
    await expect(value.fontFamily).not.toBe(label.fontFamily)
    await expect(parseFloat(value.fontSize)).toBeGreaterThan(parseFloat(label.fontSize))
  },
}

/** `label` renders below the value. */
export const Label: Story = {
  ...Playground,
  args: METRICS[3],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText(String(args.label))).toBeInTheDocument()
  },
}

/** Each sample metric in turn, as a page's metric blocks show them. */
export const Lifecycle: Story = {
  args: Playground.args,
  render: () => (
    <LifecycleStory
      steps={METRICS.map(metric => ({ label: String(metric.value), props: metric }))}
      render={props => <Metrics {...props} />}
    />
  ),
}
