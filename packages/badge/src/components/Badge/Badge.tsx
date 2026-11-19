import * as React from "react"
import { StyledBadge } from "./Badge.styles"
import type { BadgeProps } from "./Badge.types"

/**
 * Badge
 *
 * A small status label: a rounded rectangle tinted by `status`, a leading dot and the label in
 * the status colour. Colours come from the semantic status tokens, so the badge follows the
 * theme. The dot is decorative; the label carries the meaning.
 *
 * @example
 * ```tsx
 * <Badge status="success" label="Running" />
 * ```
 */
const Badge: React.FC<BadgeProps> = ({ label, status = "base" }) => (
  <StyledBadge data-status={status}>{label}</StyledBadge>
)

export default Badge
