---
"@niceprototypes/tree": minor
"@niceprototypes/table": patch
"@niceprototypes/styles": minor
"@niceprototypes/badge": patch
---

TreeGuide: offset mode. Under an ancestor with `data-tree-guide-arm="offset"`, each arm sits `tree.guide.armOffset` (new token, default 50%) from the top of the row and a last child's rail ends there; without it nothing changes. Table turns it on and sets the offset per alignment (start: block padding plus half a line), so arms meet the first text line in multi-line rows. Compact rows reassign the block padding variable.

Badge: the base background is the surface mixed 14% toward the text colour (then 75% over the row), so it stays distinct from base, stripe, hover and selected rows in both themes.
