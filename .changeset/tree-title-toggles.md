---
"@niceprototypes/tree": minor
---

A Tree row with sub-rows and a url is one control: its title link carries `aria-expanded` and `aria-controls`, and its circle is a mouse-only mark (no separate expander button). On the active path the title toggles the sub-rows exactly as the circle does (closing them closes everything under them); elsewhere it follows the link. Space acts as Enter on it.
