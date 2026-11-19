// Badge example configs: one ComponentExample per facet. ComponentDocs renders each entry as a
// section of the Badge docs page, sorted by name.
import Badge, { type BadgeStatusType } from "@niceprototypes/badge"
import type { ComponentExample } from "../../dataTables/components/demos/Components"

const LABELS: Record<BadgeStatusType, string> = { base: "Stopped", success: "Running", warning: "Held", error: "Failed" }

export const badgeStatus = {
  name: "status",
  description: "The semantic status: tint, dot and text colour from the matching status tokens, in day and night.",
  variants: ["base", "success", "warning", "error"],
  default: "base",
  preview: (variant: BadgeStatusType) => <Badge status={variant} label={LABELS[variant]} />,
  code: (variant: BadgeStatusType) => `<Badge status="${variant}" label="${LABELS[variant]}" />`,
} satisfies ComponentExample

export const badgeLabel = {
  name: "label",
  description: "The badge's text; it carries the meaning, the dot is decorative.",
  variants: ["Running"],
  default: "Running",
  preview: (variant: string) => <Badge status="success" label={variant} />,
  code: (variant: string) => `<Badge status="success" label="${variant}" />`,
} satisfies ComponentExample

/** Every Badge example facet: each one a section of the Badge docs page. */
export const badgeExamples = {
  status: badgeStatus,
  label: badgeLabel,
} satisfies Record<string, ComponentExample>
