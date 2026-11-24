---
"@niceprototypes/code": minor
---

A code block inside another Code block's live demo (its children) renders flat: no border, radius, shadow, surface or padding of its own, keeping its highlighting and copy icon, so a code box never nests inside another. Code's demo provides the new internal CodePreviewContext; inline code is unchanged.
