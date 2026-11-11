import styled from "styled-components"
import { getToken } from "@niceprototypes/styles"

/** The call: a bordered box stacking its title, details, then its actions or status. */
export const StyledChatToolCall = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${getToken("chat.toolCall.gap:base")};
  padding: ${getToken("chat.toolCall.padding:base")};
  border: ${getToken("chat.toolCall.borderWidth:base")} solid ${getToken("chat.toolCall.borderColor:base")};
  border-radius: ${getToken("chat.toolCall.borderRadius:base")};
`
