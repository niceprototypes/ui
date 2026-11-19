import { useEffect, useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { useArgs } from "storybook/preview-api"
import { expect, fn, waitFor, within } from "storybook/test"
import { themeTokensData } from "@niceprototypes/styles"
import type { SizeType } from "@niceprototypes/styles"
import type { IconNameType } from "@niceprototypes/icon"
import Dialog from "@niceprototypes/dialog"
import Flex from "@niceprototypes/flex"
import { MenuButton } from "@niceprototypes/menu"
import type { MenuButtonAlignType, MenuButtonAppearanceType, MenuButtonItemsType, MenuButtonPositionType, MenuButtonProps } from "@niceprototypes/menu"
import LifecycleStory from "@niceprototypes/docs/components/LifecycleStory"

/** Option lists. Union props are typed against the union on disk, so a renamed token fails the build. */
const SIZE_OPTIONS = ["smaller", "small", "base", "large", "larger"] as const satisfies readonly SizeType[]
const APPEARANCE_OPTIONS = ["button", "select"] as const satisfies readonly MenuButtonAppearanceType[]
const POSITION_OPTIONS = ["bottom", "top", "left", "right"] as const satisfies readonly MenuButtonPositionType[]
const ALIGN_OPTIONS = ["start", "center", "end"] as const satisfies readonly MenuButtonAlignType[]
const ICON_OPTIONS = ["menu", "cog", "plus", "download"] as const satisfies readonly IconNameType[]
const THEME_OPTIONS = Object.keys(themeTokensData)

/** An unset choice for optional selects; `mapping` turns it into `undefined`. */
const NONE = "none"

/** The `items` arg presets. */
const ITEM_SETS = ["plain", "grouped", "long"] as const
type ItemSetType = (typeof ITEM_SETS)[number]

/** Items for a preset; each onSelect reports its id. `disabledItem` disables one item by id. */
const makeItems = (set: ItemSetType, onSelect: (id: string) => void, disabledItem?: string): MenuButtonItemsType => {
  const item = (id: string, label: string, icon?: IconNameType) => ({
    id,
    label,
    icon,
    disabled: id === disabledItem ? true : undefined,
    onSelect: () => onSelect(id),
  })
  if (set === "long") return Array.from({ length: 24 }, (_, index) => item(`port-${4000 + index}`, `Open port ${4000 + index}`))
  if (set === "grouped") {
    return [
      item("edit", "Edit", "edit"),
      item("duplicate", "Duplicate", "copy"),
      { type: "separator", id: "s1" },
      { type: "group", id: "export", label: "Export", items: [item("png", "PNG", "photo"), item("pdf", "PDF", "file")] },
      { type: "separator", id: "s2" },
      item("delete", "Delete", "trash"),
    ]
  }
  return [item("edit", "Edit"), item("duplicate", "Duplicate"), item("archive", "Archive"), item("delete", "Delete")]
}

/**
 * PlaygroundArgs
 *
 * MenuButtonProps with `items` as a preset name, plus `disabledItem` (disables one item by id) and
 * `onItemSelect` (reports a chosen item's id). `open` is kept in sync through useArgs.
 */
type PlaygroundArgs = Omit<MenuButtonProps, "items" | "label" | "aria-label"> & {
  label?: string
  "aria-label"?: string
  items: ItemSetType
  disabledItem?: string
  onItemSelect: (id: string) => void
}

const meta = {
  title: "Components/MenuButton",
  component: MenuButton,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof MenuButton>

export default meta

type Story = StoryObj<PlaygroundArgs>

const select = (options: readonly string[], category: string) => ({ control: "select" as const, options, table: { category } })
const optionalSelect = (options: readonly string[], category: string) => ({
  ...select([NONE, ...options], category),
  mapping: { [NONE]: undefined },
})
const HIDDEN = { table: { disable: true } }

/** The rendered menu, portalled to `<body>` outside the canvas. */
const getMenu = () => within(document.body).queryByRole("menu")

export const Playground: Story = {
  args: {
    label: "Actions",
    items: "grouped",
    appearance: "button",
    ghost: false,
    size: "base",
    disabled: false,
    open: false,
    position: "bottom",
    align: "start",
    onOpenChange: fn(),
    onItemSelect: fn(),
  },
  argTypes: {
    items: select(ITEM_SETS, "Content"),
    disabledItem: optionalSelect(["edit", "duplicate", "png", "pdf", "delete", "archive"], "Content"),
    label: { control: "text", table: { category: "Content" } },
    placeholder: { control: "text", table: { category: "Content" } },
    icon: optionalSelect(ICON_OPTIONS, "Content"),

    appearance: select(APPEARANCE_OPTIONS, "Appearance"),
    ghost: { control: "boolean", table: { category: "Appearance" } },
    size: select(SIZE_OPTIONS, "Appearance"),
    theme: optionalSelect(THEME_OPTIONS, "Appearance"),

    position: select(POSITION_OPTIONS, "Layout"),
    align: select(ALIGN_OPTIONS, "Layout"),

    disabled: { control: "boolean", table: { category: "State" } },
    open: { control: "boolean", table: { category: "State" } },

    "aria-label": { control: "text", table: { category: "Accessibility" } },

    onOpenChange: { table: { category: "Events" } },
    onItemSelect: { table: { category: "Events" } },

    ref: HIDDEN,
  },
  render: function Render({ items, disabledItem, onItemSelect, open, onOpenChange, label, "aria-label": ariaLabel, ...rest }) {
    const [, updateArgs] = useArgs<PlaygroundArgs>()
    // Local mirror of `open`: the test runner renders without a manager, so updateArgs alone
    // does not re-render there.
    const [isOpen, setOpen] = useState(open)
    useEffect(() => setOpen(open), [open])
    const name = label !== undefined ? { label, "aria-label": ariaLabel } : { "aria-label": ariaLabel ?? "Actions" }
    const props: MenuButtonProps = {
      ...rest,
      ...name,
      items: makeItems(items, onItemSelect, disabledItem),
      open: isOpen,
      onOpenChange: next => {
        onOpenChange?.(next)
        setOpen(next)
        updateArgs({ open: next })
      },
    }
    return <MenuButton {...props} />
  },
  play: async ({ canvasElement, args, userEvent }) => {
    const trigger = within(canvasElement).getByRole("button", { name: args["aria-label"] ?? args.label })
    await expect(trigger).toHaveAttribute("aria-haspopup", "menu")
    if (args.disabled) return
    await userEvent.click(trigger)
    const menu = await waitFor(() => {
      const element = getMenu()
      expect(element).not.toBeNull()
      return element as HTMLElement
    })
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    await expect(trigger).toHaveAttribute("aria-controls", menu.id)
    const first = within(menu).getAllByRole("menuitem").find(element => element.getAttribute("aria-disabled") !== "true")
    await waitFor(() => expect(first).toHaveFocus())
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(getMenu()).toBeNull())
    await expect(trigger).toHaveFocus()
  },
}

/** `items`: items, separators and a labelled group; Enter on an item runs it, closes the menu and returns focus. */
export const Items: Story = {
  ...Playground,
  args: { ...Playground.args, items: "grouped" },
  play: async ({ canvasElement, args, userEvent }) => {
    const trigger = within(canvasElement).getByRole("button", { name: "Actions" })
    await userEvent.click(trigger)
    const menu = await waitFor(() => within(document.body).getByRole("menu"))
    await expect(within(menu).getAllByRole("separator")).toHaveLength(2)
    await expect(within(menu).getByRole("group", { name: "Export" })).toBeInTheDocument()
    await waitFor(() => expect(within(menu).getByRole("menuitem", { name: "Edit" })).toHaveFocus())
    await userEvent.keyboard("{ArrowDown}{ArrowDown}{Enter}")
    await expect(args.onItemSelect).toHaveBeenLastCalledWith("png")
    await waitFor(() => expect(getMenu()).toBeNull())
    await expect(trigger).toHaveFocus()
  },
}

/** `disabledItem`: a disabled item is announced but skipped by the arrow keys. */
export const DisabledItem: Story = {
  ...Playground,
  args: { ...Playground.args, items: "plain", disabledItem: "duplicate" },
  play: async ({ canvasElement, userEvent }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Actions" }))
    const menu = await waitFor(() => within(document.body).getByRole("menu"))
    await expect(within(menu).getByRole("menuitem", { name: "Duplicate" })).toHaveAttribute("aria-disabled", "true")
    await waitFor(() => expect(within(menu).getByRole("menuitem", { name: "Edit" })).toHaveFocus())
    await userEvent.keyboard("{ArrowDown}")
    await expect(within(menu).getByRole("menuitem", { name: "Archive" })).toHaveFocus()
    await userEvent.keyboard("{Escape}")
  },
}

/** Icon-only: no `label`, the "menu" icon, named by `aria-label`; the trigger keeps a 24px target. */
export const IconOnly: Story = {
  ...Playground,
  args: { ...Playground.args, label: undefined, "aria-label": "Row actions", ghost: true, size: "smaller", align: "end" },
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", { name: "Row actions" })
    await expect(trigger.textContent).toBe("")
    await expect(trigger.querySelector('[data-icon="menu"]')).not.toBeNull()
    const box = trigger.getBoundingClientRect()
    await expect(box.width).toBeGreaterThanOrEqual(24)
    await expect(box.height).toBeGreaterThanOrEqual(24)
  },
}

