import styled from "styled-components"
import { getToken as getCoreToken } from "@niceprototypes/styles"
import { getToken } from "../../nice/tokens"

/**
 * The column-wide box the scaled demo sits in, as tall as the scaled demo (set from its measure).
 * Under the pointer and on keyboard focus of its button it zooms by `docs.previewHoverScale` from
 * its centre (into the column's gutter and padding, never past them) and its border, transparent at
 * rest, takes the docs active colour; eased over the fast animation duration, no zoom under reduced motion.
 */
export const StyledScaledPreview = styled.div`
  overflow: hidden;
  border: ${getCoreToken("borderWidth", "small")} solid transparent;
  border-radius: ${getCoreToken("borderRadius")};
  transition:
    transform ${getCoreToken("animationDuration", "fast")} ${getCoreToken("animationEasing")},
    border-color ${getCoreToken("animationDuration", "fast")} ${getCoreToken("animationEasing")};

  :hover > &,
  :focus-visible > & {
    border-color: ${getToken("docs", "activeColor")};
    transform: scale(${getToken("docs", "previewHoverScale")});
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    :hover > &,
    :focus-visible > & {
      transform: none;
    }
  }
`

/**
 * The demo laid out at `docs.previewWidth`, scaled from its top start corner to the box's width;
 * inert and passing the pointer through (frames included), so a click reaches the preview's button.
 */
export const StyledScaledPreviewContent = styled.div`
  width: ${getToken("docs", "previewWidth")};
  transform-origin: top left;
  pointer-events: none;

  [dir="rtl"] & {
    transform-origin: top right;
  }
`

/** The demo at its real size in the lightbox: `docs.previewWidth` wide, never scaled. */
export const StyledScaledPreviewFull = styled.div`
  width: ${getToken("docs", "previewWidth")};
`
