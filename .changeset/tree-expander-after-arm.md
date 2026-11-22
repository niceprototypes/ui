---
"@niceprototypes/tree": minor
"@niceprototypes/table": patch
"@niceprototypes/datatable": patch
"@niceprototypes/app": patch
"@niceprototypes/styles": minor
---

Tree expander back after the guide's arm (reverts the node-on-rail style; visual change in Tree and DataTable): the circle (`tree.expander.size` wide) follows the guide, the arm touching its left edge; a row without one draws the arm on through the circle's place (TreeExpanderSlot `arm`) to its right edge; labels follow after `tree.guide.labelGap` (now 0.375em); sub-rows' rail drops from the parent circle's centre (`tree.guide.indent` = circle / 2 + arm, `tree.guide.arm` back to `gap`). TreeGuide `rooted`, `tree.expander.backgroundColor` and TableRow's fill properties are removed. The caret is 8px (`tree.expander.iconSize`) with a non-scaling stroke at the guide's width; in a table's top-aligned rows the circle and the slot's arm sit on the first text line. New `tree.lineHeight` (labels' line height; the docs nav sets 2) and the docs nav's label weights (normal, medium active). Closing a row now closes every row under it, the active path included; App reopens a page's section rows only while that page's row is open.
