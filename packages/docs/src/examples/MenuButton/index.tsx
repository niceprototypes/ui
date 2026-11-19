// MenuButton example configs: one ComponentExample per facet, keyed by prop name, plus layout facets
// (right edge, phone width). ComponentDocs renders each entry as a section of the MenuButton docs page,
// sorted by name. Every preview is a live MenuButton: press it, or focus it and press ArrowDown / ArrowUp.
import { useState } from "react"
import { MenuButton } from "@niceprototypes/menu"
import type { MenuButtonItemsType, MenuButtonProps } from "@niceprototypes/menu"
import Button from "@niceprototypes/button"
import Flex from "@niceprototypes/flex"
import Ink from "@niceprototypes/ink"
import { setTokens } from "@niceprototypes/styles"
import type { ComponentExample } from "../../dataTables/components/demos/Components"

/** The phone-width frame (a 360px handset) and the right-edge strip, from a project token map. */
const getToken = setTokens({ frame: { phone: "360px", strip: "100%" } }, "menuButtonExamples")

const noop = () => {}

/** The `items` variants. */
const ITEMS: Record<string, { items: MenuButtonItemsType; code: string }> = {
  items: {
    items: [
      { id: "edit", label: "Edit", onSelect: noop },
      { id: "duplicate", label: "Duplicate", onSelect: noop },
      { id: "delete", label: "Delete", onSelect: noop },
    ],
    code: `const items = [
  { id: "edit", label: "Edit", onSelect: edit },
  { id: "duplicate", label: "Duplicate", onSelect: duplicate },
  { id: "delete", label: "Delete", onSelect: remove },
]`,
  },
  "groups and separators": {
    items: [
      { id: "edit", label: "Edit", onSelect: noop },
      { id: "duplicate", label: "Duplicate", onSelect: noop },
      { type: "separator", id: "s1" },
      {
        type: "group",
        id: "export",
        label: "Export",
        items: [
          { id: "png", label: "PNG", onSelect: noop },
          { id: "svg", label: "SVG", onSelect: noop },
        ],
      },
      { type: "separator", id: "s2" },
      { id: "delete", label: "Delete", onSelect: noop },
    ],
    code: `const items = [
  { id: "edit", label: "Edit", onSelect: edit },
  { id: "duplicate", label: "Duplicate", onSelect: duplicate },
  { type: "separator", id: "s1" },
  {
    type: "group",
    id: "export",
    label: "Export",
    items: [
      { id: "png", label: "PNG", onSelect: exportPng },
      { id: "svg", label: "SVG", onSelect: exportSvg },
    ],
  },
  { type: "separator", id: "s2" },
  { id: "delete", label: "Delete", onSelect: remove },
]`,
  },
  icons: {
    items: [
      { id: "edit", label: "Edit", icon: "edit", onSelect: noop },
      { id: "duplicate", label: "Duplicate", icon: "copy", onSelect: noop },
      { id: "download", label: "Download", icon: "download", onSelect: noop },
      { id: "delete", label: "Delete", icon: "trash", onSelect: noop },
    ],
    code: `const items = [
  { id: "edit", label: "Edit", icon: "edit", onSelect: edit },
  { id: "duplicate", label: "Duplicate", icon: "copy", onSelect: duplicate },
  { id: "download", label: "Download", icon: "download", onSelect: download },
  { id: "delete", label: "Delete", icon: "trash", onSelect: remove },
]`,
  },
  "disabled items": {
    items: [
      { id: "start", label: "Start all", onSelect: noop },
      { id: "stop", label: "Stop all", disabled: true, onSelect: noop },
      { id: "restart", label: "Restart", onSelect: noop },
    ],
    code: `const items = [
  { id: "start", label: "Start all", onSelect: startAll },
  { id: "stop", label: "Stop all", disabled: true, onSelect: stopAll },
  { id: "restart", label: "Restart", onSelect: restart },
]`,
  },
  "long list": {
    items: Array.from({ length: 30 }, (_, index) => ({ id: `port-${4000 + index}`, label: `Open port ${4000 + index}`, onSelect: noop })),
    code: `// 30 items: the menu stops at the popover's max height and scrolls; End reaches the last.
const items = ports.map(port => ({ id: port, label: \`Open port \${port}\`, onSelect: () => openPort(port) }))`,
  },
}

