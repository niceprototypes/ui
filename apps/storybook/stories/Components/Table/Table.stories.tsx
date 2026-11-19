import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, within } from "storybook/test"
import { getToken } from "@niceprototypes/styles"
import { Table, TableCell, TableHeader, TableRow } from "@niceprototypes/table"
import type {
  TableAlignItemsType,
  TableCellAlignType,
  TableColumnWidthType,
  TableMaxHeightType,
  TableRoleType,
  TableRowDensityType,
} from "@niceprototypes/table"
import LifecycleStory from "@niceprototypes/docs/components/LifecycleStory"

const ROLE_OPTIONS = ["grid", "treegrid"] as const satisfies readonly TableRoleType[]
const WIDTH_OPTIONS = ["fit", "small", "base", "large"] as const satisfies readonly TableColumnWidthType[]
const MAX_HEIGHT_OPTIONS = ["none", "small", "base", "large"] as const satisfies readonly TableMaxHeightType[]
const DENSITY_OPTIONS = ["base", "compact"] as const satisfies readonly TableRowDensityType[]
const ALIGN_ITEMS_OPTIONS = ["start", "center", "end"] as const satisfies readonly TableAlignItemsType[]
const ALIGN_OPTIONS = ["start", "end"] as const satisfies readonly TableCellAlignType[]

/**
 * PlaygroundArgs
 *
 * Table's props plus one control per structural choice of the sample rows: the two column widths,
 * the port column's alignment, the child rows' density, a divider before the last group, the
 * selected child, the tree guide on the child rows, and the toolbar text.
 */
type PlaygroundArgs = {
  "aria-label": string
  role: TableRoleType
  maxHeight: TableMaxHeightType
  alignItems: TableAlignItemsType
  striped: boolean
  projectWidth: TableColumnWidthType
  portWidth: TableColumnWidthType
  portAlign: TableCellAlignType
  childDensity: TableRowDensityType
  divider: boolean
  selected: boolean
  guide: boolean
  toolbar: string
}

/** The sample: a group row with two children, then a flat row. */
const SampleTable = (args: PlaygroundArgs) => {
  const tree = args.role === "treegrid"
  const child = (index: number, label: string, port: string, last: boolean) => (
    <TableRow
      aria-rowindex={index}
      aria-level={tree ? 2 : undefined}
      aria-posinset={tree ? index - 2 : undefined}
      aria-setsize={tree ? 2 : undefined}
      aria-selected={index === 3 ? args.selected : false}
      density={args.childDensity}
    >
      <TableCell role="rowheader" guide={args.guide ? { depth: 1, last, continues: [] } : undefined}>
        {label}
      </TableCell>
      <TableCell align={args.portAlign}>{port}</TableCell>
    </TableRow>
  )
  return (
    <Table
      aria-label={args["aria-label"]}
      role={args.role}
      aria-rowcount={5}
      columnWidths={[args.projectWidth, args.portWidth]}
      maxHeight={args.maxHeight}
      alignItems={args.alignItems}
      striped={args.striped}
      toolbar={args.toolbar ? <span>{args.toolbar}</span> : undefined}
    >
      <TableHeader>
        <TableCell role="columnheader">Project</TableCell>
        <TableCell role="columnheader" align={args.portAlign}>
          Port
        </TableCell>
      </TableHeader>
      <TableRow
        aria-rowindex={2}
        aria-level={tree ? 1 : undefined}
        aria-posinset={tree ? 1 : undefined}
        aria-setsize={tree ? 2 : undefined}
        aria-expanded={tree ? true : undefined}
        divider
      >
        <TableCell role="rowheader">animation-studio</TableCell>
        <TableCell align={args.portAlign}>4012–4014</TableCell>
      </TableRow>
      {child(3, "owner instance", "4012", false)}
      {child(4, "store registry", "4013", true)}
      <TableRow
        aria-rowindex={5}
        aria-level={tree ? 1 : undefined}
        aria-posinset={tree ? 2 : undefined}
        aria-setsize={tree ? 2 : undefined}
        divider={args.divider}
      >
        <TableCell role="rowheader">docs</TableCell>
        <TableCell align={args.portAlign}>4020</TableCell>
      </TableRow>
    </Table>
  )
}

const meta = {
  title: "Components/Table",
  component: Table,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Table>

export default meta

type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  args: {
    "aria-label": "Ports",
    role: "treegrid",
    maxHeight: "none",
    alignItems: "start",
    striped: true,
    projectWidth: "base",
    portWidth: "small",
    portAlign: "end",
    childDensity: "base",
    divider: true,
    selected: false,
    guide: true,
    toolbar: "",
  },
  argTypes: {
    "aria-label": { control: "text", table: { category: "Content" } },
    toolbar: { control: "text", table: { category: "Content" } },
    role: { control: "select", options: ROLE_OPTIONS, table: { category: "Structure" } },
    projectWidth: { control: "select", options: WIDTH_OPTIONS, table: { category: "Columns" } },
    portWidth: { control: "select", options: WIDTH_OPTIONS, table: { category: "Columns" } },
    portAlign: { control: "select", options: ALIGN_OPTIONS, table: { category: "Columns" } },
    childDensity: { control: "select", options: DENSITY_OPTIONS, table: { category: "Rows" } },
    striped: { control: "boolean", table: { category: "Rows" } },
    divider: { control: "boolean", table: { category: "Rows" } },
    selected: { control: "boolean", table: { category: "Rows" } },
    guide: { control: "boolean", table: { category: "Rows" } },
    maxHeight: { control: "select", options: MAX_HEIGHT_OPTIONS, table: { category: "Layout" } },
    alignItems: { control: "select", options: ALIGN_ITEMS_OPTIONS, table: { category: "Layout" } },
  },
  render: args => <SampleTable {...args} />,
  play: async ({ canvasElement, args }) => {
    const grid = within(canvasElement).getByRole(args.role, { name: args["aria-label"] })
    // One template for every row: the second column starts at one x in all rows.
    const lefts = within(grid)
      .getAllByRole("row")
      .map(row => Math.round((row.children[1] as HTMLElement).getBoundingClientRect().left))
    await expect(new Set(lefts).size).toBe(1)
    await expect(grid.style.gridTemplateColumns).toContain(getToken(`table.column.width:${args.portWidth}`))
  },
}

