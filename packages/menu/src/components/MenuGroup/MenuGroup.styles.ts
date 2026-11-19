import styled from "styled-components"
import { getToken } from "@niceprototypes/styles"

/** The group: its label over its items, a column like the menu's. */
export const StyledMenuGroup = styled.div`
  display: flex;
  flex-direction: column;
`

/** The group's label, inset like an item, in the `menu.groupLabel.color` colour. */
export const StyledMenuGroupLabel = styled.div`
  padding-block: ${getToken("menu.item.paddingBlock")};
  padding-inline: ${getToken("menu.item.paddingInline")};
  color: ${getToken("menu.groupLabel.color")};
  user-select: none;
`