/** The plain items most facets render. */
const BASIC = ITEMS.items.items

/** A labelled MenuButton with the plain items, overridden per facet. */
const Basic = (props: Partial<MenuButtonProps>) => <MenuButton label="Actions" items={BASIC} {...(props as object)} />

/** Shows the id of the item chosen. */
const ReportingMenuButton = () => {
  const [last, setLast] = useState<string | null>(null)
  const items: MenuButtonItemsType = ["Edit", "Duplicate", "Delete"].map(label => ({ id: label, label, onSelect: () => setLast(label) }))
  return (
    <Flex direction="column" gap="small" alignItems="flex-start">
      <MenuButton label="Actions" items={items} />
      <Ink code>{last === null ? "–" : `onSelect → ${last}`}</Ink>
    </Flex>
  )
}

/** A controlled MenuButton, also opened and closed by a separate button. */
const ControlledMenuButton = () => {
  const [open, setOpen] = useState(false)
  return (
    <Flex gap="small" alignItems="center">
      <MenuButton label="Actions" items={BASIC} open={open} onOpenChange={setOpen} />
      <Button size="small" ghost onClick={() => setOpen(current => !current)}>
        {open ? "Close from outside" : "Open from outside"}
      </Button>
    </Flex>
  )
}

/** Shows each open state onOpenChange asks for. */
const ReportingOpenChange = () => {
  const [log, setLog] = useState<boolean[]>([])
  return (
    <Flex direction="column" gap="small" alignItems="flex-start">
      <MenuButton label="Actions" items={BASIC} onOpenChange={next => setLog(current => [...current.slice(-3), next])} />
      <Ink code>{log.length ? log.map(entry => `onOpenChange(${entry})`).join(" · ") : "–"}</Ink>
    </Flex>
  )
}

export const menuButtonItems = {
  name: "items",
  description:
    "Required. The menu's entries: items ({ id, label, icon?, disabled?, onSelect }), separators ({ type: \"separator\", id }) and labelled groups ({ type: \"group\", id, label, items }). Choosing an item closes the menu, returns focus to the trigger, then runs its onSelect. A disabled item is announced but skipped. A long list stops at the popover's max height and scrolls.",
  variants: Object.keys(ITEMS),
  default: "items",
  preview: (variant: string) => <Basic items={ITEMS[variant].items} />,
  code: (variant: string) => `${ITEMS[variant].code}

<MenuButton label="Actions" items={items} />`,
} satisfies ComponentExample

export const menuButtonLabel = {
  name: "label",
  description: "The trigger's visible text; it also names the menu. Without it the trigger is icon-only and needs aria-label.",
  variants: ["Actions", "More options"],
  default: "Actions",
  preview: (variant: string) => <Basic label={variant} />,
  code: (variant: string) => `<MenuButton label="${variant}" items={items} />`,
} satisfies ComponentExample

export const menuButtonAriaLabel = {
  name: "aria-label",
  description:
    "Accessible name of the trigger and the menu. Required for an icon-only trigger (no label), which shows the menu icon (two lines); with a label, start it with the label's words so voice control finds it.",
  variants: ["icon-only", "icon-only, ghost, smaller"],
  default: "icon-only",
  preview: (variant: string) =>
    variant === "icon-only" ? (
      <MenuButton aria-label="More options" items={BASIC} />
    ) : (
      <MenuButton aria-label="Row actions" items={BASIC} ghost size="smaller" align="end" />
    ),
  code: (variant: string) =>
    variant === "icon-only"
      ? `<MenuButton aria-label="More options" items={items} />`
      : `<MenuButton aria-label="Row actions" items={items} ghost size="smaller" align="end" />`,
} satisfies ComponentExample

