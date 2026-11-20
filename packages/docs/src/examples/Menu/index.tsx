// Menu example configs: one ComponentExample per facet, keyed by prop name. ComponentDocs renders each
// entry as a section of the Menu docs page, sorted by name. Every preview is a live, embedded Menu.
import { useState } from "react"
import { Menu, MenuGroup, MenuItem, MenuSeparator } from "@niceprototypes/menu"
import type { MenuAutoFocusType, MenuCloseReasonType, MenuProps } from "@niceprototypes/menu"
import Button from "@niceprototypes/button"
import Flex from "@niceprototypes/flex"
import Ink from "@niceprototypes/ink"
import type { ComponentExample } from "../../dataTables/components/demos/Components"

/** The `children` variants, each a live menu and its code. */
const CHILDREN = {
  items: {
    node: (
      <>
        <MenuItem>New</MenuItem>
        <MenuItem>Open</MenuItem>
        <MenuItem>Save</MenuItem>
      </>
    ),
    code: `<Menu aria-label="File">
  <MenuItem onSelect={create}>New</MenuItem>
  <MenuItem onSelect={open}>Open</MenuItem>
  <MenuItem onSelect={save}>Save</MenuItem>
</Menu>`,
  },
  "groups and separators": {
    node: (
      <>
        <MenuItem>New</MenuItem>
        <MenuItem>Open</MenuItem>
        <MenuSeparator />
        <MenuGroup label="Export">
          <MenuItem>PNG</MenuItem>
          <MenuItem>SVG</MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuItem>Delete</MenuItem>
      </>
    ),
    code: `<Menu aria-label="File">
  <MenuItem onSelect={create}>New</MenuItem>
  <MenuItem onSelect={open}>Open</MenuItem>
  <MenuSeparator />
  <MenuGroup label="Export">
    <MenuItem onSelect={exportPng}>PNG</MenuItem>
    <MenuItem onSelect={exportSvg}>SVG</MenuItem>
  </MenuGroup>
  <MenuSeparator />
  <MenuItem onSelect={remove}>Delete</MenuItem>
</Menu>`,
  },
  icons: {
    node: (
      <>
        <MenuItem icon="edit">Edit</MenuItem>
        <MenuItem icon="copy">Duplicate</MenuItem>
        <MenuItem icon="download">Download</MenuItem>
        <MenuItem icon="trash">Delete</MenuItem>
      </>
    ),
    code: `<Menu aria-label="Actions">
  <MenuItem icon="edit" onSelect={edit}>Edit</MenuItem>
  <MenuItem icon="copy" onSelect={duplicate}>Duplicate</MenuItem>
  <MenuItem icon="download" onSelect={download}>Download</MenuItem>
  <MenuItem icon="trash" onSelect={remove}>Delete</MenuItem>
</Menu>`,
  },
  "disabled items": {
    node: (
      <>
        <MenuItem icon="edit">Edit</MenuItem>
        <MenuItem icon="copy" disabled>
          Duplicate
        </MenuItem>
        <MenuItem icon="download">Download</MenuItem>
        <MenuItem icon="trash" disabled>
          Delete
        </MenuItem>
      </>
    ),
    code: `<Menu aria-label="Actions">
  <MenuItem icon="edit" onSelect={edit}>Edit</MenuItem>
  <MenuItem icon="copy" disabled>Duplicate</MenuItem>
  <MenuItem icon="download" onSelect={download}>Download</MenuItem>
  <MenuItem icon="trash" disabled>Delete</MenuItem>
</Menu>`,
  },
} as const

/** A short menu most facets render. */
const Basic = (props: Partial<MenuProps>) => (
  <Menu aria-label="Actions" {...props}>
    <MenuItem icon="edit">Edit</MenuItem>
    <MenuItem icon="copy">Duplicate</MenuItem>
    <MenuItem icon="trash">Delete</MenuItem>
  </Menu>
)

/** Shows the reason onClose reports (choose an item, press Escape, or press Tab). */
const TransientMenu = () => {
  const [reason, setReason] = useState<MenuCloseReasonType | null>(null)
  return (
    <Flex direction="column" gap="small">
      <Basic onClose={setReason} />
      <Ink code>{reason === null ? "–" : `onClose("${reason}")`}</Ink>
    </Flex>
  )
}

