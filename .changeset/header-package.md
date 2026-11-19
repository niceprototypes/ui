---
"@niceprototypes/header": minor
"@niceprototypes/ux": minor
"@niceprototypes/styles": minor
---

Add @niceprototypes/header (Header): the outer page-header wrapper. Static by default; sticky or fixed with its measured height kept in the flow, written to `--np--header--height` and the root's `scroll-padding-top`; a stuck state detected by IntersectionObserver; `threshold`, `offset`, `stopAt` (scroll distance or element), `hideOnScroll` with `tolerance` and an overscroll guard, `root` scroll containers; per-state `appearance` (colours, border, shadow, font size) with `transitionDuration`/`transitionEasing` and reduced motion; `state` and `onStateChange`. The `header.*` tokens, and its re-export from @niceprototypes/ux.
