// The sample conversation and chat column the Chat* examples share (examples/ChatLog, ChatMessage, …).
// This folder has no index.tsx: it is not a component's examples.
import Ink from "@niceprototypes/ink"
import Markdown from "@niceprototypes/markdown"
import { setTokens } from "@niceprototypes/styles"
import { ChatCopyAction, ChatMessage } from "@niceprototypes/chat"
import type { ChatMessageStatusType } from "@niceprototypes/chat"

/** The chat column the examples render in: a log above a composer, from a project token map. */
const getToken = setTokens({ width: { base: "480px", full: "100%" }, height: { base: "360px" } }, "chatExamples")

/** The column's width alone (a message, a composer), and its width and height (a log). */
export const chatWidth = { width: getToken("chatExamples.width:base"), maxWidth: getToken("chatExamples.width:full") }
export const chatColumn = { ...chatWidth, height: getToken("chatExamples.height:base") }

export const QUESTION = "Why does the slide feel stiff?"

export const REPLY = `It starts and stops at full speed. Give it an \`ease-out\` curve:

\`\`\`css
.slide {
  transition: transform 240ms ease-out;
}
\`\`\`

Shorter durations read snappier; keep the fade on the same timing.`

/** The reply as it streams: each step adds the next few words. */
export const STREAM = (() => {
  const words = REPLY.split(/(?<=\s)/)
  const steps = 5
  const chunk = Math.ceil(words.length / steps)
  return Array.from({ length: steps }, (_, index) => words.slice(0, (index + 1) * chunk).join(""))
})()

/** One turn of the scripted exchange. */
export type TurnType = { id: string; role: "user" | "assistant"; text: string; status?: ChatMessageStatusType }

/** A user turn as Ink, an assistant turn as Markdown with a copy action. */
export const TurnMessage = ({ role, text, status }: TurnType) => (
  <ChatMessage
    role={role}
    status={status}
    actions={role === "assistant" ? <ChatCopyAction text={text} /> : undefined}
  >
    {role === "user" ? <Ink>{text}</Ink> : <Markdown>{text}</Markdown>}
  </ChatMessage>
)

/** The question as the first turn of an exchange. */
export const ASK: TurnType = { id: "q", role: "user", text: QUESTION }

/** A conversation long enough to scroll. */
export const CONVERSATION: TurnType[] = Array.from({ length: 4 }, (_, index) => [
  { id: `q${index}`, role: "user" as const, text: QUESTION },
  { id: `a${index}`, role: "assistant" as const, text: REPLY },
]).flat()

/** The code of a turn rendered as TurnMessage does. */
export const TURN_CODE = `{messages.map(message => (
  <ChatMessage
    key={message.id}
    role={message.role}
    status={message.status}
    actions={message.role === "assistant" ? <ChatCopyAction text={message.text} /> : undefined}
  >
    {message.role === "user" ? <Ink>{message.text}</Ink> : <Markdown>{message.text}</Markdown>}
  </ChatMessage>
))}`
