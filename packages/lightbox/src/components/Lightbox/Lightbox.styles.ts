import styled, { css, keyframes } from "styled-components"
import { getToken } from "@niceprototypes/styles"

export const Trigger = styled.div`
  cursor: pointer;

  &:focus-visible {
    outline: ${getToken("lightbox.focusRing.width:base")} solid ${getToken("lightbox.focusRing.color:base")};
    outline-offset: ${getToken("lightbox.focusRing.offset:base")};
  }
`

/**
 * The native `<dialog>`, shown with `showModal()`: the top layer needs no z-index and makes the
 * page behind it inert. It fills the viewport and carries the scrim itself, so a click whose target
 * is the dialog is a click outside the image and caption; the user-agent backdrop is cleared.
 */
const fadeIn = keyframes`
  from { opacity: 0; }
`

const fadeOut = keyframes`
  to { opacity: 0; }
`

export const Overlay = styled.dialog<{ $content: boolean; $leaving: boolean }>`
  width: 100%;
  height: 100%;
  max-width: none;
  max-height: none;
  margin: 0;
  padding: 0;
  border: none;
  background-color: ${getToken("lightbox.backgroundColor:base")};
  cursor: pointer;

  &[open] {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  /* Fades in when shown and out after a close, over the animation tokens; none under reduced motion. */
  animation: ${({ $leaving }) => ($leaving ? fadeOut : fadeIn)} ${getToken("animationDuration")} ${getToken("animationEasing")} both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  /* Content at real size: the overlay scrolls in both directions, the content centred by auto
     margins (which never push it past the start edge) with the large gap around it. */
  ${({ $content }) =>
    $content &&
    css`
      overflow: auto;
      padding: ${getToken("gap", "larger")} ${getToken("gap", "large")};

      &[open] {
        align-items: flex-start;
        justify-content: flex-start;
      }
    `}

  &::backdrop {
    background: none;
  }

  &:focus {
    outline: none;
  }
`

export const Image = styled.img`
  max-width: ${getToken("lightbox.image.maxWidth:base")};
  max-height: ${getToken("lightbox.image.maxHeight:base")};
  object-fit: contain;
`

/** Content shown at its real size: no shrinking, centred by auto margins inside the scrolling overlay. */
export const Content = styled.div`
  flex: none;
  margin: auto;
  cursor: auto;
`

/** The Close button's place: the overlay's top end corner, staying there while the content scrolls. */
export const Close = styled.div`
  position: fixed;
  inset-block-start: ${getToken("gap", "small")};
  inset-inline-end: ${getToken("gap", "large")};
  cursor: auto;
`
