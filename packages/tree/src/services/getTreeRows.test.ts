import { getTreeRows } from "./getTreeRows"

type Item = { id: string; items?: Item[] }

/*
  a
  ├─ b
  │  ├─ c
  │  │  ├─ d
  │  │  └─ e   (active)
  │  └─ f
  └─ g
  h
*/
const items: Item[] = [
  {
    id: "a",
    items: [
      { id: "b", items: [{ id: "c", items: [{ id: "d" }, { id: "e" }] }, { id: "f" }] },
      { id: "g" },
    ],
  },
  { id: "h" },
]

const options = { getId: (item: Item) => item.id, getChildren: (item: Item) => item.items }

const byId = (rows: ReturnType<typeof getTreeRows<Item>>) => Object.fromEntries(rows.map(row => [row.id, row]))

describe("getTreeRows", () => {
  it("lists only the open rows, in display order", () => {
    expect(getTreeRows(items, { ...options, expandedIds: ["a"] }).map(row => row.id)).toEqual(["a", "b", "g", "h"])
    expect(getTreeRows(items, options).map(row => row.id)).toEqual(["a", "h"])
    expect(getTreeRows(items, { ...options, expandedIds: "all" }).map(row => row.id)).toEqual([
      "a", "b", "c", "d", "e", "f", "g", "h",
    ])
  })

  it("gives depth, position among siblings, children and open state", () => {
    const rows = byId(getTreeRows(items, { ...options, expandedIds: "all" }))
    expect(rows.d).toMatchObject({ depth: 3, posinset: 1, setsize: 2, parentId: "c", hasChildren: false, expanded: false })
    expect(rows.f).toMatchObject({ depth: 2, posinset: 2, setsize: 2, parentId: "b" })
    expect(rows.a).toMatchObject({ depth: 0, posinset: 1, setsize: 2, parentId: undefined, hasChildren: true, expanded: true })
    expect(byId(getTreeRows(items, options)).a).toMatchObject({ hasChildren: true, expanded: false })
  })

  it("draws a tee for a non-last child and an elbow for the last", () => {
    const rows = byId(getTreeRows(items, { ...options, expandedIds: "all" }))
    expect(rows.d.guide).toMatchObject({ depth: 3, last: false })
    expect(rows.e.guide).toMatchObject({ depth: 3, last: true })
    expect(rows.a.guide).toMatchObject({ depth: 0, continues: [] })
  })

  it("carries each ancestor level's line at depth 3", () => {
    const rows = byId(getTreeRows(items, { ...options, expandedIds: "all" }))
    // d's ancestors below the top: b (has a later sibling g) and c (has a later sibling f).
    expect(rows.d.guide.continues).toEqual([true, true])
    expect(rows.c.guide.continues).toEqual([true])
    expect(rows.f.guide.continues).toEqual([true])
  })

  it("stops an ancestor's line after its last child", () => {
    const tree: Item[] = [{ id: "a", items: [{ id: "b", items: [{ id: "c", items: [{ id: "d" }] }] }] }]
    const rows = byId(getTreeRows(tree, { ...options, expandedIds: "all" }))
    expect(rows.d.guide).toMatchObject({ depth: 3, last: true, continues: [false, false] })
  })

  it("marks the active path and the columns it runs through", () => {
    const rows = byId(getTreeRows(items, { ...options, expandedIds: "all", activeId: "e" }))
    expect(["a", "b", "c", "e"].map(id => rows[id].guide.onPath)).toEqual([true, true, true, true])
    expect(["d", "f", "g", "h"].map(id => rows[id].guide.onPath)).toEqual([false, false, false, false])
    // d sits before e: the path's line runs through d's own column, under the active b and c.
    expect(rows.d.guide.pathContinues).toEqual([false, false, true])
    // e is on the path: no column passes it on the way to a later sibling.
    expect(rows.e.guide.pathContinues).toEqual([false, false, false])
    // f comes after c, which is on the path.
    expect(rows.f.guide.pathContinues).toEqual([false, false])
  })

  it("has no active path without a matching activeId", () => {
    const rows = getTreeRows(items, { ...options, expandedIds: "all", activeId: "missing" })
    expect(rows.every(row => !row.guide.onPath && !row.guide.pathContinues?.some(Boolean))).toBe(true)
  })
})
