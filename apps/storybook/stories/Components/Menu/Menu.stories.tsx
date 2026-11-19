import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, fn, waitFor, within } from "storybook/test"
import { themeTokensData } from "@niceprototypes/styles"
import type { SizeType } from "@niceprototypes/styles"
import { Menu, MenuGroup, MenuItem, MenuSeparator } from "@niceprototypes/menu"
import type { MenuAutoFocusType, MenuProps } from "@niceprototypes/menu"
import LifecycleStory from "@niceprototypes/docs/components/LifecycleStory"

/** Option lists. Union props are typed against the union on disk, so a renamed token fails the build. */
const SIZE_OPTIONS = ["smaller", "small", "base", "large", "larger"] as const satisfies readonly SizeType[]
const AUTO_FOCUS_OPTIONS = ["first", "last"] as const satisfies readonly MenuAutoFocusType[]
const THEME_OPTIONS = Object.keys(themeTokensData)
const ITEMS = ["New", "Open", "PNG", "PDF", "SVG", "Delete"] as const

/** An unset choice for optional selects; `mapping` turns it into `undefined`. */
const NONE = "none"

/**
 * PlaygroundArgs
 *
 * MenuProps with the children built in `render`: `icons` shows item icons, `grouped` puts the
 * export items in a MenuGroup after a MenuSeparator, `disabledItem` disables one item, and
 * `onItemSelect` reports a chosen item's label. `transient` passes `onClose`.
 */
type PlaygroundArgs = Omit<MenuProps, "children" | "onClose"> & {
  icons: boolean
  grouped: boolean
  disabledItem?: (typeof ITEMS)[number]
  transient: boolean
  onClose: NonNullable<MenuProps["onClose"]>
  onItemSelect: (label: string) => void
}

const meta = {
  title: "Components/Menu",
  component: Menu,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Menu>

export default meta

type Story = StoryObj<PlaygroundArgs>

const select = (options: readonly string[], category: string) => ({ control: "select" as const, options, table: { category } })
const optionalSelect = (options: readonly string[], category: string) => ({
  ...select([NONE, ...options], category),
  mapping: { [NONE]: undefined },
})
const HIDDEN = { table: { disable: true } }

/** The File menu for the args. */
const FileMenu = ({ icons, grouped, disabledItem, transient, onClose, onItemSelect, ...rest }: PlaygroundArgs) => {
  const item = (label: (typeof ITEMS)[number], icon?: "plus" | "folder-open" | "photo" | "file" | "code" | "trash") => (
    <MenuItem key={label} icon={icons ? icon : undefined} disabled={label === disabledItem} onSelect={() => onItemSelect(label)}>
      {label}
    </MenuItem>
  )
  const exports = [item("PNG", "photo"), item("PDF", "file"), item("SVG", "code")]
  return (
    <Menu {...rest} onClose={transient ? onClose : undefined}>
      {item("New", "plus")}
      {item("Open", "folder-open")}
      {grouped ? (
        <>
          <MenuSeparator />
          <MenuGroup label="Export">{exports}</MenuGroup>
          <MenuSeparator />
        </>
      ) : (
        exports
      )}
      {item("Delete", "trash")}
    </Menu>
  )
}

export const Playground: Story = {
  args: {
    "aria-label": "File",
    size: "base",
    icons: true,
    grouped: true,
    transient: false,
    onClose: fn(),
    onItemSelect: fn(),
  },
  argTypes: {
    icons: { control: "boolean", table: { category: "Content" } },
    grouped: { control: "boolean", table: { category: "Content" } },
    disabledItem: optionalSelect(ITEMS, "Content"),

    size: select(SIZE_OPTIONS, "Appearance"),
    theme: optionalSelect(THEME_OPTIONS, "Appearance"),

    autoFocus: optionalSelect(AUTO_FOCUS_OPTIONS, "Behaviour"),
    transient: { control: "boolean", table: { category: "Behaviour" } },

    id: { control: "text", table: { category: "Element" } },
    "aria-label": { control: "text", table: { category: "Accessibility" } },
    "aria-labelledby": { control: "text", table: { category: "Accessibility" } },

    onClose: { table: { category: "Events" } },
    onItemSelect: { table: { category: "Events" } },

    ref: HIDDEN,
  },
  render: args => <FileMenu {...args} />,
  play: async ({ canvasElement, args, userEvent }) => {
    const canvas = within(canvasElement)
    const menu = canvas.getByRole("menu", { name: args["aria-label"] })
    const items = canvas.getAllByRole("menuitem")
    await expect(items).toHaveLength(ITEMS.length)
    // One tab stop: Tab lands on the first enabled item.
    await userEvent.tab()
    const enabled = items.filter(element => element.getAttribute("aria-disabled") !== "true")
    await waitFor(() => expect(enabled[0]).toHaveFocus())
    await expect(menu).toHaveAttribute("tabindex", "-1")
  },
}

/** Arrow keys wrap and Home / End reach the ends; typeahead jumps to a label. */
export const Keyboard: Story = {
  ...Playground,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)
    const item = (name: string) => canvas.getByRole("menuitem", { name })
    await userEvent.tab()
    await expect(item("New")).toHaveFocus()
    await userEvent.keyboard("{ArrowUp}")
    await expect(item("Delete")).toHaveFocus()
    await userEvent.keyboard("{ArrowDown}")
    await expect(item("New")).toHaveFocus()
    await userEvent.keyboard("{End}")
    await expect(item("Delete")).toHaveFocus()
    await userEvent.keyboard("{Home}")
    await expect(item("New")).toHaveFocus()
    await userEvent.keyboard("s")
    await expect(item("SVG")).toHaveFocus()
  },
}

