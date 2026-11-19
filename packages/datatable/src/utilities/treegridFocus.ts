import type * as React from "react"

/** Elements that take focus inside a cell. */
const FOCUSABLE = "button, input, select, textarea, a[href]"

const CELL = '[role="gridcell"], [role="rowheader"], [role="columnheader"]'

/** Every row of the grid, the header row first. */
export const getRows = (grid: HTMLElement) => Array.from(grid.querySelectorAll<HTMLElement>(':scope > [role="row"]'))

/** Whether a row is a body row (not the header). */
const isBody = (row: HTMLElement) => !row.hasAttribute("data-header")

/** A row's cells, in column order. */
export const getCells = (row: HTMLElement) => Array.from(row.children).filter(cell => cell.matches(CELL)) as HTMLElement[]

/** What focus lands on in a cell: its first enabled widget, or the cell itself. */
export const getCellTarget = (cell: HTMLElement) =>
  Array.from(cell.querySelectorAll<HTMLElement>(FOCUSABLE)).find(element => !element.hasAttribute("disabled")) ?? cell

/** A row's 1-based `aria-rowindex`. */
export const getRowIndex = (row: HTMLElement) => Number(row.getAttribute("aria-rowindex"))

/**
 * Roving tabindex: exactly one element in the grid is in the tab order (`tabindex="0"`); every
 * other row, cell and widget is `-1`. Run after each render, since new rows bring new widgets.
 */
export const syncTabIndex = (grid: HTMLElement, current: HTMLElement | null) => {
  for (const element of grid.querySelectorAll<HTMLElement>(`[role="row"]:not([data-header]), ${CELL}, ${FOCUSABLE}`)) {
    const value = element === current ? "0" : "-1"
    if (element.getAttribute("tabindex") !== value) element.setAttribute("tabindex", value)
  }
}

/** Where focus rests before anything is focused: the first body row, else the first header cell. */
export const getDefaultTarget = (grid: HTMLElement): HTMLElement | null => {
  const rows = getRows(grid)
  const body = rows.find(isBody)
  if (body) return body
  const cell = rows[0] ? getCells(rows[0])[0] : undefined
  return cell ? getCellTarget(cell) : null
}

/** A focus position that survives re-renders: a row (its 1-based index) and a column, -1 for the row. */
export type FocusPositionType = { rowIndex: number; col: number }

export const getFocusPosition = (element: HTMLElement): FocusPositionType | null => {
  const row = element.closest<HTMLElement>('[role="row"]')
  if (!row) return null
  const cell = element.closest<HTMLElement>(CELL)
  return { rowIndex: getRowIndex(row), col: cell ? getCells(row).indexOf(cell) : -1 }
}

export const findByPosition = (grid: HTMLElement, position: FocusPositionType): HTMLElement | null => {
  const row = getRows(grid).find(element => getRowIndex(element) === position.rowIndex)
  if (!row) return null
  if (position.col < 0) return isBody(row) ? row : null
  const cell = getCells(row)[position.col]
  return cell ? getCellTarget(cell) : null
}

/** What a key on the grid asks for, besides moving focus. Rows are named by `aria-rowindex`. */
export type TreegridCommandsType = {
  /** Open (true) or close (false) a row. */
  setExpanded: (rowIndex: number, open: boolean, event: React.KeyboardEvent<HTMLElement>) => void
  /** Toggle a row's selection; undefined when rows cannot be selected. */
  toggleSelected?: (rowIndex: number) => void
}

/**
 * The WAI-ARIA APG treegrid keyboard model, on the grid's keydown. Row focus: Down/Up move between
 * rows, Right opens a closed row or moves into its first cell, Left closes an open row or moves
 * to its parent, Home/End go to the first/last row, Enter opens or closes, Space selects. Cell
 * focus: Left/Right move between cells (Left from the first cell returns to the row), Up/Down
 * move within the column (the header row included), Home/End go to the row's first/last cell,
 * Ctrl+Home/End to the column's first/last row. Returns the element to focus, or null when the
 * key is not part of the model.
 */
export const getKeyTarget = (
  grid: HTMLElement,
  event: React.KeyboardEvent<HTMLElement>,
  commands: TreegridCommandsType,
): HTMLElement | null => {
  const target = event.target as HTMLElement
  const row = target.closest<HTMLElement>('[role="row"]')
  if (!row || row.parentElement !== grid) return null
  const rows = getRows(grid)
  const bodyRows = rows.filter(isBody)
  const rowIndex = getRowIndex(row)

  // Row focus (body rows only).
  if (target === row && isBody(row)) {
    const position = bodyRows.indexOf(row)
    const hasChildren = row.hasAttribute("aria-expanded")
    const expanded = row.getAttribute("aria-expanded") === "true"
    switch (event.key) {
      case "ArrowDown":
        return bodyRows[position + 1] ?? row
      case "ArrowUp":
        return bodyRows[position - 1] ?? row
      case "Home":
        return bodyRows[0] ?? null
      case "End":
        return bodyRows[bodyRows.length - 1] ?? null
      case "ArrowRight":
        if (hasChildren && !expanded) {
          commands.setExpanded(rowIndex, true, event)
          return row
        }
        return getCells(row)[0] ? getCellTarget(getCells(row)[0]) : row
      case "ArrowLeft": {
        if (expanded) {
          commands.setExpanded(rowIndex, false, event)
          return row
        }
        const level = Number(row.getAttribute("aria-level"))
        const parent = bodyRows
          .slice(0, position)
          .reverse()
          .find(element => Number(element.getAttribute("aria-level")) === level - 1)
        return parent ?? row
      }
      case "Enter":
        if (hasChildren) commands.setExpanded(rowIndex, !expanded, event)
        return row
      case " ":
        if (!commands.toggleSelected) return null
        commands.toggleSelected(rowIndex)
        return row
      default:
        return null
    }
  }

  // Cell focus: the focused element is a cell or a widget in one.
  const cell = target.closest<HTMLElement>(CELL)
  if (!cell) return null
  const cells = getCells(row)
  const col = cells.indexOf(cell)
  const inColumn = (element: HTMLElement | undefined) => {
    const next = element ? getCells(element)[col] : undefined
    return next ? getCellTarget(next) : null
  }
  switch (event.key) {
    case "ArrowRight":
      return cells[col + 1] ? getCellTarget(cells[col + 1]) : target
    case "ArrowLeft":
      if (col > 0) return getCellTarget(cells[col - 1])
      return isBody(row) ? row : target
    case "ArrowDown":
      return inColumn(rows[rows.indexOf(row) + 1]) ?? target
    case "ArrowUp":
      return inColumn(rows[rows.indexOf(row) - 1]) ?? target
    case "Home":
      return event.ctrlKey ? inColumn(rows[0]) : getCellTarget(cells[0])
    case "End":
      return event.ctrlKey ? inColumn(rows[rows.length - 1]) : getCellTarget(cells[cells.length - 1])
    default:
      return null
  }
}
