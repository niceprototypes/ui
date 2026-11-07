# @niceprototypes/input

## 4.0.0

### Major Changes

- 92f9032: Input is field chrome around an input, select or textarea; status (base, disabled, error, success, warning) replaces state, filled replaces primary/secondary, backgroundColor and borderColor take colour tokens instead of raw CSS, and getInputToken is removed. Adds ref, as, start and end slots, width, rows, ghost, disabled, passwordReveal, Field wiring, aria-invalid on error, ARIA passthrough props, token-driven transitions, and a named Input export.

### Patch Changes

- Updated dependencies [92f9032]
- Updated dependencies [92f9032]
- Updated dependencies [9e37bef]
  - @niceprototypes/button@10.0.0
  - @niceprototypes/styles@18.0.0

## 3.1.0

### Minor Changes

- b9a769b: Input `as="textarea"`: `maxRows` caps growth in lines (scrolls past it, no resize handle) and `onSubmit(value, event)` submits on Enter without Shift, outside IME composition, after `onKeyDown` unless it prevented default.
