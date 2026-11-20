// ChatLog example configs: one ComponentExample per facet, keyed by prop name, plus the exchange's
// lifecycle. Every preview is a live log: scroll up and the end button appears.
import { useState } from "react"
import Button from "@niceprototypes/button"
import Flex from "@niceprototypes/flex"
import { ChatComposer, ChatLog } from "@niceprototypes/chat"
import LifecycleStory, { type LifecycleStep } from "../../components/LifecycleStory"
import type { ComponentExample } from "../../dataTables/components/demos/Components"
import { ASK, CONVERSATION, QUESTION, STREAM, TURN_CODE, TurnMessage, chatColumn, type TurnType } from "../Chat/samples"

/** The `children` variants: the turns each log holds. */
const CHILDREN: Record<string, TurnType[]> = {
  conversation: CONVERSATION,
  one: CONVERSATION.slice(0, 1),
  empty: [],
}

/** A log of the given turns in the chat column. */
const DemoLog = ({ turns, streaming, label = "Conversation" }: { turns: TurnType[]; streaming?: boolean; label?: string }) => (
  <Flex direction="column" style={chatColumn}>
    <ChatLog aria-label={label} streaming={streaming}>
      {turns.map(turn => (
        <TurnMessage key={turn.id} {...turn} />
      ))}
    </ChatLog>
  </Flex>
)

/** A log that gains a turn on each press: it follows new messages while at the end. */
const GrowingLog = () => {
  const [turns, setTurns] = useState<TurnType[]>(CONVERSATION.slice(0, 2))
  const add = () =>
    setTurns(current => [...current, { ...CONVERSATION[current.length % CONVERSATION.length], id: `t${current.length}` }])
  return (
    <Flex direction="column" gap="small">
      <Button size="small" onClick={add}>
        Add a message
      </Button>
      <DemoLog turns={turns} />
    </Flex>
  )
}

const logCode = (props: string) => `<ChatLog aria-label="Conversation"${props}>
  ${TURN_CODE.split("\n").join("\n  ")}
</ChatLog>`

export const chatLogChildren = {
  name: "children",
  description:
    "The messages. The log opens at its end and follows new messages while the reader is there; scrolled up, it stays put and shows a button back to the latest.",
  variants: Object.keys(CHILDREN),
  default: "conversation",
  preview: (variant: string) => <DemoLog turns={CHILDREN[variant]} />,
  code: () => logCode(""),
} satisfies ComponentExample

export const chatLogStreaming = {
  name: "streaming",
  description: "A reply is streaming in: sets aria-busy on the log, so assistive technology waits for the reply to settle.",
  variants: ["false", "true"],
  default: "false",
  preview: (variant: string) => <DemoLog turns={CONVERSATION.slice(0, 2)} streaming={variant === "true"} />,
  code: (variant: string) => logCode(variant === "true" ? " streaming" : ""),
} satisfies ComponentExample

export const chatLogAriaLabel = {
  name: "aria-label",
  description: "Accessible name of the log (role log).",
  variants: ["Conversation"],
  default: "Conversation",
  preview: (variant: string) => <DemoLog turns={CONVERSATION.slice(0, 2)} label={variant} />,
  code: (variant: string) => `<ChatLog aria-label="${variant}">…</ChatLog>`,
} satisfies ComponentExample

export const chatLogFollow = {
  name: "following new messages",
  description: "Each press adds a message: at the end, the log scrolls to it; scrolled up, it stays and the end button appears.",
  variants: ["growing"],
  default: "growing",
  preview: () => <GrowingLog />,
  code: () => logCode(""),
} satisfies ComponentExample

type ExchangeStepType = { draft: string; turns: TurnType[]; busy: boolean }

/** A scripted exchange: a question typed and sent, the reply streaming in, then its actions. */
const EXCHANGE: ReadonlyArray<LifecycleStep<ExchangeStepType>> = [
  { label: "empty", props: { draft: "", turns: [], busy: false } },
  { label: "typed", props: { draft: QUESTION, turns: [], busy: false } },
  { label: "sent", props: { draft: "", turns: [ASK], busy: true } },
  ...STREAM.slice(0, -1).map(text => ({
    label: "streaming",
    props: { draft: "", turns: [ASK, { id: "a", role: "assistant" as const, text, status: "streaming" as const }], busy: true },
  })),
  {
    label: "actions",
    props: { draft: "", turns: [ASK, { id: "a", role: "assistant", text: STREAM[STREAM.length - 1] }], busy: false },
    duration: "long",
  },
]

const noop = () => {}

export const chatLogLifecycle = {
  name: "lifecycle",
  description: "The exchange on a loop: a question typed and sent, the assistant reply streaming in, then its actions appearing.",
  variants: ["exchange"],
  default: "exchange",
  preview: () => (
    <LifecycleStory
      steps={EXCHANGE}
      render={({ draft, turns, busy }) => (
        <Flex direction="column" gap="base" style={chatColumn}>
          <ChatLog aria-label="Conversation" streaming={busy}>
            {turns.map(turn => (
              <TurnMessage key={turn.id} {...turn} />
            ))}
          </ChatLog>
          <ChatComposer value={draft} onChange={noop} onSubmit={noop} onStop={noop} busy={busy} placeholder="Ask about this scene" />
        </Flex>
      )}
    />
  ),
  code: () => `<ChatLog aria-label="Conversation" streaming={busy}>
  ${TURN_CODE.split("\n").join("\n  ")}
</ChatLog>
<ChatComposer value={draft} onChange={setDraft} onSubmit={send} onStop={stop} busy={busy} />`,
} satisfies ComponentExample

/** Every ChatLog example facet, each one a section of the ChatLog docs page. */
export const chatLogExamples = {
  children: chatLogChildren,
  streaming: chatLogStreaming,
  "aria-label": chatLogAriaLabel,
  follow: chatLogFollow,
  lifecycle: chatLogLifecycle,
} satisfies Record<string, ComponentExample>
