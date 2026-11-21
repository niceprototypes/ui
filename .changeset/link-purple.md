---
"@niceprototypes/styles": minor
"@niceprototypes/docs": patch
---

Link colour is purple (visual change): day #4332ff, night #9990fa (`color.link`; the focus ring follows it). The link tint and border families (`backgroundColor.link`, `borderColor.link`) move to the same hue (245) at their earlier saturation and lightness. Link text on its surfaces: day 6.69:1 on base, raised and overlay, 5.97:1 on sunken, 5.48:1 on the link tint; night 6.66:1 on base, 6.07:1 raised, 5.57:1 overlay, 7.25:1 sunken, 6.15:1 on the link tint. Docs: `docs.activeColor` is `color.link` in each theme; the active sidebar tint is the link colour at 8% (day) and 12% (night) alpha, and the selection colour follows the same pair.
