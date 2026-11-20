import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, fn, waitFor, within } from "storybook/test"
import Badge, { type BadgeStatusType } from "@niceprototypes/badge"
import DataTable from "@niceprototypes/datatable"
import type {
  DataTableChildDensityType,
  DataTableColumnType,
  DataTableMaxHeightType,
  DataTableProps,
} from "@niceprototypes/datatable"
import LifecycleStory from "@niceprototypes/docs/components/LifecycleStory"

/** A port reservation, or a group of them. */
type PortRow = {
  id: string
  name: string
  port?: number
  ports?: string
  state?: "running" | "stopped" | "failed"
  items?: PortRow[]
}

const STATUS: Record<NonNullable<PortRow["state"]>, BadgeStatusType> = {
  running: "success",
  stopped: "base",
  failed: "error",
}

const ROWS: PortRow[] = [
  { id: "4000", name: "ports", port: 4000, state: "running" },
  {
    id: "studio",
    name: "animation-studio",
    ports: "4012–4114",
    items: [
      {
        id: "main",
        name: "main",
        ports: "4012–4014",
        items: [
          { id: "4012", name: "owner instance", port: 4012, state: "running" },
          { id: "4013", name: "store registry", port: 4013, state: "running" },
          { id: "4014", name: "member instance", port: 4014, state: "stopped" },
        ],
      },
      {
        id: "voice",
        name: "voice worktree",
        ports: "4112–4114",
        items: [
          { id: "4112", name: "owner instance", port: 4112, state: "failed" },
          { id: "4113", name: "store registry", port: 4113, state: "stopped" },
        ],
      },
    ],
  },
  { id: "4020", name: "docs", port: 4020, state: "running" },
]

const COLUMNS: DataTableColumnType<PortRow>[] = [
  {
    id: "name",
    header: "Project",
    rowHeader: true,
    cell: row => row.name,
    sortValue: row => row.name,
  },
  {
    id: "port",
    header: "Port",
    width: "small",
    align: "end",
    cell: row => row.port ?? row.ports,
    sortValue: row => row.port ?? 0,
  },
  {
    id: "state",
    header: "State",
    width: "small",
    cell: row =>
      row.state ? (
        <Badge
          status={STATUS[row.state]}
          label={row.state}
        />
      ) : null,
  },
]

const MAX_HEIGHT_OPTIONS = [
  "none",
  "small",
  "base",
  "large",
] as const satisfies readonly DataTableMaxHeightType[]

const CHILD_DENSITY_OPTIONS = ["base", "compact"] as const satisfies readonly DataTableChildDensityType[]

/**
 * PlaygroundArgs
 *
 * DataTable's props with the data and callbacks built in `render`: `nested` (the grouped rows, or
 * only the leaves), `expandAll` (defaultExpandedIds "all"), `withBulkActions` and `withRowActions`
 * (the action lists), `emptyRows` (no rows, to show `empty`).
 */
type PlaygroundArgs = Pick<
  DataTableProps<PortRow>,
  | "aria-label"
  | "selectable"
  | "loading"
  | "empty"
  | "maxHeight"
  | "childDensity"
  | "onExpandedChange"
  | "onSelectedChange"
  | "onSortChange"
> & {
  nested: boolean
  expandAll: boolean
  withBulkActions: boolean
  withRowActions: boolean
  emptyRows: boolean
  onAction: (action: string, ids: string[]) => void
}

const leaves = (rows: PortRow[]): PortRow[] =>
  rows.flatMap(row => (row.items ? leaves(row.items) : [row]))

const renderTable = (args: PlaygroundArgs) => (
  <DataTable<PortRow>
    key={`${args.expandAll}-${args.nested}`}
    aria-label={args["aria-label"]}
    columns={COLUMNS}
    rows={args.emptyRows ? [] : args.nested ? ROWS : leaves(ROWS)}
    getRowId={row => row.id}
    getRowLabel={row => row.name}
    getRowChildren={row => row.items}
    defaultExpandedIds={args.expandAll ? "all" : undefined}
    onExpandedChange={args.onExpandedChange}
    selectable={args.selectable}
    onSelectedChange={args.onSelectedChange}
    bulkActions={
      args.withBulkActions
        ? rows => [
            {
              id: "start",
              label: "Start",
              onSelect: () =>
                args.onAction(
                  "start",
                  rows.map(row => row.id)
                ),
            },
            {
              id: "stop",
              label: "Stop",
              onSelect: () =>
                args.onAction(
                  "stop",
                  rows.map(row => row.id)
                ),
            },
          ]
        : undefined
    }
    rowActions={
      args.withRowActions
        ? row => [
            {
              id: "start",
              label: "Start",
              disabled: row.state === "running",
              onSelect: () => args.onAction("start", [row.id]),
            },
            {
              id: "stop",
              label: "Stop",
              disabled: row.state !== "running",
              onSelect: () => args.onAction("stop", [row.id]),
            },
          ]
        : undefined
    }
    onSortChange={args.onSortChange}
    loading={args.loading}
    empty={args.empty}
    maxHeight={args.maxHeight}
    childDensity={args.childDensity}
  />
)

