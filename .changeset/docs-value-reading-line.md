---
"@niceprototypes/docs": patch
---

A story's outlined value line follows one activation line, where the lines pin (`contents.top`): the last demo whose top has crossed it, the first before any has, and at the end of the scroll container the last demo whose top is visible (pickVariantInView, tested). Replaces the middle-of-view / most-visible rule, which flipped between demos when none crossed the middle. Measured before paint, then each scroll frame and resize.
