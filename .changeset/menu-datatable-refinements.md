---
"@niceprototypes/menu": minor
"@niceprototypes/datatable": minor
"@niceprototypes/styles": minor
---

MenuButton: `ghost` takes Button's per-state form and `iconColor` is passed to the trigger; a select-look trigger that is not ghost shows the `menu.trigger.borderColor` border, which aliases the Checkbox's unchecked border and, on hover, its hover border. DataTable: the bulk control is ghost only with nothing selected and outlined once rows are; row action triggers stay ghost in every state, their icon lighter at rest and base on hover, focus and press; the expander caret sits in a circle the size of the small Checkbox box, both in the Checkbox's unchecked border colour (its hover border colour on hover), without moving the row or the guide. Adds the `menu.trigger.borderColor` and `datatable.expander.*` tokens.