export const menuButtonIcon = {
  name: "icon",
  description: "Icon before the trigger's text. Without a label it defaults to \"menu\".",
  variants: ["menu", "cog", "plus"],
  default: "menu",
  preview: (variant: MenuButtonProps["icon"]) => <Basic icon={variant} label={variant === "menu" ? undefined : "Actions"} aria-label="Actions" />,
  code: (variant: string) =>
    variant === "menu" ? `<MenuButton aria-label="Actions" items={items} />` : `<MenuButton label="Actions" icon="${variant}" items={items} />`,
} satisfies ComponentExample

export const menuButtonAppearance = {
  name: "appearance",
  description:
    "The trigger's look: a Button, or a select field's look for a menu chosen like a value, with the label (or placeholder) at the start and a caret at the end. Its items are still commands (menuitems), not values.",
  variants: ["button", "select"],
  default: "button",
  preview: (variant: MenuButtonProps["appearance"]) => <Basic appearance={variant} label="12 selected" />,
  code: (variant: string) => `<MenuButton appearance="${variant}" label="12 selected" items={items} />`,
} satisfies ComponentExample

export const menuButtonPlaceholder = {
  name: "placeholder",
  description: "Text a select-look trigger shows while there is no label, in the placeholder colour (the disabled colour while disabled).",
  variants: ["enabled", "disabled"],
  default: "disabled",
  preview: (variant: string) => (
    <MenuButton appearance="select" ghost placeholder="None selected" aria-label="Bulk actions" items={BASIC} disabled={variant === "disabled"} />
  ),
  code: (variant: string) =>
    `<MenuButton appearance="select" ghost placeholder="None selected" aria-label="Bulk actions" items={items}${variant === "disabled" ? " disabled" : ""} />`,
} satisfies ComponentExample

export const menuButtonGhost = {
  name: "ghost",
  description: "A transparent trigger at rest, its background and border showing on hover and focus (Button's ghost).",
  variants: ["false", "true"],
  default: "false",
  preview: (variant: string) => <Basic ghost={variant === "true"} />,
  code: (variant: string) => (variant === "true" ? `<MenuButton label="Actions" ghost items={items} />` : `<MenuButton label="Actions" items={items} />`),
} satisfies ComponentExample

export const menuButtonSize = {
  name: "size",
  description: "Size of the trigger (Button's size). The smallest, 24px, still meets the touch-target floor.",
  variants: ["smaller", "small", "base", "large", "larger"],
  default: "base",
  preview: (variant: MenuButtonProps["size"]) => <Basic size={variant} />,
  code: (variant: string) => `<MenuButton label="Actions" size="${variant}" items={items} />`,
} satisfies ComponentExample

export const menuButtonDisabled = {
  name: "disabled",
  description: "Disables the trigger; the menu cannot open.",
  variants: ["false", "true"],
  default: "false",
  preview: (variant: string) => <Basic disabled={variant === "true"} />,
  code: (variant: string) => (variant === "true" ? `<MenuButton label="Actions" disabled items={items} />` : `<MenuButton label="Actions" items={items} />`),
} satisfies ComponentExample

export const menuButtonOpen = {
  name: "open",
  description: "Controls the open state, paired with onOpenChange. A menu opened by the prop does not take focus from the page; ArrowDown on the trigger moves into it.",
  variants: ["controlled"],
  default: "controlled",
  preview: () => <ControlledMenuButton />,
  code: () => `const [open, setOpen] = useState(false)

<MenuButton label="Actions" items={items} open={open} onOpenChange={setOpen} />`,
} satisfies ComponentExample

export const menuButtonOnOpenChange = {
  name: "onOpenChange",
  description: "Called with the open state asked for: true on a press, Enter, Space, ArrowDown or ArrowUp; false on a choice, Escape, Tab, a press outside or a second press.",
  variants: ["handler"],
  default: "handler",
  preview: () => <ReportingOpenChange />,
  code: () => `<MenuButton label="Actions" items={items} onOpenChange={open => track(open)} />`,
} satisfies ComponentExample

