// Badge example configs: one ComponentExample per facet. ComponentDocs renders each entry as a
// section of the Badge docs page, sorted by name.
import Badge, { type BadgeStatusType } from "@niceprototypes/badge"
import Flex from "@niceprototypes/flex"
import Ink from "@niceprototypes/ink"
import type { ComponentExample } from "../../dataTables/components/demos/Components"

const STATUSES = ["base", "success", "warning", "error"] as const satisfies readonly BadgeStatusType[]

const LABELS: Record<BadgeStatusType, string> = { base: "Stopped", success: "Running", warning: "Held", error: "Failed" }

export const badgeStatus = {
  name: "status",
  description: "The semantic status: tint, dot and text colour from the matching status tokens, in day and night.",
  variants: STATUSES,
  default: "base",
  preview: (variant: BadgeStatusType) => <Badge status={variant} label={LABELS[variant]} />,
  code: (variant: BadgeStatusType) => `<Badge status="${variant}" label="${LABELS[variant]}" />`,
} satisfies ComponentExample

export const badgeLabel = {
  name: "label",
  description: "The badge's text; it carries the meaning, the dot is decorative. It stays on one line.",
  variants: ["Running", "Waiting for review", "4 of 12 checks failed"],
  default: "Running",
  preview: (variant: string) => <Badge status="success" label={variant} />,
  code: (variant: string) => `<Badge status="success" label="${variant}" />`,
} satisfies ComponentExample

/** Every status in a row, and each one beside text, as Badges sit in a list or a table cell. */
export const badgeSideBySide = {
  name: "side by side",
  description: "The four statuses together, to compare their tints; and inline after text, aligned to it.",
  variants: ["every status", "after text"],
  default: "every status",
  preview: (variant: string) =>
    variant === "every status" ? (
      <Flex gap="small" wrap="wrap" alignItems="center">
        {STATUSES.map(status => (
          <Badge key={status} status={status} label={LABELS[status]} />
        ))}
      </Flex>
    ) : (
      <Flex direction="column" gap="small">
        {STATUSES.map(status => (
          <Flex key={status} gap="small" alignItems="center">
            <Ink>{`port ${4012 + STATUSES.indexOf(status)}`}</Ink>
            <Badge status={status} label={LABELS[status]} />
          </Flex>
        ))}
      </Flex>
    ),
  code: (variant: string) =>
    variant === "every status"
      ? `<Flex gap="small" wrap="wrap" alignItems="center">\n${STATUSES.map(status => `  <Badge status="${status}" label="${LABELS[status]}" />`).join("\n")}\n</Flex>`
      : `<Flex gap="small" alignItems="center">\n  <Ink>port 4012</Ink>\n  <Badge status="base" label="Stopped" />\n</Flex>`,
} satisfies ComponentExample

/** Every Badge example facet: each one a section of the Badge docs page. */
export const badgeExamples = {
  status: badgeStatus,
  label: badgeLabel,
  sideBySide: badgeSideBySide,
} satisfies Record<string, ComponentExample>