const meta = {
  title: "Widgets/DataTable",
  component: DataTable,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof DataTable>

export default meta

type Story = StoryObj<PlaygroundArgs>

const bodyRows = (canvasElement: HTMLElement) =>
  within(canvasElement)
    .getAllByRole("row")
    .filter(row => !row.hasAttribute("data-header"))

export const Playground: Story = {
  args: {
    "aria-label": "Ports",
    nested: true,
    expandAll: false,
    selectable: true,
    withBulkActions: true,
    withRowActions: true,
    loading: false,
    emptyRows: false,
    empty: "No ports",
    maxHeight: "none",
    childDensity: "base",
    onExpandedChange: fn(),
    onSelectedChange: fn(),
    onSortChange: fn(),
    onAction: fn(),
  },
  argTypes: {
    "aria-label": { control: "text", table: { category: "Content" } },
    nested: { control: "boolean", table: { category: "Content" } },
    emptyRows: { control: "boolean", table: { category: "Content" } },
    empty: { control: "text", table: { category: "Content" } },
    expandAll: { control: "boolean", table: { category: "Expansion" } },
    selectable: { control: "boolean", table: { category: "Selection" } },
    withBulkActions: { control: "boolean", table: { category: "Selection" } },
    withRowActions: { control: "boolean", table: { category: "Actions" } },
    loading: { control: "boolean", table: { category: "State" } },
    maxHeight: {
      control: "select",
      options: MAX_HEIGHT_OPTIONS,
      table: { category: "Layout" },
    },
    childDensity: {
      control: "select",
      options: CHILD_DENSITY_OPTIONS,
      table: { category: "Layout" },
    },
  },
  render: renderTable,
  play: async ({ canvasElement }) => {
    const grid = within(canvasElement).getByRole("treegrid", { name: "Ports" })
    await expect(grid).toBeInTheDocument()
    // Rows share one column template through subgrid: every cell of a column starts at one x.
    const rows = within(grid).getAllByRole("row")
    const lefts = rows.map(
      row => (row.children[1] as HTMLElement).getBoundingClientRect().left
    )
    await expect(new Set(lefts.map(Math.round)).size).toBe(1)
  },
}

/**
 * Centre Y of an element, relative to its row.
 */
const centreIn = (row: HTMLElement, element: Element) => {
  const box = element.getBoundingClientRect()
  return box.top + box.height / 2 - row.getBoundingClientRect().top
}

/** Centre Y of the first text line in the row's tree column, relative to the row. */
const firstLineCentre = (row: HTMLElement) => {
  const walker = document.createTreeWalker(within(row).getByRole("rowheader"), NodeFilter.SHOW_TEXT)
  let node = walker.nextNode()
  while (node && !node.textContent?.trim()) node = walker.nextNode()
  const range = document.createRange()
  range.selectNodeContents(node!)
  const box = range.getClientRects()[0]
  return box.top + box.height / 2 - row.getBoundingClientRect().top
}

/**
 * Nested rows open under their parent, hanging from the TreeGuide lines, at the same density as
 * top-level rows: one height, padding and text size at every depth. The checkbox, expander and
 * menu button centre on the first text line.
 */
export const Nested: Story = {
  ...Playground,
  args: { ...Playground.args, expandAll: true },
  play: async ({ canvasElement }) => {
    const rows = bodyRows(canvasElement)
    const child = rows.find(row => row.getAttribute("aria-level") === "3")!
    const parent = rows.find(
      row =>
        row.getAttribute("aria-level") === "1" &&
        row.hasAttribute("aria-expanded")
    )!
    const nestedGroup = rows.find(row => row.getAttribute("aria-level") === "2" && row.hasAttribute("aria-expanded"))!
    await expect(child.getAttribute("data-density")).toBe("base")
    // Same content, same height: a nested group row matches the top-level one.
    await expect(nestedGroup.getBoundingClientRect().height).toBe(parent.getBoundingClientRect().height)
    await expect(getComputedStyle(child).fontSize).toBe(getComputedStyle(parent).fontSize)
    for (const row of [parent, child]) {
      const line = firstLineCentre(row)
      await expect(Math.abs(centreIn(row, row.querySelector('input[type="checkbox"]')!) - line)).toBeLessThanOrEqual(1)
      const buttons = row.querySelectorAll("button")
      await expect(Math.abs(centreIn(row, buttons[buttons.length - 1]) - line)).toBeLessThanOrEqual(1)
    }
    await expect(
      Math.abs(centreIn(parent, within(parent).getByRole("rowheader").querySelector("button")!) - firstLineCentre(parent))
    ).toBeLessThanOrEqual(1)
    // The guide runs the full height of the row.
    const column = within(child)
      .getByRole("rowheader")
      .querySelector('[aria-hidden="true"]')!.lastElementChild!
    await expect(
      parseFloat(getComputedStyle(column, "::before").height)
    ).toBeCloseTo(child.getBoundingClientRect().height, 0)
  },
}

/** `childDensity="compact"` opts nested rows into one size down: shorter rows, smaller text. */
export const ChildDensity: Story = {
  ...Playground,
  args: { ...Playground.args, expandAll: true, childDensity: "compact" },
  play: async ({ canvasElement }) => {
    const rows = bodyRows(canvasElement)
    const child = rows.find(row => row.getAttribute("aria-level") === "3")!
    const parent = rows.find(row => row.getAttribute("aria-level") === "1" && row.hasAttribute("aria-expanded"))!
    await expect(child.getAttribute("data-density")).toBe("compact")
    await expect(child.getBoundingClientRect().height).toBeLessThan(parent.getBoundingClientRect().height)
    await expect(parseFloat(getComputedStyle(child).fontSize)).toBeLessThan(parseFloat(getComputedStyle(parent).fontSize))
  },
}

/** The caret opens and closes a row; the keyboard follows the APG treegrid model. */
export const Expansion: Story = {
  ...Playground,
  play: async ({ canvasElement, args, userEvent }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole("button", { name: "animation-studio" })
    )
    await expect(args.onExpandedChange).toHaveBeenLastCalledWith(
      ["studio"],
      expect.anything()
    )
    await expect(
      canvas.getByRole("button", { name: "animation-studio" })
    ).toHaveAttribute("aria-expanded", "true")
    // Keyboard: Down to "main", Right opens it, Left closes it, Left again climbs to its parent.
    const studio = bodyRows(canvasElement)[1]
    studio.focus()
    await userEvent.keyboard("{ArrowDown}{ArrowRight}")
    await expect(canvas.getByRole("button", { name: "main" })).toHaveAttribute(
      "aria-expanded",
      "true"
    )
    await userEvent.keyboard("{ArrowLeft}{ArrowLeft}")
    await expect(document.activeElement).toBe(bodyRows(canvasElement)[1])
    // Focus is visible on the row.
    await expect(getComputedStyle(document.activeElement!).outlineStyle).toBe(
      "solid"
    )
  },
}

