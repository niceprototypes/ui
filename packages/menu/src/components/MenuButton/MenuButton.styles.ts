import styled from "styled-components"

/**
 * Wraps the trigger to hear its arrow keys (Button takes no onKeyDown) without adding a box:
 * `display: contents` leaves the Button as the layout child of the MenuButton's parent.
 */
export const StyledMenuButtonTrigger = styled.span`
  display: contents;
`