/** Mounts a menu with autoFocus on demand, so the page does not lose focus on load. */
const AutoFocusMenu = ({ edge }: { edge: MenuAutoFocusType }) => {
  const [shown, setShown] = useState(false)
  return (
    <Flex direction="column" gap="small">
      <Button size="small" onClick={() => setShown(current => !current)}>
        {shown ? "Unmount" : "Mount"}
      </Button>
      {shown ? <Basic autoFocus={edge} /> : null}
    </Flex>
  )
}

export const menuChildren = {
  name: "children",
  description:
    "MenuItem, MenuGroup and MenuSeparator elements, in order. Up and Down move through the enabled items and wrap, Home and End reach the ends, a typed letter jumps to the next item starting with it, and Enter or Space runs the focused one. Group labels and separators are passed over; a disabled item is announced but skipped.",
  variants: Object.keys(CHILDREN),
  default: "items",
  preview: (variant: keyof typeof CHILDREN) => <Menu aria-label="Example">{CHILDREN[variant].node}</Menu>,
  code: (variant: keyof typeof CHILDREN) => CHILDREN[variant].code,
} satisfies ComponentExample

export const menuAutoFocus = {
  name: "autoFocus",
  description:
    "The item focused when the menu mounts: the first enabled item, or the last. MenuButton passes \"first\" when opened by a press, Enter, Space or ArrowDown, and \"last\" for ArrowUp. Unset focuses nothing.",
  variants: ["first", "last"],
  default: "first",
  preview: (variant: MenuAutoFocusType) => <AutoFocusMenu edge={variant} />,
  code: (variant: string) => `<Menu aria-label="Actions" autoFocus="${variant}">…</Menu>`,
} satisfies ComponentExample

export const menuOnClose = {
  name: "onClose",
  description:
    "Makes the menu transient: called with \"select\" after an item's onSelect, \"escape\" on Escape and \"tab\" on Tab, which the menu then holds. Leave it out for a menu embedded in a page, where Tab moves on as usual.",
  variants: ["handler"],
  default: "handler",
  preview: () => <TransientMenu />,
  code: () => `<Menu aria-label="Actions" onClose={reason => setOpen(false)}>…</Menu>`,
} satisfies ComponentExample

export const menuSize = {
  name: "size",
  description: "Text size of the item and group labels, and of the item icons.",
  variants: ["small", "base", "large"],
  default: "base",
  preview: (variant: MenuProps["size"]) => <Basic size={variant} />,
  code: (variant: string) => `<Menu aria-label="Actions" size="${variant}">…</Menu>`,
} satisfies ComponentExample

export const menuAriaLabel = {
  name: "aria-label",
  description: "Accessible name of the menu. A menu needs this or aria-labelledby.",
  variants: ["Actions"],
  default: "Actions",
  preview: () => <Basic aria-label="Actions" />,
  code: () => `<Menu aria-label="Actions">…</Menu>`,
} satisfies ComponentExample

export const menuAriaLabelledBy = {
  name: "aria-labelledby",
  description: "Id of the element that names the menu, such as a visible heading above it (MenuButton points it at its trigger).",
  variants: ["heading"],
  default: "heading",
  preview: () => (
    <Flex direction="column" gap="small">
      <Ink id="menu-example-heading" weight="semibold">
        Project
      </Ink>
      <Basic aria-label={undefined} aria-labelledby="menu-example-heading" />
    </Flex>
  ),
  code: () => `<Ink id="project-heading">Project</Ink>
<Menu aria-labelledby="project-heading">…</Menu>`,
} satisfies ComponentExample

export const menuId = {
  name: "id",
  description: "Id of the menu element, for a trigger's aria-controls.",
  variants: ["file-menu"],
  default: "file-menu",
  preview: () => <Basic id="menu-example-id" />,
  code: () => `<Menu id="file-menu" aria-label="File">…</Menu>`,
} satisfies ComponentExample

export const menuTheme = {
  name: "theme",
  description: "Pins token resolution to a theme: the labels, icons and focus highlight take that theme's colours.",
  variants: ["day", "night"],
  default: "day",
  preview: (variant: MenuProps["theme"]) => <Basic theme={variant} />,
  code: (variant: string) => `<Menu aria-label="Actions" theme="${variant}">…</Menu>`,
} satisfies ComponentExample

/** Every Menu example facet, each one a section of the Menu docs page. */
export const menuExamples = {
  children: menuChildren,
  autoFocus: menuAutoFocus,
  onClose: menuOnClose,
  size: menuSize,
  "aria-label": menuAriaLabel,
  "aria-labelledby": menuAriaLabelledBy,
  id: menuId,
  theme: menuTheme,
} satisfies Record<string, ComponentExample>