/**
 * The bulk control is always there: a ghost select-look menu button, disabled and reading "None
 * selected" until rows are selected, then "N selected"; its menu runs a bulk action on them.
 * Selecting moves nothing: the toolbar keeps its height and surface, and the grid its position.
 */
export const Selection: Story = {
  ...Playground,
  args: { ...Playground.args, expandAll: true },
  play: async ({ canvasElement, args, userEvent }) => {
    const canvas = within(canvasElement)
    const idle = canvas.getByRole("button", { name: "None selected, bulk actions" })
    await expect(idle).toBeDisabled()
    await expect(idle).toHaveAttribute("aria-haspopup", "menu")
    const toolbar = idle.parentElement as HTMLElement
    const grid = canvas.getByRole("treegrid")
    const before = { toolbar: toolbar.getBoundingClientRect().height, header: grid.querySelector("[data-header]")!.getBoundingClientRect().top, background: getComputedStyle(toolbar).backgroundColor }
    await userEvent.click(canvas.getByRole("checkbox", { name: "Select main" }))
    const trigger = canvas.getByRole("button", { name: "3 selected, bulk actions" })
    await expect(trigger).toBeEnabled()
    await expect(trigger).toHaveTextContent("3 selected")
    // Outlined once rows are selected: the Checkbox's unchecked border (menu.trigger.borderColor aliases it).
    const probe = document.createElement("span")
    probe.style.borderTop = "1px solid var(--np--checkbox--border-color--strong)"
    toolbar.appendChild(probe)
    // Button transitions its border, so wait for it to settle.
    await waitFor(() => expect(getComputedStyle(trigger).borderTopColor).toBe(getComputedStyle(probe).borderTopColor))
    probe.remove()
    // No layout shift and no blue: same toolbar height, header position and surface in both states.
    await expect(toolbar.getBoundingClientRect().height).toBe(before.toolbar)
    await expect(grid.querySelector("[data-header]")!.getBoundingClientRect().top).toBe(before.header)
    await expect(getComputedStyle(toolbar).backgroundColor).toBe(before.background)
    await expect(
      canvas.getByRole("checkbox", { name: "Select animation-studio" })
    ).toHaveProperty("indeterminate", true)
    await userEvent.click(trigger)
    await userEvent.click(await within(document.body).findByRole("menuitem", { name: "Start" }))
    await expect(args.onAction).toHaveBeenLastCalledWith(
      "start",
      expect.arrayContaining(["main", "4012", "4013", "4014"])
    )
    await userEvent.click(
      canvas.getByRole("checkbox", { name: "Select all rows" })
    )
    await expect(canvas.getByRole("button", { name: "7 selected, bulk actions" })).toBeEnabled()
  },
}

