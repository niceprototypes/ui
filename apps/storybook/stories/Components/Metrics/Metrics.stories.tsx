import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, within } from "storybook/test"
import { getToken as getNiceToken, setTokens } from "@niceprototypes/styles"
import Metrics from "@niceprototypes/metrics"
import type { MetricsProps } from "@niceprototypes/metrics"
import LifecycleStory from "@niceprototypes/docs/components/LifecycleStory"

/** The custom label width for the maxWidth story and lifecycle step. Metrics' maxWidth takes a CSS length, not a token. */
const getToken = setTokens({ length: { maxWidth: "12ch" } }, "metricsStory")
const CUSTOM_MAX_WIDTH = getToken("metricsStory.length:maxWidth")

/** The computed value of a CSS property set to `value`, read from a throwaway element inside `element` (font-relative units resolve against its font). */
const resolveCss = (element: HTMLElement, property: string, value: string) => {
  const probe = document.createElement("span")
  probe.style.setProperty(property, value)
  element.appendChild(probe)
  const resolved = getComputedStyle(probe).getPropertyValue(property)
  probe.remove()
  return resolved
}

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
    maxWidth: { control: "text", table: { category: "Layout" } },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const value = canvas.getByText(String(args.value))
    const label = canvas.getByText(String(args.label))
    // The label sits below the value, both centred.
    await expect(label.getBoundingClientRect().top).toBeGreaterThanOrEqual(value.getBoundingClientRect().bottom)
    await expect(getComputedStyle(value).textAlign).toBe("center")
    await expect(getComputedStyle(label).textAlign).toBe("center")
    // Without maxWidth, the label (only) takes the metrics.label.maxWidth token.
    if (args.maxWidth === undefined) {
      await expect(getComputedStyle(label).maxWidth).toBe(resolveCss(label, "max-width", getNiceToken("metrics.label.maxWidth")))
      await expect(getComputedStyle(value).maxWidth).toBe("none")
    }
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

/** `maxWidth` caps the label only; it defaults to the `metrics.label.maxWidth` token and a CSS length overrides it. The label stays centred. */
export const MaxWidth: Story = {
  ...Playground,
  args: { ...METRICS[0], maxWidth: CUSTOM_MAX_WIDTH },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const value = canvas.getByText(String(args.value))
    const label = canvas.getByText(String(args.label))
    await expect(getComputedStyle(label).maxWidth).toBe(resolveCss(label, "max-width", CUSTOM_MAX_WIDTH))
    await expect(getComputedStyle(label).maxWidth).not.toBe(resolveCss(label, "max-width", getNiceToken("metrics.label.maxWidth")))
    await expect(getComputedStyle(value).maxWidth).toBe("none")
    // Centred: equal space on both sides of the label within the column.
    const column = label.parentElement!.getBoundingClientRect()
    const box = label.getBoundingClientRect()
    await expect(Math.abs(box.left - column.left - (column.right - box.right))).toBeLessThan(1)
  },
}

/** Each sample metric in turn, as a page's metric blocks show them. */
export const Lifecycle: Story = {
  args: Playground.args,
  render: () => (
    <LifecycleStory
      steps={[
        ...METRICS.map(metric => ({ label: String(metric.value), props: metric })),
        { label: "maxWidth", props: { ...METRICS[0], maxWidth: CUSTOM_MAX_WIDTH } },
      ]}
      render={props => <Metrics {...props} />}
    />
  ),
}
