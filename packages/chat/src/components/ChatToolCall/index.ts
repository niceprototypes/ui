import * as React from "react"
import { withBreakpoints, type WithBreakpointsProps } from "@niceprototypes/styles"
import BaseChatToolCall from "./ChatToolCall"
import type { ChatToolCallProps } from "./ChatToolCall.types"

// Explicit return-type annotation — without it, TS declaration emit can leave an unbound
// generic `<P>` in dist or collapse to `any`, erasing the `breakpoints` prop on consumers.
const ChatToolCall: React.FC<WithBreakpointsProps<ChatToolCallProps>> = withBreakpoints<ChatToolCallProps>(BaseChatToolCall)

export { ChatToolCall }
export * from "./ChatToolCall.types"
export { default as ChatToolCallTypes } from "./ChatToolCall.types"
