---
"@niceprototypes/docs": patch
---

Docs headings and bare markdown `strong`, `b`, `th` and headings render semibold (`fontWeight.semibold`) instead of bold: the docs Ink wrapper defaults headings to semibold, PropDocs headings use it, and DocsContent sets the bare elements.