/** The menu-icon button opens a row's actions; disabled ones cannot be chosen. */
export const RowActions: Story = {
  ...Playground,
  play: async ({ canvasElement, args, userEvent }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole("button", { name: "Actions for docs" })
    )
    const menu = await within(document.body).findByRole("menu", { name: "Actions for docs" })
    await expect(await within(menu).findByRole("menuitem", { name: "Start" })).toHaveAttribute("aria-disabled", "true")
    // Focus starts on the first enabled item; Enter runs it and returns focus to the button.
    await waitFor(() => expect(document.activeElement).toBe(within(menu).getByRole("menuitem", { name: "Stop" })))
    await userEvent.keyboard("{Enter}")
    await expect(args.onAction).toHaveBeenLastCalledWith("stop", ["4020"])
    await waitFor(() => expect(within(document.body).queryByRole("menu")).toBeNull())
    await expect(document.activeElement).toBe(canvas.getByRole("button", { name: "Actions for docs" }))
  },
}

/** A sortable header sorts within each set of siblings, so children stay under their parent. */
export const Sorting: Story = {
  ...Playground,
  args: { ...Playground.args, expandAll: true },
  play: async ({ canvasElement, args, userEvent }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Port" }))
    await userEvent.click(canvas.getByRole("button", { name: "Port" }))
    await expect(args.onSortChange).toHaveBeenLastCalledWith({
      columnId: "port",
      direction: "descending",
    })
    await expect(canvas.getAllByRole("columnheader")[2]).toHaveAttribute(
      "aria-sort",
      "descending"
    )
    const levels = bodyRows(canvasElement).map(row =>
      row.getAttribute("aria-level")
    )
    // docs (4020) first, then ports (4000), then the studio group with its children right after it.
    await expect(levels).toEqual([
      "1",
      "1",
      "1",
      "2",
      "3",
      "3",
      "3",
      "2",
      "3",
      "3",
    ])
  },
}

/** `loading` shows a loading row and marks the grid busy. */
export const Loading: Story = {
  ...Playground,
  args: { ...Playground.args, loading: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("treegrid")).toHaveAttribute(
      "aria-busy",
      "true"
    )
    await expect(within(canvasElement).getByText("Loading")).toBeInTheDocument()
  },
}

/** `empty` fills the body when there are no rows. */
export const Empty: Story = {
  ...Playground,
  args: { ...Playground.args, emptyRows: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("gridcell")).toHaveTextContent(
      "No ports"
    )
  },
}

/** `maxHeight` caps the table; the body scrolls under the sticky header. */
export const MaxHeight: Story = {
  ...Playground,
  args: { ...Playground.args, expandAll: true, maxHeight: "small" },
  play: async ({ canvasElement }) => {
    const header = within(canvasElement).getAllByRole("row")[0]
    const scroller = within(canvasElement).getByRole("treegrid").parentElement!
    const top = header.getBoundingClientRect().top
    scroller.scrollTop = scroller.scrollHeight
    await waitFor(() =>
      expect(header.getBoundingClientRect().top).toBeCloseTo(top, 0)
    )
  },
}

