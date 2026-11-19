---
"@niceprototypes/code": patch
---

Code renders no live-demo region when `children` is `null`, so `{condition ? <Demo /> : null}` no longer draws an empty panel above the code.
