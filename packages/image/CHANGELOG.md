# @niceprototypes/image

## 4.0.0

### Major Changes

- 92f9032: Removes the getImageToken export (read image tokens with getToken). borderColor accepts the colour object form, and Image has a named export.

### Patch Changes

- Updated dependencies [92f9032]
- Updated dependencies [9e37bef]
  - @niceprototypes/styles@18.0.0

## 3.1.0

### Minor Changes

- aebe8ae: Add `thumbnail` (a data URI painted blurred, or a URL, on the same element until the full image loads; `false` opts out), and `loading`/`fetchPriority` passthrough to Image; the img now decodes async. Pair with `nicely thumbnails <dir>` from @niceprototypes/cli, which writes 16px thumbnails and aspect ratios keyed by public path.
