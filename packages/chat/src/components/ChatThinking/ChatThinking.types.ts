/**
 * ChatThinkingAriaLabelType
 *
 * The accessible name of the status region, e.g. "Thinking".
 */
export type ChatThinkingAriaLabelType = string

/**
 * ChatThinkingProps
 *
 * Complete prop definition for the ChatThinking component.
 */
export interface ChatThinkingProps {
  /**
   * Accessible name of the status region
   * @default "Thinking"
   */
  "aria-label"?: ChatThinkingAriaLabelType
}

// Declaration merging: const + namespace creates exportable type namespace
const ChatThinkingTypes = {} as const

namespace ChatThinkingTypes {
  export type AriaLabel = ChatThinkingAriaLabelType
  export type Props = ChatThinkingProps
}

export default ChatThinkingTypes
