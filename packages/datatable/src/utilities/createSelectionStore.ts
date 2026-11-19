/** A row's selection state: every leaf under it selected, some, or none. */
export type SelectionStateType = "checked" | "mixed" | "unchecked"

/** The table's shape for selection: each parent's leaf ids, the parents bottom-up, every leaf id. */
export type SelectionIndexType = {
  leaves: Map<string, string[]>
  parents: string[]
  allLeaves: string[]
}

/** Builds the selection index of a nested list. */
export const getSelectionIndex = <Row>(
  rows: ReadonlyArray<Row>,
  getId: (row: Row) => string,
  getChildren: ((row: Row) => ReadonlyArray<Row> | undefined) | undefined,
): SelectionIndexType => {
  const leaves = new Map<string, string[]>()
  const parents: string[] = []
  const walk = (level: ReadonlyArray<Row>): string[] =>
    level.flatMap(row => {
      const id = getId(row)
      const children = getChildren?.(row)
      if (!children?.length) return [id]
      const under = walk(children)
      leaves.set(id, under)
      parents.push(id)
      return under
    })
  return { leaves, parents, allLeaves: walk(rows) }
}

const stateOf = (ids: string[], selected: Set<string>): SelectionStateType => {
  let count = 0
  for (const id of ids) if (selected.has(id)) count++
  if (count === 0) return "unchecked"
  return count === ids.length ? "checked" : "mixed"
}

/**
 * The selection, held outside React so a change re-renders only the rows whose state changed:
 * each row reads its own state with `useSyncExternalStore`. A parent is selected exactly when all
 * its leaves are; toggling it toggles them all.
 */
export const createSelectionStore = () => {
  let selected = new Set<string>()
  let index: SelectionIndexType = { leaves: new Map(), parents: [], allLeaves: [] }
  const listeners = new Set<() => void>()

  /** Adds each parent whose leaves are all selected, removes the others. */
  const normalize = (ids: Set<string>) => {
    for (const parent of index.parents) {
      if (stateOf(index.leaves.get(parent) ?? [], ids) === "checked") ids.add(parent)
      else ids.delete(parent)
    }
    return ids
  }

  const leavesOf = (id: string) => index.leaves.get(id) ?? [id]

  return {
    subscribe: (listener: () => void) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    setIndex: (next: SelectionIndexType) => {
      index = next
    },
    /** Replaces the selection; listeners run only when it changed. */
    set: (ids: ReadonlyArray<string>) => {
      const next = new Set(ids)
      if (next.size === selected.size && [...next].every(id => selected.has(id))) return
      selected = next
      listeners.forEach(listener => listener())
    },
    selectedIds: () => [...selected],
    /** Selected leaf rows (rows without children): the count a bulk action acts on. */
    leafCount: () => index.allLeaves.reduce((count, id) => count + (selected.has(id) ? 1 : 0), 0),
    rowState: (id: string): SelectionStateType => stateOf(leavesOf(id), selected),
    allState: (): SelectionStateType => stateOf(index.allLeaves, selected),
    /** The selection after toggling row `id` (and every row under it). */
    toggled: (id: string): string[] => {
      const next = new Set(selected)
      const on = stateOf(leavesOf(id), selected) !== "checked"
      for (const leaf of leavesOf(id)) on ? next.add(leaf) : next.delete(leaf)
      return [...normalize(next)]
    },
    /** The selection after the select-all checkbox: all rows, or none when all were selected. */
    toggledAll: (): string[] =>
      stateOf(index.allLeaves, selected) === "checked" ? [] : [...normalize(new Set(index.allLeaves))],
  }
}

export type SelectionStoreType = ReturnType<typeof createSelectionStore>