/** A thousand rows across three levels (10 groups, 90 sets, 900 items): render and expand times, logged to the console. */
type BigRow = { id: string; name: string; value: number; items?: BigRow[] }
const BIG_ROWS: BigRow[] = Array.from({ length: 10 }, (_, a) => ({
  id: `g${a}`,
  name: `group ${a}`,
  value: a,
  items: Array.from({ length: 9 }, (_, b) => ({
    id: `g${a}-${b}`,
    name: `set ${a}.${b}`,
    value: b,
    items: Array.from({ length: 10 }, (_, c) => ({
      id: `g${a}-${b}-${c}`,
      name: `item ${a}.${b}.${c}`,
      value: c,
    })),
  })),
}))
const BIG_COLUMNS: DataTableColumnType<BigRow>[] = [
  {
    id: "name",
    header: "Name",
    rowHeader: true,
    cell: row => row.name,
    sortValue: row => row.name,
  },
  {
    id: "value",
    header: "Value",
    width: "small",
    align: "end",
    cell: row => row.value,
    sortValue: row => row.value,
  },
]

/** Times its child's mount from render to the next frame, into `data-mount-ms` on the wrapper. */
const MountTimer = ({ children }: { children: React.ReactNode }) => {
  const start = React.useRef(performance.now())
  const ref = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    requestAnimationFrame(() => {
      ref.current?.setAttribute(
        "data-mount-ms",
        (performance.now() - start.current).toFixed(1)
      )
    })
  }, [])
  return <div ref={ref}>{children}</div>
}

export const ThousandRows: Story = {
  ...Playground,
  render: () => (
    <MountTimer>
      <DataTable<BigRow>
        aria-label="Thousand rows"
        columns={BIG_COLUMNS}
        rows={BIG_ROWS}
        getRowId={row => row.id}
        getRowLabel={row => row.name}
        getRowChildren={row => row.items}
        defaultExpandedIds="all"
        selectable
        rowActions={() => [{ id: "open", label: "Open", onSelect: () => {} }]}
        maxHeight="large"
      />
    </MountTimer>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)
    await expect(bodyRows(canvasElement)).toHaveLength(1000)
    // Collapse and re-open one group (100 rows), timing each to the next frame.
    const button = canvas.getByRole("button", { name: "group 0" })
    const frame = () =>
      new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve)))
    let start = performance.now()
    await userEvent.click(button)
    await frame()
    const collapse = performance.now() - start
    start = performance.now()
    await userEvent.click(button)
    await frame()
    const expand = performance.now() - start
    canvasElement.setAttribute(
      "data-perf",
      `collapse 100 rows ${collapse.toFixed(1)}ms; expand 100 rows ${expand.toFixed(1)}ms`
    )
    await expect(bodyRows(canvasElement)).toHaveLength(1000)
  },
}

/** Lifecycle: collapsed → open → nested open → rows selected → collapsed. */
export const Lifecycle: Story = {
  args: Playground.args,
  render: () => (
    <LifecycleStory
      steps={[
        { label: "collapsed", props: { expandedIds: [], selectedIds: [] } },
        { label: "open", props: { expandedIds: ["studio"], selectedIds: [] } },
        {
          label: "nested open",
          props: { expandedIds: ["studio", "main", "voice"], selectedIds: [] },
        },
        {
          label: "selected",
          props: {
            expandedIds: ["studio", "main", "voice"],
            selectedIds: ["main", "4012", "4013", "4014"],
          },
        },
        { label: "collapsed", props: { expandedIds: [], selectedIds: [] } },
      ]}
      render={props => (
        <DataTable<PortRow>
          aria-label="Ports"
          columns={COLUMNS}
          rows={ROWS}
          getRowId={row => row.id}
          getRowLabel={row => row.name}
          getRowChildren={row => row.items}
          expandedIds={props.expandedIds}
          selectable
          selectedIds={props.selectedIds}
          bulkActions={() => [
            { id: "start", label: "Start", onSelect: () => {} },
          ]}
          rowActions={() => [{ id: "stop", label: "Stop", onSelect: () => {} }]}
        />
      )}
    />
  ),
}
