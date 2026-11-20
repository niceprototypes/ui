---
"@niceprototypes/flow": minor
"@niceprototypes/ink": minor
"@niceprototypes/styles": minor
"@niceprototypes/ux": minor
---

Add @niceprototypes/flow: Flow spaces a vertical stack of content by role (h1–h6, text, list, blockquote, table, code, media, rule, block) from the new `flow.*` tokens, times `flow.density` (per instance: compact, base, spacious) and `flow.scale` (per breakpoint: tighter on phone and tablet). `space` overrides roles per instance; FlowItem overrides one child; `getFlowStyle` applies the rules to any container. Ink: `flow` (default false) applies Flow's rules to the element's children, and `as` takes "div" and "section". Re-exported from @niceprototypes/ux.
