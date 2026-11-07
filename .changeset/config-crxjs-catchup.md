---
"@niceprototypes/config-crxjs": minor
---

createExtensionConfig takes local, passed to config-vite local mode; niceCrxjs runs before config-vite plugins so the tokens.css side-effect import is still emptied in local mode.
