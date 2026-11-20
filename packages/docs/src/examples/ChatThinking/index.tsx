// ChatThinking example configs: its one prop, then the thinking dots in an exchange's lifecycle.
import Flex from "@niceprototypes/flex"
import { ChatLog, ChatThinking } from "@niceprototypes/chat"
import LifecycleStory, { type LifecycleStep } from "../../components/LifecycleStory"
import type { ComponentExample } from "../../dataTables/components/demos/Components"
import { ASK, STREAM, TURN_CODE, TurnMessage, chatColumn, chatWidth, type TurnType } from "../Chat/samples"

export const chatThinkingAriaLabel = {
  name: "aria-label",
  description: "Accessible name of the status region the three dots sit in. Defaults to \"Thinking\".",
  variants: ["Thinking", "Writing a reply"],
  default: "Thinking",
  preview: (variant: string) => (
    <div style={chatWidth}>
      <ChatThinking aria-label={variant} />
    </div>
  ),
  code: (variant: string) => (variant === "Thinking" ? "<ChatThinking />" : `<ChatThinking aria-label="${variant}" />`),
} satisfies ComponentExample

type ExchangeStepType = { turns: TurnType[]; thinking: boolean }

/** A scripted exchange: a question sent, the dots while the reply has not started, then the reply streaming in. */
const EXCHANGE: ReadonlyArray<LifecycleStep<ExchangeStepType>> = [
  { label: "empty", props: { turns: [], thinking: false } },
  { label: "thinking", props: { turns: [ASK], thinking: true }, duration: "long" },
  ...STREAM.slice(0, -1).map(text => ({
    label: "streaming",
    props: { turns: [ASK, { id: "a", role: "assistant" as const, text, status: "streaming" as const }], thinking: false },
  })),
  {
    label: "done",
    props: { turns: [ASK, { id: "a", role: "assistant", text: STREAM[STREAM.length - 1] }], thinking: false },
    duration: "long",
  },
]

export const chatThinkingLifecycle = {
  name: "lifecycle",
  description: "The pending assistant turn on a loop: a question sent, the thinking dots, then the reply replacing them as it streams.",
  variants: ["exchange"],
  default: "exchange",
  preview: () => (
    <LifecycleStory
      steps={EXCHANGE}
      render={({ turns, thinking }) => (
        <Flex direction="column" style={chatColumn}>
          <ChatLog aria-label="Conversation" streaming={thinking || turns.some(turn => turn.status === "streaming")}>
            {turns.map(turn => (
              <TurnMessage key={turn.id} {...turn} />
            ))}
            {thinking && <ChatThinking />}
          </ChatLog>
        </Flex>
      )}
    />
  ),
  code: () => `<ChatLog aria-label="Conversation" streaming={busy}>
  ${TURN_CODE.split("\n").join("\n  ")}
  {waiting && <ChatThinking />}
</ChatLog>`,
} satisfies ComponentExample

/** Every ChatThinking example facet, each one a section of the ChatThinking docs page. */
export const chatThinkingExamples = {
  "aria-label": chatThinkingAriaLabel,
  lifecycle: chatThinkingLifecycle,
} satisfies Record<string, ComponentExample>
