import * as React from "react"
import ChatMessage from "../ChatMessage/ChatMessage"
import { StyledChatThinking, StyledChatThinkingDot } from "./ChatThinking.styles"
import type { ChatThinkingProps } from "./ChatThinking.types"

/** The number of dots. */
const DOTS = [0, 1, 2]

/**
 * The pending assistant turn: three dots that rise in turn while the reply has not started.
 * It renders as an assistant message, so it sits in a `ChatLog` where the reply will appear;
 * replace it with the reply's `ChatMessage` when the first text arrives. With
 * `prefers-reduced-motion: reduce` the dots stay in place and only fade.
 *
 * @example
 * ```tsx
 * <ChatLog aria-label="Conversation" streaming={busy}>
 *   {messages.map(…)}
 *   {busy && !replyStarted && <ChatThinking />}
 * </ChatLog>
 * ```
 */
const ChatThinking: React.FC<ChatThinkingProps> = ({ "aria-label": ariaLabel = "Thinking" }) => (
  <ChatMessage role="assistant">
    <StyledChatThinking
      role="status"
      aria-label={ariaLabel}
    >
      {DOTS.map(index => (
        <StyledChatThinkingDot
          key={index}
          $index={index}
          aria-hidden
        />
      ))}
    </StyledChatThinking>
  </ChatMessage>
)

export default ChatThinking
