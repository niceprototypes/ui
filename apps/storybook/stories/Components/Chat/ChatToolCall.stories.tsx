import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, fn, userEvent, within } from "storybook/test"
import { ChatToolCall } from "@niceprototypes/chat"
import type { ChatToolCallProps, ChatToolCallStatusType } from "@niceprototypes/chat"
import LifecycleStory from "@niceprototypes/docs/components/LifecycleStory"
import { column } from "./chatStory"

const STATUS_OPTIONS = ["pending", "running", "done", "denied", "failed"] as const satisfies readonly ChatToolCallStatusType[]

/** `children` presets; "none" maps to undefined. */
const CHILDREN_OPTIONS = { asset: "nice/chat@1.0.0, into a new story", none: undefined }

/** `outcome` presets; "none" maps to undefined. */
const OUTCOME_OPTIONS = { none: undefined, error: "Asset nice/chat@9.9.9 not found" }

const meta = {
  title: "Components/Chat/ChatToolCall",
  component: ChatToolCall,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof ChatToolCall>

export default meta

type Story = StoryObj<ChatToolCallProps>

export const Playground: Story = {
  args: {
    title: "Install asset",
    children: CHILDREN_OPTIONS.asset,
    status: "pending",
    outcome: OUTCOME_OPTIONS.none,
    onApprove: fn(),
    onDeny: fn(),
  },
  argTypes: {
    title: { control: "text", table: { category: "Content" } },
    children: {
      control: "select",
      options: Object.keys(CHILDREN_OPTIONS),
      mapping: CHILDREN_OPTIONS,
      table: { category: "Content" },
    },
    status: { control: "select", options: STATUS_OPTIONS, table: { category: "State" } },
    outcome: {
      control: "select",
      options: Object.keys(OUTCOME_OPTIONS),
      mapping: OUTCOME_OPTIONS,
      table: { category: "Content" },
    },
    onApprove: { table: { category: "Events" } },
    onDeny: { table: { category: "Events" } },
  },
  render: args => (
    <div style={{ width: column.width }}>
      <ChatToolCall {...args} />
    </div>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole("group", { name: "Install asset" })).toBeInTheDocument()
    await userEvent.click(canvas.getByRole("button", { name: "Approve" }))
    await expect(args.onApprove).toHaveBeenCalledTimes(1)
    await userEvent.click(canvas.getByRole("button", { name: "Deny" }))
    await expect(args.onDeny).toHaveBeenCalledTimes(1)
  },
}

/** `status="failed"` with an `outcome`: the status line in the error colour, no actions. */
export const Failed: Story = {
  ...Playground,
  args: { ...Playground.args, status: "failed", outcome: OUTCOME_OPTIONS.error },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole("status")).toHaveTextContent(`Failed: ${OUTCOME_OPTIONS.error}`)
    await expect(canvas.queryByRole("button", { name: "Approve" })).not.toBeInTheDocument()
    await expect(canvas.queryByRole("button", { name: "Deny" })).not.toBeInTheDocument()
  },
}

type CallStep = { status: ChatToolCallStatusType }

/** A call approved and run, then a call denied. */
const CALLS: { label: string; props: CallStep; duration?: "base" | "long" }[] = [
  { label: "pending", props: { status: "pending" }, duration: "long" },
  { label: "approved: running", props: { status: "running" } },
  { label: "done", props: { status: "done" }, duration: "long" },
  { label: "pending again", props: { status: "pending" }, duration: "long" },
  { label: "denied", props: { status: "denied" }, duration: "long" },
]

/** The call on a loop: pending, approved and running, done; then pending and denied. */
export const Lifecycle: Story = {
  args: { title: "Install asset" },
  render: args => (
    <LifecycleStory
      steps={CALLS}
      render={({ status }: CallStep) => (
        <div style={{ width: column.width }}>
          <ChatToolCall
            title={args.title}
            status={status}
          >
            {CHILDREN_OPTIONS.asset}
          </ChatToolCall>
        </div>
      )}
    />
  ),
}
