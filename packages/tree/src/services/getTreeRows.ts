import type { GetTreeRowsOptionsType, TreeRowType } from "../components/TreeGuide/TreeGuide.types"

/** The ids from a top-level item down to `activeId`; empty when it is not found. */
const getPath = <Item>(items: ReadonlyArray<Item>, options: GetTreeRowsOptionsType<Item>): string[] => {
  for (const item of items) {
    const id = options.getId(item)
    if (id === options.activeId) return [id]
    const children = options.getChildren?.(item)
    const path = children?.length ? getPath(children, options) : []
    if (path.length) return [id, ...path]
  }
  return []
}

/**
 * getTreeRows
 *
 * Flattens a nested list into its visible rows, in display order, each with its depth, its
 * position among its siblings and its TreeGuide data. Pure: the same input gives the same rows,
 * so memoize the call on its inputs. Used by Tree and DataTable; use it to draw the guide in any
 * tree-shaped list.
 *
 * @example
 * ```ts
 * const rows = getTreeRows(items, { getId: item => item.id, getChildren: item => item.items, expandedIds: ["guides"] })
 * ```
 */
export const getTreeRows = <Item>(
  items: ReadonlyArray<Item>,
  options: GetTreeRowsOptionsType<Item>,
): TreeRowType<Item>[] => {
  const { getId, getChildren, expandedIds = [] } = options
  const path = options.activeId === undefined ? [] : getPath(items, options)
  const open = expandedIds === "all" ? undefined : new Set(expandedIds)
  const rows: TreeRowType<Item>[] = []

  const walk = (
    level: ReadonlyArray<Item>,
    depth: number,
    parent: { id?: string; onPath: boolean; continues: boolean[]; pathContinues: boolean[] },
  ) => {
    const ids = level.map(getId)
    const pathIndex = parent.onPath ? ids.indexOf(path[depth]) : -1
    level.forEach((item, index) => {
      const id = ids[index]
      const children = getChildren?.(item)
      const hasChildren = Boolean(children?.length)
      const expanded = hasChildren && (open === undefined || open.has(id))
      const last = index === level.length - 1
      const onPath = index === pathIndex
      const pathContinues = depth > 0 ? [...parent.pathContinues, index < pathIndex] : []
      rows.push({
        item,
        id,
        parentId: parent.id,
        depth,
        posinset: index + 1,
        setsize: level.length,
        hasChildren,
        expanded,
        guide: { depth, last, continues: parent.continues, onPath, pathContinues },
      })
      if (expanded && children)
        walk(children, depth + 1, {
          id,
          onPath,
          continues: depth > 0 ? [...parent.continues, !last] : [],
          pathContinues,
        })
    })
  }

  walk(items, 0, { onPath: path.length > 0, continues: [], pathContinues: [] })
  return rows
}