/** `disabledItem`: announced as disabled, skipped by the arrow keys, ignored on click. */
export const DisabledItem: Story = {
  ...Playground,
  args: { ...Playground.args, disabledItem: "PDF" },
  play: async ({ canvasElement, args, userEvent }) => {
    const canvas = within(canvasElement)
    const pdf = canvas.getByRole("menuitem", { name: "PDF" })
    await expect(pdf).toHaveAttribute("aria-disabled", "true")
    await expect(getComputedStyle(pdf).color).not.toBe(getComputedStyle(canvas.getByRole("menuitem", { name: "PNG" })).color)
    await userEvent.click(pdf)
    await expect(args.onItemSelect).not.toHaveBeenCalled()
    canvas.getByRole("menuitem", { name: "PNG" }).focus()
    await userEvent.keyboard("{ArrowDown}")
    await expect(canvas.getByRole("menuitem", { name: "SVG" })).toHaveFocus()
  },
}

/** `grouped`: a MenuGroup named by its label, between two separators. */
export const Grouped: Story = {
  ...Playground,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole("group", { name: "Export" })).toContainElement(canvas.getByRole("menuitem", { name: "PNG" }))
    await expect(canvas.getAllByRole("separator")).toHaveLength(2)
  },
}

/** `icons`: each item's icon before its label, hidden from assistive technology. */
export const Icons: Story = {
  ...Playground,
  play: async ({ canvasElement }) => {
    const item = within(canvasElement).getByRole("menuitem", { name: "New" })
    await expect(item.querySelector('[data-icon="plus"]')?.closest('[aria-hidden="true"]')).not.toBeNull()
  },
}

/** `autoFocus="last"`: the last enabled item takes focus on mount. */
export const AutoFocus: Story = {
  ...Playground,
  args: { ...Playground.args, autoFocus: "last" },
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(within(canvasElement).getByRole("menuitem", { name: "Delete" })).toHaveFocus())
  },
}

/** `transient` (onClose): Enter reports "select" after onSelect; Escape and Tab report themselves. */
export const Transient: Story = {
  ...Playground,
  args: { ...Playground.args, transient: true },
  play: async ({ canvasElement, args, userEvent }) => {
    const canvas = within(canvasElement)
    canvas.getByRole("menuitem", { name: "Open" }).focus()
    await userEvent.keyboard("{Enter}")
    await expect(args.onItemSelect).toHaveBeenLastCalledWith("Open")
    await expect(args.onClose).toHaveBeenLastCalledWith("select")
    await userEvent.keyboard("{Escape}")
    await expect(args.onClose).toHaveBeenLastCalledWith("escape")
    await userEvent.tab()
    await expect(args.onClose).toHaveBeenLastCalledWith("tab")
    await expect(canvas.getByRole("menuitem", { name: "Open" })).toHaveFocus()
  },
}

/** `size`: the labels follow the text size. */
export const Size: Story = {
  ...Playground,
  args: { ...Playground.args, size: "large" },
  play: async ({ canvasElement }) => {
    const label = within(canvasElement).getByText("New")
    await expect(parseFloat(getComputedStyle(label).fontSize)).toBeGreaterThan(14)
  },
}

/** Mobile: each item is at least 24px tall (the touch-target floor on coarse pointers). */
export const TouchTarget: Story = {
  ...Playground,
  args: { ...Playground.args, size: "smaller" },
  play: async ({ canvasElement }) => {
    for (const item of within(canvasElement).getAllByRole("menuitem")) {
      await expect(item.getBoundingClientRect().height).toBeGreaterThanOrEqual(24)
    }
  },
}

/** Plain, with icons, grouped, a disabled item, and larger text: each in turn. */
export const Lifecycle: Story = {
  args: Playground.args,
  render: () => {
    const base: PlaygroundArgs = {
      "aria-label": "File",
      icons: false,
      grouped: false,
      transient: false,
      onClose: () => {},
      onItemSelect: () => {},
    }
    return (
      <LifecycleStory<PlaygroundArgs>
        steps={[
          { label: "plain", props: base },
          { label: "icons", props: { ...base, icons: true } },
          { label: "groups and separators", props: { ...base, icons: true, grouped: true } },
          { label: "disabled item", props: { ...base, icons: true, grouped: true, disabledItem: "PDF" } },
          { label: "size large", props: { ...base, icons: true, grouped: true, size: "large" } },
        ]}
        render={props => <FileMenu {...props} />}
      />
    )
  },
}
