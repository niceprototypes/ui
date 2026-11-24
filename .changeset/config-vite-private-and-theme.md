---
"@niceprototypes/config-vite": minor
---

Local mode resolves a private checkout package's import (`@niceprototypes/docs/…`) to the file its `exports` names, since private packages are not in the umbrella's install. New `niceThemeBootstrap({ theme, storageKey })` Vite plugin: an inline script at the top of `<head>` sets `<html data-theme>` to the stored choice, else `theme`, before first paint, and names the key on `<html data-theme-storage>` for a theme switch to store into.
