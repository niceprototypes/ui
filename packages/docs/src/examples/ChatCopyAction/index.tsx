// ChatCopyAction example configs: one ComponentExample per facet, keyed by prop name. Every preview is a
// live copy button: press it to copy its text.
import Ink from "@niceprototypes/ink"
import { ChatCopyAction, ChatMessage } from "@niceprototypes/chat"
import type { ComponentExample } from "../../dataTables/components/demos/Components"
import { chatWidth } from "../Chat/samples"

/** The `text` variants: a line of code, and a short reply. */
const TEXTS: Record<string, string> = {
  code: "transition: transform 240ms ease-out;",
  reply: "Give the slide an ease-out curve and shorten it to 240ms.",
}

export const chatCopyActionText = {
  name: "text",
  description: "The text to copy: the ghost copy-icon button writes it to the clipboard.",
  variants: Object.keys(TEXTS),
  default: "code",
  preview: (variant: string) => <ChatCopyAction text={TEXTS[variant]} />,
  code: (variant: string) => `<ChatCopyAction text="${TEXTS[variant]}" />`,
} satisfies ComponentExample

export const chatCopyActionInMessage = {
  name: "in a message",
  description: "Passed as a ChatMessage's actions: the row under the reply, shown on the last message and on hover.",
  variants: ["reply"],
  default: "reply",
  preview: () => (
    <div style={chatWidth}>
      <ChatMessage role="assistant" actions={<ChatCopyAction text={TEXTS.reply} />}>
        <Ink>{TEXTS.reply}</Ink>
      </ChatMessage>
    </div>
  ),
  code: () => `<ChatMessage role="assistant" actions={<ChatCopyAction text={reply} />}>
  <Markdown>{reply}</Markdown>
</ChatMessage>`,
} satisfies ComponentExample

/** Every ChatCopyAction example facet, each one a section of the ChatCopyAction docs page. */
export const chatCopyActionExamples = {
  text: chatCopyActionText,
  inMessage: chatCopyActionInMessage,
} satisfies Record<string, ComponentExample>
