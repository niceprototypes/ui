import { createSelectionStore, getSelectionIndex } from "./createSelectionStore"

type Item = { id: string; items?: Item[] }
const rows: Item[] = [{ id: "p", items: [{ id: "a" }, { id: "q", items: [{ id: "b" }, { id: "c" }] }] }, { id: "z" }]

const setup = () => {
  const store = createSelectionStore()
  store.setIndex(getSelectionIndex(rows, row => row.id, row => row.items))
  return store
}

describe("createSelectionStore", () => {
  it("selects a parent with every descendant, and derives parents from their leaves", () => {
    const store = setup()
    store.set(store.toggled("q"))
    expect(store.selectedIds().sort()).toEqual(["b", "c", "q"])
    expect(store.rowState("p")).toBe("mixed")
    store.set(store.toggled("a"))
    expect(store.rowState("p")).toBe("checked")
    expect(store.selectedIds()).toContain("p")
    store.set(store.toggled("b"))
    expect(store.rowState("q")).toBe("mixed")
    expect(store.selectedIds()).not.toContain("p")
    expect(store.leafCount()).toBe(2)
  })

  it("selects all, then none", () => {
    const store = setup()
    store.set(store.toggledAll())
    expect(store.allState()).toBe("checked")
    expect(store.selectedIds().sort()).toEqual(["a", "b", "c", "p", "q", "z"])
    store.set(store.toggledAll())
    expect(store.allState()).toBe("unchecked")
  })

  it("notifies only on a change", () => {
    const store = setup()
    const listener = jest.fn()
    store.subscribe(listener)
    store.set(["z"])
    store.set(["z"])
    expect(listener).toHaveBeenCalledTimes(1)
  })
})