/** `density="compact"` steps nested rows down one size: shorter, smaller text. */
export const Density: Story = {
  ...Playground,
  args: { ...Playground.args, childDensity: "compact" },
  play: async ({ canvasElement }) => {
    const [, parent, child] = within(canvasElement).getAllByRole("row")
    await expect(child.getBoundingClientRect().height).toBeLessThan(parent.getBoundingClientRect().height)
    await expect(parseFloat(getComputedStyle(child).fontSize)).toBeLessThan(parseFloat(getComputedStyle(parent).fontSize))
  },
}

/**
 * A cell given `guide` draws the TreeGuide slice over the row's full height. The grid puts the
 * guide in offset mode: with `alignItems="start"` its arm sits on the first text line, not at
 * mid-height.
 */
export const Guide: Story = {
  ...Playground,
  play: async ({ canvasElement }) => {
    const grid = within(canvasElement).getByRole("treegrid")
    const child = within(canvasElement).getAllByRole("row")[2]
    const cell = within(child).getByRole("rowheader")
    const column = cell.querySelector('[aria-hidden="true"]')!.firstElementChild!
    await expect(column).toHaveAttribute("data-branch", "tee")
    await expect(parseFloat(getComputedStyle(column, "::before").height)).toBeCloseTo(child.getBoundingClientRect().height, 0)
    await expect(grid).toHaveAttribute("data-tree-guide-arm", "offset")
    await expect(getComputedStyle(cell).getPropertyValue(getToken("tree.guide.armOffset", { as: "key" }))).toContain("0.5em")
  },
}

/** `aria-selected` rows take the selected background; hover and focus are CSS too. */
export const Selected: Story = {
  ...Playground,
  args: { ...Playground.args, selected: true },
  play: async ({ canvasElement }) => {
    const [, parent, child] = within(canvasElement).getAllByRole("row")
    await expect(getComputedStyle(child).backgroundColor).not.toBe(getComputedStyle(parent).backgroundColor)
  },
}

/**
 * `striped` (default) alternates body rows by visible order, nested rows included, and draws a
 * row divider above each; `striped={false}` gives every row the same background.
 */
export const Striped: Story = {
  ...Playground,
  play: async ({ canvasElement }) => {
    const [, first, second, third] = within(canvasElement).getAllByRole("row")
    const background = (row: HTMLElement) => getComputedStyle(row).backgroundColor
    await expect(background(second)).not.toBe(background(first))
    await expect(background(third)).toBe(background(first))
    await expect(getComputedStyle(second).boxShadow).toContain("inset")
  },
}

/** `striped={false}`: body rows share one background apart from the compact rows' child background. */
export const Unstriped: Story = {
  ...Playground,
  args: { ...Playground.args, striped: false, childDensity: "base" },
  play: async ({ canvasElement }) => {
    const [, first, second] = within(canvasElement).getAllByRole("row")
    await expect(getComputedStyle(second).backgroundColor).toBe(getComputedStyle(first).backgroundColor)
  },
}

/** `alignItems` (default "start") sets where cell content sits in its row; "center" centres it. */
export const AlignItems: Story = {
  ...Playground,
  play: async ({ canvasElement }) => {
    const cell = within(canvasElement).getAllByRole("row")[1].children[0] as HTMLElement
    await expect(getComputedStyle(cell).alignItems).toBe("flex-start")
    await expect(getComputedStyle(cell).paddingTop).toBe(getComputedStyle(cell).paddingLeft)
  },
}

/** `maxHeight` caps the table; the header row stays at the top while the body scrolls. */
export const MaxHeight: Story = {
  ...Playground,
  args: { ...Playground.args, maxHeight: "small" },
  play: async ({ canvasElement }) => {
    const header = within(canvasElement).getAllByRole("row")[0]
    await expect(getComputedStyle(header).position).toBe("sticky")
  },
}

/** Lifecycle: base rows → compact children → guide lines → a selected child → a toolbar. */
export const Lifecycle: Story = {
  args: Playground.args,
  render: args => (
    <LifecycleStory<PlaygroundArgs>
      steps={[
        { label: "grid", props: { ...args, role: "grid", guide: false } },
        { label: "compact children", props: { ...args, childDensity: "compact", guide: false } },
        { label: "guide", props: { ...args } },
        { label: "selected", props: { ...args, selected: true } },
        { label: "toolbar", props: { ...args, selected: true, toolbar: "1 selected" } },
      ]}
      render={props => <SampleTable {...props} />}
    />
  ),
}
