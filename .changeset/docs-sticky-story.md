---
"@niceprototypes/docs": minor
---

A story's text column stays in view while its demos scroll past, until the story ends (DocsColumns `sticky`: `main` for stories, `aside` by default, as the Playground's preview), from laptop up at `contents.top`; stacked below laptop nothing sticks. DocsPage's sections column is no longer a horizontal scroller: as a scroll container it caught every sticky column inside it without ever scrolling; the App's region scrolls the page both ways instead.
