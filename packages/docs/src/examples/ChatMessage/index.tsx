// ChatMessage example configs: one ComponentExample per facet, keyed by prop name.
import Ink from "@niceprototypes/ink"
import Markdown from "@niceprototypes/markdown"
import { ChatCopyAction, ChatMessage } from "@niceprototypes/chat"
import type { ChatMessageProps } from "@niceprototypes/chat"
import type { ComponentExample } from "../../dataTables/components/demos/Components"
import { QUESTION, REPLY, chatWidth } from "../Chat/samples"

/** A message in the chat column. */
const DemoMessage = (props: ChatMessageProps) => (
  <div style={chatWidth}>
    <ChatMessage {...props} />
  </div>
)

/** The `children` variants: a question as Ink, a reply as Markdown. */
const CHILDREN = {
  question: { node: <Ink>{QUESTION}</Ink>, code: `<Ink>${QUESTION}</Ink>` },
  reply: { node: <Markdown>{REPLY}</Markdown>, code: "<Markdown>{reply}</Markdown>" },
} as const

export const chatMessageRole = {
  name: "role",
  description: "Who wrote the message: a user message is an end-aligned bubble on the raised background; an assistant reply is full width, without a bubble.",
  variants: ["user", "assistant"],
  default: "user",
  preview: (variant: ChatMessageProps["role"]) => (
    <DemoMessage role={variant}>{variant === "user" ? CHILDREN.question.node : CHILDREN.reply.node}</DemoMessage>
  ),
  code: (variant: string) =>
    `<ChatMessage role="${variant}">\n  ${variant === "user" ? CHILDREN.question.code : CHILDREN.reply.code}\n</ChatMessage>`,
} satisfies ComponentExample

export const chatMessageChildren = {
  name: "children",
  description: "The message content: Ink for plain text, Markdown for a formatted reply.",
  variants: Object.keys(CHILDREN),
  default: "reply",
  preview: (variant: keyof typeof CHILDREN) => (
    <DemoMessage role={variant === "question" ? "user" : "assistant"}>{CHILDREN[variant].node}</DemoMessage>
  ),
  code: (variant: keyof typeof CHILDREN) =>
    `<ChatMessage role="${variant === "question" ? "user" : "assistant"}">\n  ${CHILDREN[variant].code}\n</ChatMessage>`,
} satisfies ComponentExample

export const chatMessageStatus = {
  name: "status",
  description: "Lifecycle status: base; streaming, busy with the actions row withheld until the reply ends; error, the content in the error colour.",
  variants: ["base", "streaming", "error"],
  default: "base",
  preview: (variant: ChatMessageProps["status"]) => (
    <DemoMessage role="assistant" status={variant} actions={<ChatCopyAction text={REPLY} />}>
      {variant === "error" ? <Ink>The reply could not be completed.</Ink> : CHILDREN.reply.node}
    </DemoMessage>
  ),
  code: (variant: string) =>
    `<ChatMessage role="assistant" status="${variant}" actions={<ChatCopyAction text={reply} />}>\n  <Markdown>{reply}</Markdown>\n</ChatMessage>`,
} satisfies ComponentExample

export const chatMessageActions = {
  name: "actions",
  description: "The actions row under the message, such as a copy button. The last message shows it; earlier ones on hover or focus.",
  variants: ["none", "copy"],
  default: "none",
  preview: (variant: string) => (
    <DemoMessage role="assistant" actions={variant === "copy" ? <ChatCopyAction text={REPLY} /> : undefined}>
      {CHILDREN.reply.node}
    </DemoMessage>
  ),
  code: (variant: string) =>
    variant === "copy"
      ? `<ChatMessage role="assistant" actions={<ChatCopyAction text={reply} />}>\n  <Markdown>{reply}</Markdown>\n</ChatMessage>`
      : `<ChatMessage role="assistant">\n  <Markdown>{reply}</Markdown>\n</ChatMessage>`,
} satisfies ComponentExample

/** Every ChatMessage example facet, each one a section of the ChatMessage docs page. */
export const chatMessageExamples = {
  role: chatMessageRole,
  children: chatMessageChildren,
  status: chatMessageStatus,
  actions: chatMessageActions,
} satisfies Record<string, ComponentExample>
