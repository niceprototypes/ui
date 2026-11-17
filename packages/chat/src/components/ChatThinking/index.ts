import * as React from "react"
import { withBreakpoints, type WithBreakpointsProps } from "@niceprototypes/styles"
import BaseChatThinking from "./ChatThinking"
import type { ChatThinkingProps } from "./ChatThinking.types"

// Explicit return-type annotation — without it, TS declaration emit can leave an unbound
// generic `<P>` in dist or collapse to `any`, erasing the `breakpoints` prop on consumers.
const ChatThinking: React.FC<WithBreakpointsProps<ChatThinkingProps>> = withBreakpoints<ChatThinkingProps>(BaseChatThinking)

export { ChatThinking }
export * from "./ChatThinking.types"
export { default as ChatThinkingTypes } from "./ChatThinking.types"
