// MenuItem example configs: one ComponentExample per prop, shown in the MenuItem section of the Menu docs
// page. Every preview is a live item inside a Menu, as it must be: click it, or focus it and press Enter.
import { useState } from "react"
import { Menu, MenuItem } from "@niceprototypes/menu"
import type { MenuItemProps } from "@niceprototypes/menu"
import Flex from "@niceprototypes/flex"
import Ink from "@niceprototypes/ink"
import type { ComponentExample } from "../../dataTables/components/demos/Components"

/** Items that report the label each choice selects. */
const ReportingMenu = (props: Partial<MenuItemProps>) => {
  const [last, setLast] = useState<string | null>(null)
  return (
    <Flex direction="column" gap="small">
      <Menu aria-label="Actions">
        {["Edit", "Duplicate", "Delete"].map(label => (
          <MenuItem key={label} {...props} onSelect={() => setLast(label)}>
            {label}
          </MenuItem>
        ))}
      </Menu>
      <Ink code>{last === null ? "–" : `onSelect → ${last}`}</Ink>
    </Flex>
  )
}

/** The `icon` variants. */
const ICONS = ["none", "edit", "copy", "download", "trash"] as const

export const menuItemChildren = {
  name: "children",
  description: "The item's label. A typed letter jumps to the next item whose label starts with it.",
  variants: ["Edit", "Duplicate"],
  default: "Edit",
  preview: (variant: string) => (
    <Menu aria-label="Actions">
      <MenuItem>{variant}</MenuItem>
    </Menu>
  ),
  code: (variant: string) => `<Menu aria-label="Actions">\n  <MenuItem onSelect={run}>${variant}</MenuItem>\n</Menu>`,
} satisfies ComponentExample

export const menuItemIcon = {
  name: "icon",
  description: "An icon before the label, at the menu's size.",
  variants: ICONS,
  default: "none",
  preview: (variant: (typeof ICONS)[number]) => (
    <Menu aria-label="Actions">
      <MenuItem icon={variant === "none" ? undefined : variant}>Edit</MenuItem>
    </Menu>
  ),
  code: (variant: string) => `<Menu aria-label="Actions">\n  <MenuItem${variant === "none" ? "" : ` icon="${variant}"`} onSelect={run}>Edit</MenuItem>\n</Menu>`,
} satisfies ComponentExample

export const menuItemDisabled = {
  name: "disabled",
  description: "Announced (aria-disabled) but not activated: a click, Enter or Space does nothing, and arrow keys skip it.",
  variants: ["false", "true"],
  default: "false",
  preview: (variant: string) => <ReportingMenu disabled={variant === "true"} />,
  code: (variant: string) => `<MenuItem${variant === "true" ? " disabled" : ""} onSelect={edit}>Edit</MenuItem>`,
} satisfies ComponentExample

export const menuItemOnSelect = {
  name: "onSelect",
  description:
    "Runs when the item is activated by a click, Enter or Space. A transient menu then asks to close; call event.preventDefault() to keep it open. A mouse moving over an item focuses it; touch does not.",
  variants: ["handler"],
  default: "handler",
  preview: () => <ReportingMenu />,
  code: () => `<MenuItem onSelect={event => edit()}>Edit</MenuItem>`,
} satisfies ComponentExample

/** Every MenuItem example facet, keyed by prop: each one shown under that prop on the Menu page. */
export const menuItemExamples = {
  children: menuItemChildren,
  icon: menuItemIcon,
  disabled: menuItemDisabled,
  onSelect: menuItemOnSelect,
} satisfies Record<string, ComponentExample>
