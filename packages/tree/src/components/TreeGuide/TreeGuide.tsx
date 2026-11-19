import * as React from "react"
import { StyledTreeGuide, StyledTreeGuideColumn } from "./TreeGuide.styles"
import type { TreeGuideProps } from "./TreeGuide.types"
import { getTreeGuideColumns } from "../../utilities/getTreeGuideColumns"

/**
 * TreeGuide
 *
 * The guide lines of one row of any tree-shaped list (the steps graphic of Tree): straight lines
 * with square corners, a rail on the parent's icon axis and an arm into each child, a tee for a
 * non-last child and an elbow for the last, with the active path drawn in `tree.activeColor` over
 * the neutral `tree.guide.color`. It renders the row's indent in flow (one column per level) and
 * draws over the full height of its nearest positioned ancestor, so it works in a flex row, a
 * list item or a table cell: give the row or cell `position: relative`, place TreeGuide before
 * the content, and keep consecutive rows touching (no gap between them) so the lines join.
 * Decorative: hidden from assistive technology; convey nesting with `aria-level` on the row.
 *
 * @example
 * ```tsx
 * {getTreeRows(items, { getId: item => item.id, getChildren: item => item.items }).map(row => (
 *   <Row key={row.id}>
 *     <TreeGuide {...row.guide} />
 *     {row.item.name}
 *   </Row>
 * ))}
 * ```
 */
const TreeGuide: React.FC<TreeGuideProps> = props => {
  if (props.depth < 1) return null
  return (
    <StyledTreeGuide aria-hidden="true">
      {getTreeGuideColumns(props).map(({ branch, path }, index) => (
        <StyledTreeGuideColumn key={index} data-branch={branch} data-path={path} />
      ))}
    </StyledTreeGuide>
  )
}

export default React.memo(TreeGuide)