/** `appearance="select"` with `placeholder`: a ghost select's look, placeholder then caret. */
export const SelectAppearance: Story = {
  ...Playground,
  args: { ...Playground.args, label: undefined, "aria-label": "Bulk actions", appearance: "select", ghost: true, placeholder: "None selected", disabled: true },
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", { name: "Bulk actions" })
    await expect(trigger).toHaveTextContent("None selected")
    await expect(trigger).toBeDisabled()
    await expect(trigger.querySelector('[data-icon="carat-bottom"]')).not.toBeNull()
  },
}

/** ArrowUp on the trigger opens the menu on its last item. */
export const ArrowUpOpensOnLast: Story = {
  ...Playground,
  args: { ...Playground.args, items: "plain" },
  play: async ({ canvasElement, userEvent }) => {
    within(canvasElement).getByRole("button", { name: "Actions" }).focus()
    await userEvent.keyboard("{ArrowUp}")
    const menu = await waitFor(() => within(document.body).getByRole("menu"))
    await waitFor(() => expect(within(menu).getByRole("menuitem", { name: "Delete" })).toHaveFocus())
    await userEvent.keyboard("{Escape}")
  },
}

/** `long` items: the menu stops at the popover's max height and scrolls; End reaches the last item. */
export const LongList: Story = {
  ...Playground,
  args: { ...Playground.args, items: "long" },
  play: async ({ canvasElement, userEvent }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Actions" }))
    const menu = await waitFor(() => within(document.body).getByRole("menu"))
    const surface = menu.parentElement as HTMLElement
    await expect(surface.scrollHeight).toBeGreaterThan(surface.clientHeight)
    await waitFor(() => expect(within(menu).getAllByRole("menuitem")[0]).toHaveFocus())
    await userEvent.keyboard("{End}")
    await expect(within(menu).getByRole("menuitem", { name: "Open port 4023" })).toHaveFocus()
    await userEvent.keyboard("{Escape}")
  },
}

