---
"@niceprototypes/flow": minor
"@niceprototypes/styles": minor
"@niceprototypes/tree": minor
"@niceprototypes/docs": minor
---

Flow: a root column's nested first and last children lose their outer margin down six nested columns, judged from the root only, so a root inside another flow's later child (a grid cell under a page column) flushes them too. A heading straight after a rule, or opening the column after it, drops its before-space; `flow.rule.after` is `gap.large + gap.small` (visual change: rule to heading 40px at laptop, was 80). Tree: `tree.activeBackgroundColor`, `tree.activeBorderRadius` and `tree.activePaddingInline` style the current page's link (transparent and none by default). Docs: DocsColumns and DocsRule docs pages with live examples.
