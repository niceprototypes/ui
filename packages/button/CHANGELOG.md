# @niceprototypes/button

## 10.0.0

### Major Changes

- 92f9032: Removes the getButtonToken export (read button tokens with getToken from @niceprototypes/styles); buttons are content-width at every breakpoint. Adds ref, grow, ghost, selected, color, iconColor, justifyContent, animationDuration and ARIA passthrough props, a named Button export, and filled borders that read the button.backgroundColor status token.

### Patch Changes

- Updated dependencies [92f9032]
- Updated dependencies [92f9032]
- Updated dependencies [92f9032]
- Updated dependencies [9e37bef]
  - @niceprototypes/icon@9.0.0
  - @niceprototypes/ink@9.0.0
  - @niceprototypes/styles@18.0.0

## 9.2.0

### Minor Changes

- 661c953: Button: default label and border colours read the `button.color` / `button.borderColor` tokens (filled label: `button.color` inverse; inlined: `button.color:link`), so `setTokens({ button })` restyles a default button; the element-scoped height is the new `button.height` token; `iconSize`, `iconStrokeWidth` and `iconStrokeScaling` props; `loading` shows the spinner icon over the hidden content (width kept), sets `aria-busy` and ignores activation while staying focusable.
