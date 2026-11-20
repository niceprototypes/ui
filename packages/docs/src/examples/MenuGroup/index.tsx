// MenuGroup example configs: one ComponentExample per prop, shown in the MenuGroup section of the Menu
// docs page. Every preview is a live group inside a Menu: Tab in, then ArrowDown passes over the label.
import { Menu, MenuGroup, MenuItem, MenuSeparator } from "@niceprototypes/menu"
import type { ComponentExample } from "../../dataTables/components/demos/Components"

export const menuGroupLabel = {
  name: "label",
  description: "The group's label, shown above its items and naming the group (role group). Keyboard travel passes over it.",
  variants: ["Sort by", "Export"],
  default: "Sort by",
  preview: (variant: string) => (
    <Menu aria-label="View">
      <MenuGroup label={variant}>
        <MenuItem>{variant === "Export" ? "PNG" : "Name"}</MenuItem>
        <MenuItem>{variant === "Export" ? "SVG" : "Date"}</MenuItem>
      </MenuGroup>
    </Menu>
  ),
  code: (variant: string) =>
    `<Menu aria-label="View">\n  <MenuGroup label="${variant}">\n    <MenuItem onSelect={run}>${variant === "Export" ? "PNG" : "Name"}</MenuItem>\n    <MenuItem onSelect={run}>${variant === "Export" ? "SVG" : "Date"}</MenuItem>\n  </MenuGroup>\n</Menu>`,
} satisfies ComponentExample

export const menuGroupChildren = {
  name: "children",
  description: "The group's MenuItem elements, in order. Separate groups with MenuSeparator.",
  variants: ["one group", "two groups"],
  default: "one group",
  preview: (variant: string) => (
    <Menu aria-label="View">
      <MenuGroup label="Sort by">
        <MenuItem>Name</MenuItem>
        <MenuItem>Date</MenuItem>
      </MenuGroup>
      {variant === "two groups" ? (
        <>
          <MenuSeparator />
          <MenuGroup label="Show">
            <MenuItem>Hidden files</MenuItem>
            <MenuItem>Extensions</MenuItem>
          </MenuGroup>
        </>
      ) : null}
    </Menu>
  ),
  code: (variant: string) =>
    variant === "two groups"
      ? `<Menu aria-label="View">
  <MenuGroup label="Sort by">
    <MenuItem onSelect={sortByName}>Name</MenuItem>
    <MenuItem onSelect={sortByDate}>Date</MenuItem>
  </MenuGroup>
  <MenuSeparator />
  <MenuGroup label="Show">
    <MenuItem onSelect={toggleHidden}>Hidden files</MenuItem>
    <MenuItem onSelect={toggleExtensions}>Extensions</MenuItem>
  </MenuGroup>
</Menu>`
      : `<Menu aria-label="View">
  <MenuGroup label="Sort by">
    <MenuItem onSelect={sortByName}>Name</MenuItem>
    <MenuItem onSelect={sortByDate}>Date</MenuItem>
  </MenuGroup>
</Menu>`,
} satisfies ComponentExample

/** Every MenuGroup example facet, keyed by prop: each one shown under that prop on the Menu page. */
export const menuGroupExamples = {
  label: menuGroupLabel,
  children: menuGroupChildren,
} satisfies Record<string, ComponentExample>