/** A trigger at the right edge with `align="start"`: the menu shifts left to stay in the viewport. */
export const RightEdge: Story = {
  ...Playground,
  args: { ...Playground.args, items: "grouped", label: "Overflow" },
  render: args => (
    <Flex justifyContent="flex-end">{Playground.render!(args, {} as never)}</Flex>
  ),
  play: async ({ canvasElement, userEvent }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Overflow" }))
    const menu = await waitFor(() => within(document.body).getByRole("menu"))
    await waitFor(() => expect(getComputedStyle(menu.parentElement as HTMLElement).visibility).toBe("visible"))
    const box = (menu.parentElement as HTMLElement).getBoundingClientRect()
    await expect(box.right).toBeLessThanOrEqual(window.innerWidth)
    await expect(box.left).toBeGreaterThanOrEqual(0)
    await userEvent.keyboard("{Escape}")
  },
}

/** Inside a modal Dialog (top layer): the menu shows above the dialog and its items take a click. */
export const InDialog: Story = {
  ...Playground,
  args: { ...Playground.args, items: "plain" },
  render: function Render(args) {
    return (
      <Dialog open title="Project">
        {Playground.render!(args, {} as never)}
      </Dialog>
    )
  },
  play: async ({ args, userEvent }) => {
    const dialog = within(document.body).getByRole("dialog", { name: "Project" })
    await userEvent.click(within(dialog).getByRole("button", { name: "Actions" }))
    const menu = await waitFor(() => within(document.body).getByRole("menu"))
    const edit = within(menu).getByRole("menuitem", { name: "Edit" })
    await waitFor(() => expect(edit).toHaveFocus())
    // The element at the item's centre is the item: the menu is on top, not under the dialog.
    const box = edit.getBoundingClientRect()
    await expect(edit.contains(document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2))).toBe(true)
    await userEvent.click(edit)
    await expect(args.onItemSelect).toHaveBeenLastCalledWith("edit")
    // Escape in the menu closes the menu only; the dialog stays open.
    await userEvent.click(within(dialog).getByRole("button", { name: "Actions" }))
    await waitFor(() => expect(within(document.body).getByRole("menuitem", { name: "Edit" })).toHaveFocus())
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(getMenu()).toBeNull())
    await expect(within(document.body).getByRole("dialog", { name: "Project" })).toBeVisible()
  },
}

/** Closed, open, a disabled item, groups, icon-only, the select look, and disabled: each state in turn. */
export const Lifecycle: Story = {
  args: Playground.args,
  render: () => {
    const noop = () => {}
    return (
      <LifecycleStory<MenuButtonProps>
        steps={[
          { label: "closed", props: { label: "Actions", items: makeItems("plain", noop) } },
          { label: "open", props: { label: "Actions", items: makeItems("plain", noop), open: true } },
          { label: "disabled item", props: { label: "Actions", items: makeItems("plain", noop, "duplicate"), open: true } },
          { label: "groups and icons", props: { label: "Actions", items: makeItems("grouped", noop), open: true } },
          { label: "icon-only", props: { "aria-label": "Row actions", ghost: true, size: "smaller", items: makeItems("plain", noop), open: true } },
          { label: "select, none selected", props: { "aria-label": "Bulk actions", appearance: "select", ghost: true, placeholder: "None selected", disabled: true, items: makeItems("plain", noop) } },
          { label: "select, 12 selected", props: { label: "12 selected", appearance: "select", ghost: true, items: makeItems("plain", noop), open: true } },
        ]}
        render={props => <MenuButton {...props} />}
      />
    )
  },
}
