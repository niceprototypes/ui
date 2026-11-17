import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, within } from "storybook/test"
import Flex from "@niceprototypes/flex"
import { ChatLog, ChatThinking } from "@niceprototypes/chat"
import type { ChatThinkingProps } from "@niceprototypes/chat"
import LifecycleStory from "@niceprototypes/docs/components/LifecycleStory"
import { QUESTION, STREAM, TurnMessage, column, type Turn } from "./chatStory"

const meta = {
  title: "Components/Chat/ChatThinking",
  component: ChatThinking,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof ChatThinking>

export default meta

type Story = StoryObj<ChatThinkingProps>

export const Playground: Story = {
  args: {
    "aria-label": "Thinking",
  },
  argTypes: {
    "aria-label": { control: "text", table: { category: "Accessibility" } },
  },
  render: args => (
    <div style={{ width: column.width }}>
      <ChatThinking {...args} />
    </div>
  ),
  play: async ({ canvasElement, args }) => {
    const status = within(canvasElement).getByRole("status", { name: args["aria-label"] })
    await expect(status.children).toHaveLength(3)
    await expect(status).toHaveTextContent("")
  },
}

type ExchangeStep = { turns: Turn[]; thinking: boolean }

const ASK: Turn = { id: "q", role: "user", text: QUESTION }

/** A scripted exchange: a question sent, the dots while the reply has not started, then the reply streaming in. */
const EXCHANGE: { label: string; props: ExchangeStep; duration?: "base" | "long" }[] = [
  { label: "empty", props: { turns: [], thinking: false } },
  { label: "thinking", props: { turns: [ASK], thinking: true }, duration: "long" },
  ...STREAM.slice(0, -1).map((text, index) => ({
    label: `streaming ${index + 1}`,
    props: { turns: [ASK, { id: "a", role: "assistant" as const, text, status: "streaming" as const }], thinking: false },
  })),
  {
    label: "done",
    props: { turns: [ASK, { id: "a", role: "assistant", text: STREAM[STREAM.length - 1] }], thinking: false },
    duration: "long",
  },
]

/** The exchange on a loop: a user message, the thinking dots, then the reply replacing them as it streams. */
export const Lifecycle: Story = {
  args: { "aria-label": "Thinking" },
  render: args => (
    <LifecycleStory
      steps={EXCHANGE}
      render={({ turns, thinking }: ExchangeStep) => (
        <Flex
          direction="column"
          style={column}
        >
          <ChatLog
            aria-label="Conversation"
            streaming={thinking || turns.some(turn => turn.status === "streaming")}
          >
            {turns.map(turn => (
              <TurnMessage
                key={turn.id}
                {...turn}
              />
            ))}
            {thinking && <ChatThinking {...args} />}
          </ChatLog>
        </Flex>
      )}
    />
  ),
}
