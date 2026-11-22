import * as React from "react"
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import "@testing-library/jest-dom"
import DataTable from "."
import type { DataTableColumnType } from "./DataTable.types"

type Item = { id: string; name: string; port?: number; items?: Item[] }

/*
  studio
  ├─ main
  │  ├─ 4012
  │  │  └─ deep (depth 3)
  │  └─ 4013
  └─ voice
     └─ 4112
  docs
*/
const ROWS: Item[] = [
  {
    id: "studio",
    name: "studio",
    items: [
      {
        id: "main",
        name: "main",
        items: [
          { id: "4012", name: "dev", port: 4012, items: [{ id: "deep", name: "deep", port: 1 }] },
          { id: "4013", name: "store", port: 4013 },
        ],
      },
      { id: "voice", name: "voice", items: [{ id: "4112", name: "dev", port: 4112 }] },
    ],
  },
  { id: "docs", name: "docs", port: 4020 },
]

const COLUMNS: DataTableColumnType<Item>[] = [
  { id: "name", header: "Name", cell: row => row.name, rowHeader: true, sortValue: row => row.name },
  { id: "port", header: "Port", cell: row => row.port ?? null, align: "end", sortValue: row => row.port ?? 0 },
]

const base = {
  "aria-label": "Ports",
  columns: COLUMNS,
  rows: ROWS,
  getRowId: (row: Item) => row.id,
  getRowLabel: (row: Item) => row.name,
  getRowChildren: (row: Item) => row.items,
}

const bodyRows = () => screen.getAllByRole("row").filter(row => !row.hasAttribute("data-header"))
/** A row's label: its row header's text, without the expander icon's markup. */
const rowNames = () =>
  bodyRows().map(row => {
    const cell = within(row).getByRole("rowheader").cloneNode(true) as HTMLElement
    cell.querySelectorAll("button").forEach(button => button.remove())
    return cell.textContent
  })

