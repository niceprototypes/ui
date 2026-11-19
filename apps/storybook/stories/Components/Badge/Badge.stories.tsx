import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, within } from "storybook/test"
import { getToken } from "@niceprototypes/styles"
import Badge from "@niceprototypes/badge"
import type { BadgeProps, BadgeStatusType } from "@niceprototypes/badge"
import LifecycleStory from "@niceprototypes/docs/components/LifecycleStory"

const STATUS_OPTIONS = ["base", "success", "warning", "error"] as const satisfies readonly BadgeStatusType[]

/** The computed value of a CSS property set to `value`, read from a throwaway element. */
const resolveCss = (element: HTMLElement, property: string, value: string) => {
  const probe = document.createElement("span")
  probe.style.setProperty(property, value)
  element.appendChild(probe)
  const resolved = getComputedStyle(probe).getPropertyValue(property)
  probe.remove()
  return resolved
}

const meta = {
  title: "Components/Badge",
  component: Badge,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Badge>

export default meta

type Story = StoryObj<BadgeProps>

export const Playground: Story = {
  args: {
    label: "Running",
    status: "success",
  },
  argTypes: {
    label: { control: "text", table: { category: "Content" } },
    status: { control: "select", options: STATUS_OPTIONS, table: { category: "Status" } },
  },
  play: async ({ canvasElement, args }) => {
    const badge = within(canvasElement).getByText(String(args.label))
    const status = args.status ?? "base"
    // Tint, text and dot come from the status tokens.
    await expect(getComputedStyle(badge).backgroundColor).toBe(
      resolveCss(canvasElement, "background-color", getToken(`badge.backgroundColor:${status}`)),
    )
    await expect(getComputedStyle(badge).color).toBe(resolveCss(canvasElement, "color", getToken(`badge.color:${status}`)))
    await expect(getComputedStyle(badge, "::before").backgroundColor).toBe(
      resolveCss(canvasElement, "background-color", getToken(`badge.dot.color:${status}`)),
    )
  },
}

/** `status="base"`: neutral, for inactive or stopped. */
export const Base: Story = { ...Playground, args: { label: "Stopped", status: "base" } }

/** `status="warning"`: needs attention. */
export const Warning: Story = { ...Playground, args: { label: "Held by another project", status: "warning" } }

/** `status="error"`: failed. */
export const ErrorStatus: Story = { ...Playground, args: { label: "Failed", status: "error" } }

/** Lifecycle: a process going through each status. */
export const Lifecycle: Story = {
  args: Playground.args,
  render: () => (
    <LifecycleStory
      steps={[
        { label: "base", props: { label: "Stopped", status: "base" as const } },
        { label: "success", props: { label: "Running", status: "success" as const } },
        { label: "warning", props: { label: "Held by another project", status: "warning" as const } },
        { label: "error", props: { label: "Failed", status: "error" as const } },
      ]}
      render={props => <Badge {...props} />}
    />
  ),
}
