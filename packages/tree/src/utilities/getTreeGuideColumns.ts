import type { TreeGuideProps } from "../components/TreeGuide/TreeGuide.types"

/**
 * A guide column's shape: "none" (empty), "line" (an ancestor's line running through), "tee" (the
 * row's own connector with the line continuing below) or "elbow" (the row's own connector, last
 * child).
 */
export type TreeGuideBranchType = "none" | "line" | "tee" | "elbow"

/**
 * The active path in a guide column: "none", "through" (its full line runs through on the way to a
 * later sibling) or "on" (the row is on the path: its arm and the line above it).
 */
export type TreeGuidePathType = "none" | "through" | "on"

/** Each of a row's guide columns, outermost first: its shape and its part of the active path. */
export const getTreeGuideColumns = ({
  depth,
  last,
  continues = [],
  onPath = false,
  pathContinues = [],
}: TreeGuideProps): { branch: TreeGuideBranchType; path: TreeGuidePathType }[] =>
  Array.from({ length: Math.max(0, depth) }, (_, index) => {
    const own = index === depth - 1
    const branch: TreeGuideBranchType = own ? (last ? "elbow" : "tee") : continues[index] ? "line" : "none"
    const path: TreeGuidePathType = pathContinues[index] ? "through" : own && onPath ? "on" : "none"
    return { branch, path }
  })
