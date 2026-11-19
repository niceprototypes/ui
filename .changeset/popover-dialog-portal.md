---
"@niceprototypes/popover": minor
---

Popover portals into the open `<dialog>` holding its anchor (else `<body>`), so inside a modal Dialog it shows above the dialog and takes clicks and focus instead of sitting inert behind the top layer. It measures its surface with `getBoundingClientRect()`, so the shift into the viewport uses the fractional size and no longer leaves it a sub-pixel past the edge.
