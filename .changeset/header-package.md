---
"@niceprototypes/header": minor
"@niceprototypes/ux": minor
"@niceprototypes/styles": minor
---

Add @niceprototypes/header (Header): the outer page-header wrapper. Static by default; sticky (recommended) or fixed with its measured height kept in the flow (fixed stays in the flow until mounted and while the on-screen keyboard is open), written to `--np--header--height` and `--np--header--inset` on the root, with an overridable `:where()` scroll-padding rule; a stuck state detected by IntersectionObserver, released by `stopAt` (scroll distance or element) or the sticky containing block's end; `threshold`, `offset`, `root` scroll containers; `hideOnScroll` with `tolerance`, an overscroll guard, reveal at the end, pauses for in-page links, hashchange, focus and the keyboard, and `resetKey` for route changes; safe-area insets; per-state `appearance` (colours, border, shadow, font size) with `transitionDuration`/`transitionEasing` and reduced motion; `state` and `onStateChange`. The `header.*` tokens, and its re-export from @niceprototypes/ux.
