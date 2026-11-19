import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, fn, within } from "storybook/test"
import type { IconNameType } from "@niceprototypes/icon"
import { Menu, MenuItem } from "@niceprototypes/menu"
import type { MenuItemProps } from "@niceprototypes/menu"

/** Icons for `icon`. */
const ICON_OPTIONS = ["edit", "copy", "trash", "download"] as const satisfies readonly IconNameType[]
const NONE = "none"

/**
 * PlaygroundArgs
 *
 * MenuItemProps with `children` as text. The item renders inside a Menu, as it must.
 */
type PlaygroundArgs = Omit<MenuItemProps, "children"> & { children: string }

const meta = {
  title: "Components/MenuItem",
  // A subcomponent: documented on its parent's page; its stories run as tests only.
  tags: ["!dev"],
  component: MenuItem,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof MenuItem>

export default meta

type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  args: {
    children: "Edit",
    icon: "edit",
    disabled: false,
    onSelect: fn(),
  },
  argTypes: {
    children: { control: "text", table: { category: "Content" } },
    icon: { control: "select", options: [NONE, ...ICON_OPTIONS], mapping: { [NONE]: undefined }, table: { category: "Content" } },
    disabled: { control: "boolean", table: { category: "State" } },
    onSelect: { table: { category: "Events" } },
  },
  render: args => (
    <Menu aria-label="Actions">
      <MenuItem {...args} />
    </Menu>
  ),
  play: async ({ canvasElement, args, userEvent }) => {
    const item = within(canvasElement).getByRole("menuitem", { name: args.children })
    await userEvent.click(item)
    if (args.disabled) {
      await expect(item).toHaveAttribute("aria-disabled", "true")
      await expect(args.onSelect).not.toHaveBeenCalled()
    } else {
      await expect(args.onSelect).toHaveBeenCalledTimes(1)
    }
  },
}

/** `disabled`: announced, not activated. */
export const Disabled: Story = {
  ...Playground,
  args: { ...Playground.args, disabled: true },
}
