---
"@niceprototypes/tree": minor
"@niceprototypes/table": minor
"@niceprototypes/datatable": minor
"@niceprototypes/styles": minor
---

Tree expander as a node on the guide (visual change in Tree and DataTable). TreeExpander centres its circle on the row's own junction (it follows the TreeGuide with no net width), with an opaque fill (`tree.expander.backgroundColor`) so the rail and the arm's start do not show through; circle and caret are drawn at `tree.guide.width` in `tree.expander.color`, whose base now aliases `tree.guide.color` and whose hover is the label's `tree.color` (the whole Tree row hovering lights it). One caret icon turns by transform, animated over `tree.expander.animationDuration` / `animationEasing`, with no transition under reduced motion; the open/closed direction is one constant in Tree. TreeGuide `rooted` draws an empty root column first on every row; each level indents by `tree.guide.indent` (the guide's arm now runs to the column's end) and labels follow after `tree.guide.labelGap`. TreeExpanderSlot is a zero-width marker. TableCell's `guide` accepts `rooted`; TableRow feeds each row state's surface to the expander fill.
