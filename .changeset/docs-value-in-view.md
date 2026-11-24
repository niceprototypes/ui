---
"@niceprototypes/docs": minor
---

A story's value lines show which demo is on screen: beside the demos (laptop and up) with more than one value, the line whose demo is the one in view (across the view's middle, else showing the most of itself) is outlined in `docs.activeColor`; the other lines keep a transparent border of the same width, so no line changes size. The border colour eases over the base animation duration (none under reduced motion). Two IntersectionObservers on the scroll container (the App's region); no scroll listener.
