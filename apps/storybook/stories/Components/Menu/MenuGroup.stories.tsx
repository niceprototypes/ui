import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, within } from "storybook/test"
import { Menu, MenuGroup, MenuItem } from "@niceprototypes/menu"
import type { MenuGroupProps } from "@niceprototypes/menu"

/**
 * PlaygroundArgs
 *
 * MenuGroupProps with `label` as text; the group holds two items inside a Menu.
 */
type PlaygroundArgs = Omit<MenuGroupProps, "label" | "children"> & { label: string }

const meta = {
  title: "Components/MenuGroup",
  // A subcomponent: documented on its parent's page; its stories run as tests only.
  tags: ["!dev"],
  component: MenuGroup,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof MenuGroup>

export default meta

type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  args: { label: "Sort by" },
  argTypes: {
    label: { control: "text", table: { category: "Content" } },
  },
  render: args => (
    <Menu aria-label="View">
      <MenuGroup {...args}>
        <MenuItem>Name</MenuItem>
        <MenuItem>Date</MenuItem>
      </MenuGroup>
    </Menu>
  ),
  play: async ({ canvasElement, args, userEvent }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole("group", { name: args.label })).toContainElement(canvas.getByRole("menuitem", { name: "Name" }))
    // Keyboard travel skips the label.
    await userEvent.tab()
    await expect(canvas.getByRole("menuitem", { name: "Name" })).toHaveFocus()
    await userEvent.keyboard("{ArrowDown}")
    await expect(canvas.getByRole("menuitem", { name: "Date" })).toHaveFocus()
  },
}
