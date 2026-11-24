import styled, { css, keyframes } from "styled-components"
import { getToken } from "@niceprototypes/styles"

/**
 * The blocks in a column, `markdown.gap` apart; top-level lists drop their default margins for the
 * gap. A list starts on the text edge: each item's marker at the list's start, its text the base
 * gap after it (a numbered list's the large gap, for two-digit numbers), the items the small gap
 * apart.
 */
export const StyledMarkdown = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${getToken("markdown.gap")};

  & > ul,
  & > ol {
    margin: 0;
  }

  & ul,
  & ol {
    display: flex;
    flex-direction: column;
    gap: ${getToken("gap", "small")};
    padding-inline-start: 0;
    list-style: none;
  }

  & li {
    position: relative;
    padding-inline-start: ${getToken("gap")};
  }

  & li::before {
    position: absolute;
    inset-inline-start: 0;
  }

  & ul > li::before {
    content: "•";
  }

  & ol {
    counter-reset: markdown-list;
  }

  & ol > li {
    counter-increment: markdown-list;
    padding-inline-start: ${getToken("gap", "large")};
  }

  & ol > li::before {
    content: counter(markdown-list) ".";
  }
`

const reveal = keyframes`
  from { opacity: 0; }
`

/**
 * A list limited to `$limit` items (MarkdownList): the items after the limit are not displayed
 * until `$expanded`, then fade in over the fast animation duration (none under reduced motion).
 */
export const StyledMarkdownList = styled.ul<{ $limit?: number; $expanded: boolean }>`
  ${({ $limit, $expanded }) =>
    $limit !== undefined &&
    css`
      & > li:nth-child(n + ${$limit + 1}) {
        ${$expanded
          ? css`
              animation: ${reveal} ${getToken("animationDuration", "fast")} ${getToken("animationEasing")};

              @media (prefers-reduced-motion: reduce) {
                animation: none;
              }
            `
          : css`
              display: none;
            `}
      }
    `}
`

/** The "Show N more" button's row, after its list: the button at its natural width, at the start. */
export const StyledMarkdownListToggle = styled.div`
  display: flex;
`