describe("DataTable", () => {
  it("renders a named treegrid with a header row and the top-level rows", () => {
    render(<DataTable {...base} />)
    const grid = screen.getByRole("treegrid", { name: "Ports" })
    expect(grid).toHaveAttribute("aria-rowcount", "3")
    expect(screen.getAllByRole("columnheader").map(cell => cell.textContent)).toEqual(["Name", "Port"])
    expect(rowNames()).toEqual(["studio", "docs"])
  })

  it("flattens the open rows in display order", () => {
    render(<DataTable {...base} defaultExpandedIds="all" />)
    expect(rowNames()).toEqual(["studio", "main", "dev", "deep", "store", "voice", "dev", "docs"])
    expect(bodyRows().map(row => row.getAttribute("aria-rowindex"))).toEqual(["2", "3", "4", "5", "6", "7", "8", "9"])
  })

  it("sets the treegrid ARIA attributes down to depth 3", () => {
    render(<DataTable {...base} defaultExpandedIds="all" />)
    const [studio, main, dev, deep, store] = bodyRows()
    expect(studio).toHaveAttribute("aria-level", "1")
    expect(studio).toHaveAttribute("aria-expanded", "true")
    expect(main).toHaveAttribute("aria-level", "2")
    expect(main).toHaveAttribute("aria-posinset", "1")
    expect(main).toHaveAttribute("aria-setsize", "2")
    expect(dev).toHaveAttribute("aria-level", "3")
    expect(deep).toHaveAttribute("aria-level", "4")
    expect(deep).toHaveAttribute("aria-posinset", "1")
    expect(deep).toHaveAttribute("aria-setsize", "1")
    expect(deep).not.toHaveAttribute("aria-expanded")
    expect(store).toHaveAttribute("aria-posinset", "2")
    // Nested rows keep the base density by default; a sparse cell still renders as an empty gridcell.
    expect(main).toHaveAttribute("data-density", "base")
    expect(within(main).getAllByRole("gridcell")[0]).toHaveTextContent(/^$/)
  })

  it("draws the guide in the tree column of nested rows", () => {
    render(<DataTable {...base} defaultExpandedIds="all" />)
    const deep = bodyRows()[3]
    const guide = within(deep).getByRole("rowheader").querySelector('[aria-hidden="true"]')
    expect(guide?.children).toHaveLength(3)
  })

  it("expands and collapses on the caret, reporting the next ids", () => {
    const onExpandedChange = jest.fn()
    render(<DataTable {...base} onExpandedChange={onExpandedChange} />)
    fireEvent.click(screen.getByRole("button", { name: "studio" }))
    expect(rowNames()).toEqual(["studio", "main", "voice", "docs"])
    expect(onExpandedChange).toHaveBeenLastCalledWith(["studio"], expect.anything())
    fireEvent.click(screen.getByRole("button", { name: "studio" }))
    expect(rowNames()).toEqual(["studio", "docs"])
  })

  it("follows expandedIds when controlled", () => {
    render(<DataTable {...base} expandedIds={[]} />)
    fireEvent.click(screen.getByRole("button", { name: "studio" }))
    expect(rowNames()).toEqual(["studio", "docs"])
  })

  it("follows the APG treegrid keys: Right opens, Down moves, Left closes and climbs", () => {
    render(<DataTable {...base} />)
    const studio = bodyRows()[0]
    act(() => studio.focus())
    fireEvent.keyDown(studio, { key: "ArrowRight" })
    expect(studio).toHaveAttribute("aria-expanded", "true")
    expect(document.activeElement).toBe(studio)
    fireEvent.keyDown(studio, { key: "ArrowDown" })
    const main = bodyRows()[1]
    expect(document.activeElement).toBe(main)
    fireEvent.keyDown(main, { key: "ArrowRight" })
    expect(rowNames()).toEqual(["studio", "main", "dev", "store", "voice", "docs"])
    fireEvent.keyDown(main, { key: "ArrowLeft" })
    expect(rowNames()).toEqual(["studio", "main", "voice", "docs"])
    fireEvent.keyDown(main, { key: "ArrowLeft" })
    expect(document.activeElement).toBe(bodyRows()[0])
    fireEvent.keyDown(bodyRows()[0], { key: "Enter" })
    expect(rowNames()).toEqual(["studio", "docs"])
    fireEvent.keyDown(bodyRows()[0], { key: "End" })
    expect(document.activeElement).toBe(bodyRows()[1])
  })

  it("moves between cells and back to the row", () => {
    render(<DataTable {...base} />)
    const docs = bodyRows()[1]
    act(() => docs.focus())
    fireEvent.keyDown(docs, { key: "ArrowRight" })
    const name = within(docs).getByRole("rowheader")
    expect(document.activeElement).toBe(name)
    fireEvent.keyDown(name, { key: "ArrowRight" })
    expect(document.activeElement).toBe(within(docs).getByRole("gridcell"))
    fireEvent.keyDown(document.activeElement!, { key: "ArrowUp" })
    expect(document.activeElement).toBe(within(bodyRows()[0]).getByRole("gridcell"))
    fireEvent.keyDown(document.activeElement!, { key: "Home" })
    expect(document.activeElement).toBe(within(bodyRows()[0]).getByRole("button", { name: "studio" }))
    fireEvent.keyDown(document.activeElement!, { key: "ArrowLeft" })
    expect(document.activeElement).toBe(bodyRows()[0])
  })

  it("keeps exactly one element in the tab order", () => {
    render(<DataTable {...base} defaultExpandedIds="all" selectable rowActions={() => [{ id: "a", label: "A", onSelect: () => {} }]} />)
    const grid = screen.getByRole("treegrid")
    expect(grid.querySelectorAll('[tabindex="0"]')).toHaveLength(1)
    expect(grid.querySelector('[tabindex="0"]')).toBe(bodyRows()[0])
  })

  it("selects a parent with all its descendants, and all rows from the header", () => {
    const onSelectedChange = jest.fn()
    render(<DataTable {...base} defaultExpandedIds={["studio"]} selectable onSelectedChange={onSelectedChange} />)
    fireEvent.click(screen.getByRole("checkbox", { name: "Select main" }))
    expect(onSelectedChange).toHaveBeenLastCalledWith(expect.arrayContaining(["main", "4012", "deep", "4013"]))
    expect(screen.getByRole("checkbox", { name: "Select main" })).toBeChecked()
    expect(bodyRows()[1]).toHaveAttribute("aria-selected", "true")
    expect((screen.getByRole("checkbox", { name: "Select studio" }) as HTMLInputElement).indeterminate).toBe(true)
    const all = screen.getByRole("checkbox", { name: "Select all rows" }) as HTMLInputElement
    expect(all.indeterminate).toBe(true)
    fireEvent.click(all)
    expect(all).toBeChecked()
    expect(onSelectedChange.mock.lastCall[0]).toHaveLength(8)
    fireEvent.click(all)
    expect(onSelectedChange).toHaveBeenLastCalledWith([])
  })

  it("selects the focused row with Space", () => {
    render(<DataTable {...base} selectable />)
    const docs = bodyRows()[1]
    act(() => docs.focus())
    fireEvent.keyDown(docs, { key: " " })
    expect(docs).toHaveAttribute("aria-selected", "true")
  })

  it("runs a bulk action on the selected rows", () => {
    const start = jest.fn()
    render(
      <DataTable
        {...base}
        selectable
        defaultSelectedIds={["docs"]}
        bulkActions={rows => [{ id: "start", label: "Start", onSelect: () => start(rows.map(row => row.id)) }]}
      />,
    )
    const trigger = screen.getByRole("button", { name: "1 selected, bulk actions" })
    expect(trigger).toHaveTextContent("1 selected")
    expect(trigger).toHaveAttribute("aria-haspopup", "menu")
    fireEvent.click(trigger)
    fireEvent.click(screen.getByRole("menuitem", { name: "Start" }))
    expect(start).toHaveBeenCalledWith(["docs"])
    expect(screen.queryByRole("menu")).toBeNull()
  })

  it("keeps the bulk control with nothing selected: disabled, reading None selected", () => {
    const bulkActions = jest.fn(() => [])
    render(<DataTable {...base} selectable bulkActions={bulkActions} />)
    const trigger = screen.getByRole("button", { name: "None selected, bulk actions" })
    expect(trigger).toBeDisabled()
    expect(trigger).toHaveTextContent("None selected")
    fireEvent.click(trigger)
    expect(screen.queryByRole("menu")).toBeNull()
    expect(bulkActions).not.toHaveBeenCalled()
  })

  it("enables the bulk control on selection and back to None selected when cleared, in the same toolbar", () => {
    render(<DataTable {...base} selectable bulkActions={() => [{ id: "start", label: "Start all", onSelect: () => {} }]} />)
    const toolbar = screen.getByRole("button", { name: "None selected, bulk actions" }).parentElement
    const docs = bodyRows()[1]
    act(() => docs.focus())
    fireEvent.keyDown(docs, { key: " " })
    const trigger = screen.getByRole("button", { name: "1 selected, bulk actions" })
    expect(trigger).toBeEnabled()
    expect(trigger.parentElement).toBe(toolbar)
    fireEvent.keyDown(docs, { key: " " })
    expect(screen.getByRole("button", { name: "None selected, bulk actions" })).toBeDisabled()
  })

  it("lists each bulk action with its disabled state", () => {
    render(
      <DataTable
        {...base}
        selectable
        defaultSelectedIds={["docs"]}
        bulkActions={() => [
          { id: "start", label: "Start all", disabled: true, onSelect: () => {} },
          { id: "stop", label: "Stop all", onSelect: () => {} },
        ]}
      />,
    )
    fireEvent.click(screen.getByRole("button", { name: "1 selected, bulk actions" }))
    expect(screen.getByRole("menuitem", { name: "Start all" })).toHaveAttribute("aria-disabled", "true")
    expect(screen.getByRole("menuitem", { name: "Stop all" })).not.toHaveAttribute("aria-disabled")
  })

  it("runs a row action from the menu-icon button and skips a disabled one", async () => {
    const stop = jest.fn()
    const restart = jest.fn()
    render(
      <DataTable
        {...base}
        rowActions={row => [
          { id: "stop", label: "Stop", onSelect: () => stop(row.id) },
          { id: "restart", label: "Restart", disabled: true, onSelect: restart },
        ]}
      />,
    )
    const trigger = screen.getByRole("button", { name: "Actions for docs" })
    expect(trigger).toHaveAttribute("aria-haspopup", "menu")
    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByRole("menu", { name: "Actions for docs" })).toBeInTheDocument()
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Stop" })))
    fireEvent.keyDown(document.activeElement!, { key: "End" })
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Stop" }))
    expect(screen.getByRole("menuitem", { name: "Restart" })).toHaveAttribute("aria-disabled", "true")
    fireEvent.click(screen.getByRole("menuitem", { name: "Restart" }))
    expect(restart).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole("menuitem", { name: "Stop" }))
    expect(stop).toHaveBeenCalledWith("docs")
    expect(screen.queryByRole("menu")).toBeNull()
    expect(document.activeElement).toBe(trigger)
  })

  it("sorts within each set of siblings and marks the sorted header", () => {
    const onSortChange = jest.fn()
    render(<DataTable {...base} defaultExpandedIds="all" onSortChange={onSortChange} />)
    fireEvent.click(screen.getByRole("button", { name: "Port" }))
    expect(onSortChange).toHaveBeenLastCalledWith({ columnId: "port", direction: "ascending" })
    expect(screen.getAllByRole("columnheader")[1]).toHaveAttribute("aria-sort", "ascending")
    fireEvent.click(screen.getByRole("button", { name: "Port" }))
    // Descending: docs (4020) before studio (no port); children stay under their parent, ties keep
    // their order.
    expect(rowNames()).toEqual(["docs", "studio", "main", "store", "dev", "deep", "voice", "dev"])
    fireEvent.click(screen.getByRole("button", { name: "Port" }))
    expect(screen.getAllByRole("columnheader")[1]).not.toHaveAttribute("aria-sort")
  })

  it("shows the empty and loading states", () => {
    const { rerender } = render(<DataTable {...base} rows={[]} empty="No ports" />)
    expect(screen.getByRole("gridcell")).toHaveTextContent("No ports")
    rerender(<DataTable {...base} loading />)
    expect(screen.getByRole("treegrid")).toHaveAttribute("aria-busy", "true")
    expect(screen.getByRole("gridcell")).toHaveTextContent("Loading")
  })

  it("re-renders only the toggled row and its ancestors when one checkbox changes", () => {
    let renders = 0
    const columns: DataTableColumnType<Item>[] = [
      {
        id: "name",
        header: "Name",
        rowHeader: true,
        cell: row => {
          renders++
          return row.name
        },
      },
    ]
    render(<DataTable {...base} columns={columns} defaultExpandedIds="all" selectable />)
    renders = 0
    fireEvent.click(screen.getByRole("checkbox", { name: "Select deep" }))
    // deep, and 4012 (its only child: now checked), main and studio (now mixed).
    expect(renders).toBe(4)
  })
})
