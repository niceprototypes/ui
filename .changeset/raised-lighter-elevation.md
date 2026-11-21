---
"@niceprototypes/styles": minor
"@niceprototypes/card": minor
"@niceprototypes/input": minor
---

Elevation goes lighter as a surface is raised (visual change). Night: `backgroundColor` sunken 8.5% < base 12.5% < raised 15.5% < overlay 18.5% lightness (raised was 10%, darker than the page). Day keeps a white base, raised and overlay (elevation by shadow and border) with sunken at 95% the one grey step below. Popover, Menu and Dialog surfaces use `overlay`; Table stripes sit 35% toward `sunken`, with hover and selected on `sunken` (darker than both stripes in both themes) and compact child rows on the stripe. New `card.filled.backgroundColor` and `input.filled.backgroundColor` (sunken in day, raised in night) back the filled Card and Input; Chat's user message takes the same fill. Badge status tints are 12% of the status colour over the row, and status text is mixed toward the text colour (45% day, 20% night) for 5.1:1 or more on its tint. `gap.none` is `0px`, so token calc on it stays a length. `setTokens({ breakpoints })` places its breakpoint sheet before the token sheet, so a map's component overrides hold above phone whichever call came first.
