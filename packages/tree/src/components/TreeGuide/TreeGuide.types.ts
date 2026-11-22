/**
 * TreeGuideDepthType
 *
 * The row's nesting level, 0-based: 0 is a top-level row, which draws no guide. A row at
 * depth `n` draws `n` guide columns: one per ancestor level, then its own connector.
 */
export type TreeGuideDepthType = number

/**
 * TreeGuideLastType
 *
 * Whether the row is the last of its siblings. The last row's connector is an elbow (the upper
 * half of the line plus the arm); any other row's is a tee (the full line plus the arm).
 */
export type TreeGuideLastType = boolean

/**
 * TreeGuideContinuesType
 *
 * One entry per ancestor level below the top, outermost first (length `depth - 1`): whether the
 * ancestor at that level has a later sibling, so its line runs through this row. A missing entry
 * counts as false.
 */
export type TreeGuideContinuesType = ReadonlyArray<boolean>

/**
 * TreeGuideOnPathType
 *
 * Whether the row is on the active path (the active row or one of its ancestors): its arm and the
 * line above it take the `tree.activeColor` token.
 */
export type TreeGuideOnPathType = boolean

/**
 * TreeGuidePathContinuesType
 *
 * One entry per guide column, outermost first (length `depth`; the last entry is the row's own
 * connector): whether the active path runs through this row in that column on its way to a later
 * sibling, drawing that column's full line in the `tree.activeColor` token. A missing entry
 * counts as false.
 */
export type TreeGuidePathContinuesType = ReadonlyArray<boolean>

/**
 * TreeGuideRootedType
 *
 * Whether the guide starts with a root column: an empty column before the first level, drawn on
 * every row (a top-level row too), so a top-level row's expander circle has a junction to sit on
 * and every level, the first included, indents by one column.
 */
export type TreeGuideRootedType = boolean

/**
 * TreeGuideRowType
 *
 * The guide data of one row: everything TreeGuide draws. `getTreeRows` computes it for a nested
 * list; spread it into TreeGuide (`<TreeGuide {...row.guide} />`).
 * - depth: nesting level, 0 for a top-level row
 * - last: last of its siblings
 * - continues: per ancestor level, whether that ancestor's line runs through the row
 * - onPath: the row is on the active path
 * - pathContinues: per column, whether the active path's line runs through the row
 */
export type TreeGuideRowType = {
  depth: TreeGuideDepthType
  last: TreeGuideLastType
  continues: TreeGuideContinuesType
  onPath?: TreeGuideOnPathType
  pathContinues?: TreeGuidePathContinuesType
}

/**
 * GetTreeRowsOptionsType
 *
 * How `getTreeRows` reads a nested list.
 * - getId: the item's id, unique across the whole tree
 * - getChildren: the item's children; undefined or empty for a leaf
 * - expandedIds: ids of the open items, or "all"; children of a closed item are left out
 * - activeId: the active item; it and its ancestors form the active path the guide highlights
 */
export type GetTreeRowsOptionsType<Item> = {
  getId: (item: Item) => string
  getChildren?: (item: Item) => ReadonlyArray<Item> | undefined
  expandedIds?: ReadonlyArray<string> | "all"
  activeId?: string
}

/**
 * TreeRowType
 *
 * One visible row of a flattened tree, in display order.
 * - item: the source item
 * - id: its id
 * - parentId: its parent's id; undefined at the top level
 * - depth: nesting level, 0 at the top (`aria-level` is depth + 1)
 * - posinset: 1-based position among its siblings (`aria-posinset`)
 * - setsize: number of its siblings, itself included (`aria-setsize`)
 * - hasChildren: it has at least one child
 * - expanded: it has children and is open
 * - guide: the row's TreeGuide data
 */
export type TreeRowType<Item> = {
  item: Item
  id: string
  parentId?: string
  depth: number
  posinset: number
  setsize: number
  hasChildren: boolean
  expanded: boolean
  guide: TreeGuideRowType
}

/**
 * TreeGuideProps
 *
 * Complete prop definition for the TreeGuide component: one row's guide data.
 */
export interface TreeGuideProps {
  /** Nesting level, 0-based; 0 draws nothing (only the root column when `rooted`) */
  depth: TreeGuideDepthType

  /** Last of its siblings: an elbow instead of a tee */
  last: TreeGuideLastType

  /** Per ancestor level below the top: whether that ancestor's line runs through the row */
  continues?: TreeGuideContinuesType

  /** On the active path: the arm and the line above it take the active colour */
  onPath?: TreeGuideOnPathType

  /** Per column: whether the active path's line runs through the row */
  pathContinues?: TreeGuidePathContinuesType

  /** Start with an empty root column, a top-level row included. @default false */
  rooted?: TreeGuideRootedType
}

const TreeGuideTypes = {} as const

namespace TreeGuideTypes {
  export type Depth = TreeGuideDepthType
  export type Last = TreeGuideLastType
  export type Continues = TreeGuideContinuesType
  export type OnPath = TreeGuideOnPathType
  export type PathContinues = TreeGuidePathContinuesType
  export type Rooted = TreeGuideRootedType
  export type Row = TreeGuideRowType
  export type Props = TreeGuideProps
  export type GetRowsOptions<Item> = GetTreeRowsOptionsType<Item>
  export type TreeRow<Item> = TreeRowType<Item>
}

export default TreeGuideTypes
