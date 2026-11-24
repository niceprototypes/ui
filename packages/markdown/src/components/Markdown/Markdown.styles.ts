import styled from "styled-components"
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
