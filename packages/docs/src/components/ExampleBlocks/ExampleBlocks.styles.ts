import styled from "styled-components"
import { getBleedRadius } from "@niceprototypes/flow"
import { getConstantKey, getToken } from "@niceprototypes/styles"
import { getToken as getDocsToken } from "../../nice/tokens"

/** The example's Code card with square corners while it bleeds edge to edge (getBleedRadius), rounded otherwise. */
export const StyledExampleBlocksTile = styled.div`
  ${getConstantKey("code.borderRadius")}: ${getBleedRadius(getToken("borderRadius"))};
`

/**
 * A value line (ExampleValues): outlined in `docs.activeColor` while its demo is the one in view;
 * the border is always drawn (transparent otherwise) so the line never changes size. Eased over
 * the base animation duration; no easing under reduced motion.
 */
export const StyledExampleValue = styled.span<{ $active: boolean }>`
  display: flex;
  border: ${getToken("borderWidth", "small")} solid
    ${({ $active }) => ($active ? getDocsToken("docs", "activeColor") : "transparent")};
  border-radius: ${getToken("code.borderRadius", "small")};
  transition: border-color ${getToken("animationDuration")} ${getToken("animationEasing")};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`
