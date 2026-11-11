import * as React from "react"

/**
 * ChatToolCallStatusType
 *
 * Where the tool call is in its lifecycle.
 *
 * Values:
 * - "pending": waiting for the user; the Approve and Deny buttons show
 * - "running": approved (or needing no approval) and running
 * - "done": ran and succeeded
 * - "denied": the user declined it; it did not run
 * - "failed": it ran, or was refused, with an error
 */
export type ChatToolCallStatusType = "pending" | "running" | "done" | "denied" | "failed"

/**
 * ChatToolCallTitleType
 *
 * What the call does, in a few words, e.g. "Install asset". It also labels the call's group.
 */
export type ChatToolCallTitleType = string

/**
 * ChatToolCallChildrenType
 *
 * The call's summary or details: what it will act on, e.g. its input as text.
 */
export type ChatToolCallChildrenType = React.ReactNode

/**
 * ChatToolCallOutcomeType
 *
 * A resolved call's detail after its status, e.g. the error a failed call returned.
 */
export type ChatToolCallOutcomeType = React.ReactNode

/**
 * ChatToolCallOnApproveType
 *
 * Called when the user presses Approve.
 */
export type ChatToolCallOnApproveType = () => void

/**
 * ChatToolCallOnDenyType
 *
 * Called when the user presses Deny.
 */
export type ChatToolCallOnDenyType = () => void

/**
 * ChatToolCallProps
 *
 * Complete prop definition for the ChatToolCall component.
 */
export interface ChatToolCallProps {
  /** What the call does */
  title: ChatToolCallTitleType
  /** The call's summary or details */
  children?: ChatToolCallChildrenType
  /**
   * Lifecycle status
   * @default "pending"
   */
  status?: ChatToolCallStatusType
  /** A resolved call's detail, after its status */
  outcome?: ChatToolCallOutcomeType
  /** Approve pressed */
  onApprove?: ChatToolCallOnApproveType
  /** Deny pressed */
  onDeny?: ChatToolCallOnDenyType
}

// Declaration merging: const + namespace creates exportable type namespace
const ChatToolCallTypes = {} as const

namespace ChatToolCallTypes {
  export type Status = ChatToolCallStatusType
  export type Title = ChatToolCallTitleType
  export type Children = ChatToolCallChildrenType
  export type Outcome = ChatToolCallOutcomeType
  export type OnApprove = ChatToolCallOnApproveType
  export type OnDeny = ChatToolCallOnDenyType
  export type Props = ChatToolCallProps
}

export default ChatToolCallTypes
