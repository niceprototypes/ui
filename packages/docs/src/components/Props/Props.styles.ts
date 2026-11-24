import styled from "styled-components"
import { getToken as getCoreToken } from "@niceprototypes/styles"

/** A story: its link from the list lands it where Contents sticks, below the page's top. */
export const StyledPropsStory = styled.div`
  scroll-margin-top: ${getCoreToken("contents.top")};
`
