---
"@niceprototypes/table": minor
"@niceprototypes/datatable": minor
"@niceprototypes/styles": minor
"@niceprototypes/badge": patch
"@niceprototypes/checkbox": patch
---

Table: `striped` (default true) alternates body rows by visible order (`table.backgroundColor:stripe`, a 50% oklch mix of the table surface and background-color--raised) with a `table.borderColor:row` divider on every row (border-color in day, border-color--subtle in night); dividers are inset shadows, so rows keep one height and TreeGuide lines join. `alignItems` on Table (start | center | end, default start) with a TableRow override; cell content is one line box tall (`table.cell.lineHeight`), so controls centre on the first text line. Row text uses color--light, hover and selected use color (base); selected follows hover's background (`table.backgroundColor:selected` aliases hover, sunken in both themes). The header row uses the table surface, color--lighter at the base font weight. Cell block padding aliases the inline padding.

DataTable: `childDensity` ("base" default, "compact" opt-in); nested rows match top-level rows by default. The row actions menu folds into one line box.

Badge: backgrounds are their status tint at 75% over the surface beneath (`color-mix(in oklch, … 75%, transparent)`); line height single (20px badge, inside a 21px table line).

Checkbox: hover and active border on the neutral border variants is color (base).
