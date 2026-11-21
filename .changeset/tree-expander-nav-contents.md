---
"@niceprototypes/tree": minor
"@niceprototypes/datatable": minor
"@niceprototypes/app": minor
"@niceprototypes/styles": minor
---

Tree: new TreeExpander (the circled caret, moved from DataTable) and TreeExpanderSlot, on new `tree.expander.*` tokens (`color` base/hover/active, `size`, `iconSize`, `borderWidth`, `touchTarget`); `datatable.expander.*` tokens are removed (breaking for overrides of them). Every Tree row with sub-rows shows the caret (right while open, down while closed); a folder with a url gets an expander button before its link; a row without sub-rows keeps the slot with the guide's arm drawn through it, so labels line up at every depth. Right opens and Left closes a row; closing a row closes every row under it except the active path. `onExpandedChange`'s event is now `React.SyntheticEvent<HTMLElement>` (visual change for every Tree consumer). DataTable uses TreeExpander. App: `contents` prop lists a page's in-page sections under it in the nav (the current page opens, its section in view active), and `useAppContents` lets the page report its Contents rows and the section in view.
