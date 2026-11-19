import { sortRows } from "./sortRows"

type Item = { id: string; n: number; items?: Item[] }
const rows: Item[] = [
  { id: "b", n: 2, items: [{ id: "b2", n: 20 }, { id: "b1", n: 10 }] },
  { id: "a10", n: 1 },
  { id: "a9", n: 3 },
]
const columns = [
  { id: "id", header: "Id", cell: () => null, sortValue: (row: Item) => row.id },
  { id: "n", header: "N", cell: () => null, sortValue: (row: Item) => row.n },
  { id: "plain", header: "Plain", cell: () => null },
]
const getChildren = (row: Item) => row.items

describe("sortRows", () => {
  it("keeps the order without a sort or a sortValue", () => {
    expect(sortRows(rows, getChildren, columns, undefined).rows).toBe(rows)
    expect(sortRows(rows, getChildren, columns, { columnId: "plain", direction: "ascending" }).rows).toBe(rows)
  })

  it("sorts strings numeric-aware and numbers numerically, within each sibling set", () => {
    const byId = sortRows(rows, getChildren, columns, { columnId: "id", direction: "ascending" })
    expect(byId.rows.map(row => row.id)).toEqual(["a9", "a10", "b"])
    const byN = sortRows(rows, getChildren, columns, { columnId: "n", direction: "descending" })
    expect(byN.rows.map(row => row.id)).toEqual(["a9", "b", "a10"])
    expect(byN.getChildren?.(rows[0])?.map(row => row.id)).toEqual(["b2", "b1"])
  })
})