export const menuButtonOnSelect = {
  name: "item onSelect",
  description: "Runs after the menu closed and focus returned to the trigger, so it can move focus elsewhere (open a dialog).",
  variants: ["handler"],
  default: "handler",
  preview: () => <ReportingMenuButton />,
  code: () => `const items = [{ id: "edit", label: "Edit", onSelect: () => openEditor() }]`,
} satisfies ComponentExample

export const menuButtonPosition = {
  name: "position",
  description: "Side of the trigger the menu opens on; it flips to the other side when this one has no room.",
  variants: ["bottom", "top", "right", "left"],
  default: "bottom",
  preview: (variant: MenuButtonProps["position"]) => <Basic position={variant} />,
  code: (variant: string) => `<MenuButton label="Actions" position="${variant}" items={items} />`,
} satisfies ComponentExample

export const menuButtonAlign = {
  name: "align",
  description: "Alignment of the menu along the trigger: its start, centre or end edge. A row's actions menu at the right end uses \"end\".",
  variants: ["start", "center", "end"],
  default: "start",
  preview: (variant: MenuButtonProps["align"]) => <Basic align={variant} label="A wide trigger label" />,
  code: (variant: string) => `<MenuButton label="A wide trigger label" align="${variant}" items={items} />`,
} satisfies ComponentExample

export const menuButtonTheme = {
  name: "theme",
  description: "Pins token resolution to a theme on both the trigger and the menu.",
  variants: ["day", "night"],
  default: "day",
  preview: (variant: MenuButtonProps["theme"]) => <Basic theme={variant} />,
  code: (variant: string) => `<MenuButton label="Actions" theme="${variant}" items={items} />`,
} satisfies ComponentExample

export const menuButtonRightEdge = {
  name: "right edge",
  description:
    "A trigger against the right edge with align=\"start\": the menu would cross the viewport edge, so it shifts back inside. Near the bottom of the window it flips to open above.",
  variants: ["align start"],
  default: "align start",
  preview: () => (
    <Flex justifyContent="flex-end" style={{ width: getToken("menuButtonExamples.frame:strip") }}>
      <MenuButton label="Overflow" items={ITEMS["groups and separators"].items} />
    </Flex>
  ),
  code: () => `<Flex justifyContent="flex-end">
  <MenuButton label="Overflow" items={items} />
</Flex>`,
} satisfies ComponentExample

export const menuButtonPhoneWidth = {
  name: "phone width",
  description:
    "A 360px handset row: a title with an icon-only, ghost trigger at its end (align=\"end\"). The trigger keeps a 24px target, the menu stays on screen, and every item is at least 24px tall on a coarse pointer. Nothing depends on hover.",
  variants: ["header row"],
  default: "header row",
  preview: () => (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      gap="small"
      style={{ width: getToken("menuButtonExamples.frame:phone"), maxWidth: getToken("menuButtonExamples.frame:strip") }}
    >
      <Ink weight="semibold">animation-studio</Ink>
      <MenuButton aria-label="Project actions" ghost size="smaller" align="end" items={ITEMS.icons.items} />
    </Flex>
  ),
  code: () => `<Flex justifyContent="space-between" alignItems="center">
  <Ink weight="semibold">animation-studio</Ink>
  <MenuButton aria-label="Project actions" ghost size="smaller" align="end" items={items} />
</Flex>`,
} satisfies ComponentExample

/** Every MenuButton example facet, each one a section of the MenuButton docs page. */
export const menuButtonExamples = {
  items: menuButtonItems,
  label: menuButtonLabel,
  "aria-label": menuButtonAriaLabel,
  icon: menuButtonIcon,
  appearance: menuButtonAppearance,
  placeholder: menuButtonPlaceholder,
  ghost: menuButtonGhost,
  size: menuButtonSize,
  disabled: menuButtonDisabled,
  open: menuButtonOpen,
  onOpenChange: menuButtonOnOpenChange,
  onSelect: menuButtonOnSelect,
  position: menuButtonPosition,
  align: menuButtonAlign,
  theme: menuButtonTheme,
  rightEdge: menuButtonRightEdge,
  phoneWidth: menuButtonPhoneWidth,
} satisfies Record<string, ComponentExample>
