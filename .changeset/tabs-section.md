---
"@niceprototypes/tabs": minor
"@niceprototypes/flow": minor
"@niceprototypes/input": minor
---

Tabs: `TabsSection`, a section heading that carries its tabs: the title (h2, h3 or h4 by `level`) at the left of the heading row, the tabs at its right edge, the selected tab's panel below; below `selectBelow` (a breakpoint token floor, tablet by default) the tabs become a native Select on the same row, named by the heading and driving the same panel. It renders the row and the panel as two siblings, so a Flow column spaces the row as its heading. Tabs and TabsSection share one internal tab list (no Tabs API change). Tabs now peers on flow, ink and select. Flow: `FLOW_ROLE_ATTRIBUTE` (`data-flow-role`) gives any child a role's space, and a heading row after a rule drops its before-space like a heading. Input: `aria-labelledby` reaches the native control.
