---
"@niceprototypes/icon": patch
---

Icon no longer renders a `<style>` element per instance: the built-in icons carry their fill and stroke as presentation attributes, with the same rendered output. A 1,000-row DataTable drops from 2,101 inline style elements to none.
