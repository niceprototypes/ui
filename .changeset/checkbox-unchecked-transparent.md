---
"@niceprototypes/styles": patch
"@niceprototypes/checkbox": patch
---

Checkbox: the unchecked box is transparent (`checkbox.backgroundColor.unchecked` and its hover and active variants), so it takes the surface beneath it, such as a striped or hovered table row, instead of drawing a base-coloured square. Border and checked fill unchanged.
