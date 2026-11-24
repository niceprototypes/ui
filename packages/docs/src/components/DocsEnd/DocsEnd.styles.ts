import styled from "styled-components"
import { getToken as getCoreToken } from "@niceprototypes/styles"

/**
 * The page's end column inside App's end column (outside the scrolling page, full height, the
 * column's rule on its start edge): its content from the top, the region's padding above it and
 * at the screen's edge, its rows starting on the rule (DocsPage pulls Contents over it).
 */
export const StyledDocsEnd = styled.div`
  flex: 1 1 auto;
  display: flex;
  justify-content: space-between;
  min-height: 0;
  padding-block-start: ${getCoreToken("app.docs.padding")};
  padding-inline: 0 ${getCoreToken("app.docs.padding")};
`
