import styled from "styled-components"
import { getBleedRadius } from "@niceprototypes/flow"
import { getConstantKey, getToken } from "@niceprototypes/styles"
import { getToken as getDocsToken } from "../../nice/tokens"

/** The example's Code card with square corners while it bleeds edge to edge (getBleedRadius), rounded otherwise. */
export const StyledExampleBlocksTile = styled.div`
  ${getConstantKey("code.borderRadius")}: ${getBleedRadius(getToken("borderRadius"))};
`

/**
 * A value line (ExampleValues): receded to `docs.dimmedOpacity` while its demo is not the one in
 * view, eased over the base animation duration; no easing under reduced motion.
 */
export const StyledExampleValue = styled.span<{ $dimmed: boolean }>`
  display: flex;
  opacity: ${({ $dimmed }) => ($dimmed ? getDocsToken("docs", "dimmedOpacity") : 1)};
  transition: opacity ${getToken("animationDuration")} ${getToken("animationEasing")};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`
