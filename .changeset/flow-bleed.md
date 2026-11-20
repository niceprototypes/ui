---
"@niceprototypes/flow": minor
"@niceprototypes/app": minor
"@niceprototypes/styles": minor
---

Flow bleed: FlowItem `bleed` reaches past the column's sides by `flow.bleed`, and `getBleedRadius` squares a tile's corners while it bleeds. App publishes its page gutter as `flow.bleed` on phone (new `app.docs.padding` and `app.docs.bleed` tokens; 0 from tablet), so preview tiles run edge to edge on phone.
