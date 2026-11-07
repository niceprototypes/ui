# @niceprototypes/popover

## 0.3.0

### Minor Changes

- 92f9032: Popover flips to the opposite side and shifts along the cross axis to stay in the viewport (computeAnchorPosition takes optional bounds), and its colours read popover.backgroundColor and popover.color. Adds the getAnchorOffset service and a named Popover export.

### Patch Changes

- Updated dependencies [92f9032]
- Updated dependencies [92f9032]
- Updated dependencies [9e37bef]
  - @niceprototypes/scroll@3.0.0
  - @niceprototypes/styles@18.0.0

## 0.2.0

### Minor Changes

- dfd23f0: Scroll: the scroll container every scrolling region renders through (`axis`, `showScrollbar`, `as`, `ref`). Scrollbars are hidden by default; the `scroll.scrollbarWidth` token sets the project default. Popover, List, Contents, Slider and the App shell's nav, sidebar, footer and scene region scroll through it.
