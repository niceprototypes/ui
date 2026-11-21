import * as React from "react"
import Ink from "@niceprototypes/ink"
import DocsInk from "../../nice/Ink"
import { StyledCallout, StyledCalloutBody, StyledCalloutHeader } from "./Callout.styles"

/**
 * Callout variants. Each maps to a header bar: its emoji and its name.
 * Extend by adding a key here and an entry in {@link CALLOUT_EMOJI}.
 */
export type CalloutType = "hint" | "learning"

// Variant → the emoji shown before its name in the header bar.
const CALLOUT_EMOJI: Record<CalloutType, string> = {
  hint: "💡",
  learning: "🧠",
}

interface CalloutProps {
  /**
   * Callout variant. When set, the callout is a panel with a header bar naming it (e.g. `hint` →
   * 💡 HINT). Omit for a plain blockquote, effectively `> {children}`.
   */
  type?: CalloutType
  /** Callout text. */
  children?: React.ReactNode
}

/**
 * A callout for MDX docs. With a `type` it is a panel as Stripe's API reference draws one: a
 * header bar with the variant's emoji and name in small capitals, then the text. With no `type`
 * it is a plain blockquote.
 */
const Callout: React.FC<CalloutProps> = ({ type, children }) => {
  // Unwrap the <p> MDX wraps block-style children in, so we don't nest a <p>
  // inside the <p> rendered below.
  const content = React.Children.map(children, (child) =>
    React.isValidElement(child) && child.type === "p"
      ? (child.props as { children?: React.ReactNode }).children
      : child
  )

  if (type)
    return (
      <StyledCallout>
        <StyledCalloutHeader>
          <Ink size="smaller" weight="semibold" letterSpacing="wide">{`${CALLOUT_EMOJI[type]} ${type}`}</Ink>
        </StyledCalloutHeader>
        <StyledCalloutBody>
          <DocsInk as="p">{content}</DocsInk>
        </StyledCalloutBody>
      </StyledCallout>
    )

  return (
    <blockquote>
      {/* Wrap in a <p> to match the native markdown blockquote structure
          (<blockquote><p>…</p></blockquote>) the docs CSS styles via `blockquote p`;
          a bare text child renders unstyled as body text. */}
      <p>{content}</p>
    </blockquote>
  )
}

export default Callout
