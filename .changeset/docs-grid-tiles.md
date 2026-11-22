---
"@niceprototypes/flow": minor
"@niceprototypes/contents": minor
"@niceprototypes/app": minor
"@niceprototypes/styles": minor
"@niceprototypes/docs": minor
---

Flow makes a column's link and span children block-level (a link `flex`, as wide as its content), so their margins collapse with their neighbours' (visual change: no stacked gaps after inline links). Contents draws one active indicator that slides between rows by transform (`contents.indicator.animationDuration` / `animationEasing`, no slide before the reader acts or under reduced motion) and has a `contents.color.hover` token (defaults to the active colour). App: `app.sidebar.rule.*` (a rule on the nav's end edge, transparent by default) and `app.docs.paddingInline` (the docs screen's inset across); a page's sections never repeat its name, an ancestor's or a sibling page's, and an empty `contents` list opts a page out. Docs: `DocsRule` keeps its column's width (HEADING_RULES maps h2 to an edge rule, h3 to an inset rule, h4+ to none; `getHeadingRuleStyle` draws them in DocsContent), `docsHeadingsOfContent` / `docsHeadingsOfSource` services (a page's own h2/h3, title excluded), `navContents` data setting, new `docs.tilePadding`, `tileMeasure`, `gridLineWidth`, `gridLineColor` tokens; PropDocs no longer draws a rule (lists put one between items).
