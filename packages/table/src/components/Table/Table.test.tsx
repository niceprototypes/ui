import * as React from "react"
import { render, screen, within } from "@testing-library/react"
import "@testing-library/jest-dom"
import { getToken } from "@niceprototypes/styles"
import { Table } from "."
import { TableHeader } from "../TableHeader"
import { TableRow } from "../TableRow"
import { TableCell } from "../TableCell"

const renderTable = (props: Partial<React.ComponentProps<typeof Table>> = {}) =>
  render(
    <Table aria-label="Ports" columnWidths={["small", "base"]} {...props}>
      <TableHeader>
        <TableCell role="columnheader">Port</TableCell>
        <TableCell role="columnheader" aria-sort="ascending">
          Project
        </TableCell>
      </TableHeader>
      <TableRow aria-rowindex={2} aria-level={1} aria-posinset={1} aria-setsize={1} aria-expanded divider>
        <TableCell role="rowheader">4000</TableCell>
        <TableCell align="end">ports</TableCell>
      </TableRow>
      <TableRow aria-rowindex={3} aria-level={2} aria-posinset={1} aria-setsize={1} density="compact" aria-selected>
        <TableCell role="rowheader" guide={{ depth: 1, last: true, continues: [] }}>
          4012
        </TableCell>
        <TableCell />
      </TableRow>
    </Table>,
  )

describe("Table", () => {
  it("renders a named grid with one column template from the width tokens", () => {
    renderTable()
    const grid = screen.getByRole("grid", { name: "Ports" })
    expect(grid).toHaveAttribute("aria-colcount", "2")
    expect(grid.style.gridTemplateColumns).toBe(
      `${getToken("table.column.width:small")} ${getToken("table.column.width:base")}`,
    )
  })

  it("takes the treegrid role and passes row ARIA through", () => {
    renderTable({ role: "treegrid", "aria-rowcount": 3, "aria-busy": true })
    const grid = screen.getByRole("treegrid")
    expect(grid).toHaveAttribute("aria-rowcount", "3")
    expect(grid).toHaveAttribute("aria-busy", "true")
    const [header, parent, child] = within(grid).getAllByRole("row")
    expect(header).toHaveAttribute("aria-rowindex", "1")
    expect(parent).toHaveAttribute("aria-expanded", "true")
    expect(parent).toHaveAttribute("data-divider")
    expect(child).toHaveAttribute("aria-level", "2")
    expect(child).toHaveAttribute("aria-selected", "true")
    expect(child).toHaveAttribute("data-density", "compact")
  })

  it("renders header, row-header and data cells, an empty cell included", () => {
    renderTable()
    expect(screen.getAllByRole("columnheader")).toHaveLength(2)
    expect(screen.getAllByRole("columnheader")[1]).toHaveAttribute("aria-sort", "ascending")
    expect(screen.getAllByRole("rowheader")).toHaveLength(2)
    expect(screen.getAllByRole("gridcell")).toHaveLength(2)
    expect(screen.getAllByRole("gridcell")[0]).toHaveAttribute("data-align", "end")
  })

  it("draws a TreeGuide slice in a cell given guide data", () => {
    renderTable()
    const cell = screen.getByRole("rowheader", { name: /4012/ })
    expect(cell.querySelector('[aria-hidden="true"]')?.children).toHaveLength(1)
  })

  it("renders the toolbar above the grid", () => {
    renderTable({ toolbar: <span>2 selected</span> })
    expect(screen.getByText("2 selected")).toBeInTheDocument()
  })
})
