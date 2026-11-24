---
"@niceprototypes/code": minor
"@niceprototypes/docs": patch
---

Code takes `highlightContext` ({ before, after }): the code is highlighted inside that surrounding source and only its own text shows, so a bare JSX attribute (`size="small"`) highlights as one. The docs value lines (ExampleValues) are inline code sized to their text, one per line `gap.smaller` apart, highlighted as JSX attributes in the code panels' colours, with no copy affordance and the `// default` comment kept.
