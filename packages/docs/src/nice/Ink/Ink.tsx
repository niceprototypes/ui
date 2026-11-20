import * as React from "react"
import { InkProps } from "@niceprototypes/ink"
import { StyledInk } from "./Ink.styles"
import { inlineCode, unwrapMdxParagraph } from "./Ink.services"

type Props = InkProps & { unstyled?: boolean }

/** Heading elements keep @niceprototypes/ink's own color default, and are semibold: the docs use no bold. */
const HEADINGS = new Set(["h1", "h2", "h3", "h4"])

const Ink: React.FC<Props> = ({
  as,
  unstyled = true,
  color,
  weight,
  className,
  children,
  ...props
}) => {
  const isHeading = as !== undefined && HEADINGS.has(as)
  const finalColor = color ?? (isHeading ? undefined : "light")
  const finalClassName = unstyled
    ? ["sb-unstyled", className].filter(Boolean).join(" ")
    : className
  return (
    <StyledInk
      forwardedAs={as}
      color={finalColor}
      weight={weight ?? (isHeading ? "semibold" : undefined)}
      {...props}
      className={finalClassName}
    >
      {inlineCode(unwrapMdxParagraph(children))}
    </StyledInk>
  )
}

export default Ink
