import styled from "styled-components"
import { getToken } from "@niceprototypes/styles"

/**
 * Wraps the trigger to hear its arrow keys (Button takes no onKeyDown) without adding a box:
 * `display: contents` leaves the Button as the layout child of the MenuButton's parent. With
 * `$selectBorder` (a select-look trigger that is not ghosted) it gives the Button the
 * `menu.trigger.borderColor` border, the Checkbox's unchecked border, turning to the Checkbox's
 * hover border on hover.
 */
export const StyledMenuButtonTrigger = styled.span<{ $selectBorder: boolean }>`
  display: contents;

  ${({ $selectBorder }) =>
    $selectBorder
      ? `
  & > button {
    border-color: ${getToken("menu.trigger.borderColor")};
  }

  & > button:hover:not(:disabled) {
    border-color: ${getToken("menu.trigger.borderColor:hover")};
  }
`
      : ""}
`
