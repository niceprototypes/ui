import * as React from "react"
import Button from "@niceprototypes/button"
import Flex from "@niceprototypes/flex"
import Ink, { type InkColorType } from "@niceprototypes/ink"
import { StyledChatToolCall } from "./ChatToolCall.styles"
import type { ChatToolCallProps, ChatToolCallStatusType } from "./ChatToolCall.types"

/** The status line each resolved or running status shows. */
const STATUS_LABELS: Record<Exclude<ChatToolCallStatusType, "pending">, string> = {
  running: "Running",
  done: "Done",
  denied: "Denied",
  failed: "Failed",
}

/** The status line's colour: success for done, error for failed, muted otherwise. */
const STATUS_COLORS: Record<Exclude<ChatToolCallStatusType, "pending">, InkColorType> = {
  running: "lighter",
  done: "success",
  denied: "lighter",
  failed: "error",
}

/**
 * A tool call in a chat: its title and details, with Approve and Deny buttons while it is pending;
 * once approved or answered, a status line (and `outcome`) in place of the buttons. A group named
 * by its title; the status line is a live region, so the outcome is announced.
 *
 * @example
 * ```tsx
 * <ChatToolCall title="Install asset" status={status} onApprove={approve} onDeny={deny}>
 *   nice/chat@1.0.0
 * </ChatToolCall>
 * ```
 */
const ChatToolCall: React.FC<ChatToolCallProps> = ({ title, children, status = "pending", outcome, onApprove, onDeny }) => {
  const titleId = React.useId()
  return (
    <StyledChatToolCall
      role="group"
      aria-labelledby={titleId}
    >
      <Ink
        id={titleId}
        weight="semibold"
      >
        {title}
      </Ink>
      {children}
      {status === "pending" ? (
        <Flex gap="small">
          <Button
            size="small"
            filled
            onClick={onApprove}
          >
            Approve
          </Button>
          <Button
            size="small"
            onClick={onDeny}
          >
            Deny
          </Button>
        </Flex>
      ) : (
        <div role="status">
          <Ink color={STATUS_COLORS[status]}>
            {STATUS_LABELS[status]}
            {outcome && <>: {outcome}</>}
          </Ink>
        </div>
      )}
    </StyledChatToolCall>
  )
}

export default ChatToolCall
