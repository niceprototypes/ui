---
"@niceprototypes/datatable": minor
"@niceprototypes/styles": minor
---

DataTable's action menus are MenuButton (@niceprototypes/menu): row actions open from an icon-only ghost trigger, and the bulk actions bar is always rendered with one ghost, select-look MenuButton that reads "None selected" (disabled) or "N selected", so selecting rows no longer pushes the grid down. The bar keeps the table's surface (no blue). Menu items are `aria-disabled` rather than disabled buttons; the DataTable API is unchanged. Peers: `@niceprototypes/menu` replaces `@niceprototypes/button` and `@niceprototypes/popover`. Removes the `datatable.menu.padding` and `datatable.toolbar.backgroundColor` tokens.
