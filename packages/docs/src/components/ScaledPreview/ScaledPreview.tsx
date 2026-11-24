import * as React from "react"
import Lightbox from "@niceprototypes/lightbox"
import { breakpointKeyMatches, parseBreakpointKey, useBreakpoint } from "@niceprototypes/styles"
import { StyledScaledPreview, StyledScaledPreviewContent, StyledScaledPreviewFull } from "./ScaledPreview.styles"
import type { ScaledPreviewProps } from "./ScaledPreview.types"

/** From laptop up the demo shares the row with its text (DocsColumns), so it is scaled; stacked below, it is shown as it is. */
const SCALED = parseBreakpointKey("laptop+")

/**
 * ScaledPreview
 *
 * A demo designed for a full screen, in a narrower column: laid out at `docs.previewWidth` and
 * shrunk uniformly (a scale transform, never a reflow) to the column's width, its box as tall as
 * the scaled demo. The scaled copy is inert; it is one button, named by `label`, that opens the
 * demo at its real size in a Lightbox (scrolling when larger than the screen), where it is
 * interactive. Below laptop the demo is shown as it is, in the column's width.
 */
const ScaledPreview: React.FC<ScaledPreviewProps> = ({ label, children }) => {
  const scaled = breakpointKeyMatches(SCALED, useBreakpoint())
  const box = React.useRef<HTMLDivElement>(null)
  const content = React.useRef<HTMLDivElement>(null)
  const [fit, setFit] = React.useState<{ scale: number; height: number }>()
  React.useLayoutEffect(() => {
    const boxElement = box.current
    const contentElement = content.current
    if (!scaled || !boxElement || !contentElement) return
    // The scale from the box's width over the demo's layout width; the box's height from the demo's unscaled height.
    const measure = () => {
      const scale = boxElement.clientWidth / contentElement.offsetWidth
      setFit({ scale, height: contentElement.offsetHeight * scale })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(boxElement)
    observer.observe(contentElement)
    return () => observer.disconnect()
  }, [scaled])
  if (!scaled) return <>{children}</>
  return (
    <Lightbox label={label} content={<StyledScaledPreviewFull>{children}</StyledScaledPreviewFull>}>
      <StyledScaledPreview ref={box} style={fit ? { height: fit.height } : undefined}>
        <StyledScaledPreviewContent ref={content} inert style={fit ? { transform: `scale(${fit.scale})` } : undefined}>
          {children}
        </StyledScaledPreviewContent>
      </StyledScaledPreview>
    </Lightbox>
  )
}

export default ScaledPreview
