import styled, { keyframes } from "styled-components"
import { getToken } from "@niceprototypes/styles"

/** A dot rises by `chat.thinking.lift` and brightens, then settles. */
const rise = keyframes`
  0%, 60%, 100% {
    transform: none;
    opacity: ${getToken("chat.thinking.dotOpacity")};
  }
  30% {
    transform: translateY(calc(-1 * ${getToken("chat.thinking.lift")}));
    opacity: 1;
  }
`

/** Reduced motion: the dot only brightens and dims in place. */
const pulse = keyframes`
  0%, 60%, 100% {
    opacity: ${getToken("chat.thinking.dotOpacity")};
  }
  30% {
    opacity: 1;
  }
`

/** The dots in a row, one text line tall so the first streamed line does not shift the log. */
export const StyledChatThinking = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken("chat.thinking.gap")};
  block-size: ${getToken("chat.thinking.blockSize")};
`

/** One dot; each starts `chat.thinking.animationDelay` after the one before it. */
export const StyledChatThinkingDot = styled.span<{ $index: number }>`
  inline-size: ${getToken("chat.thinking.dotSize")};
  block-size: ${getToken("chat.thinking.dotSize")};
  border-radius: ${getToken("chat.thinking.dotBorderRadius")};
  background-color: ${getToken("chat.thinking.dotColor")};
  opacity: ${getToken("chat.thinking.dotOpacity")};
  animation: ${rise} ${getToken("chat.thinking.animationDuration")} ${getToken("chat.thinking.animationEasing")}
    infinite;
  animation-delay: ${({ $index }) => `calc(${getToken("chat.thinking.animationDelay")} * ${$index})`};

  @media (prefers-reduced-motion: reduce) {
    animation-name: ${pulse};
  }
`
