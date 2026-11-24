---
"@niceprototypes/docs": minor
"@niceprototypes/docs-site": patch
---

The docs site shell moves from apps/docs into @niceprototypes/docs, so every docs site shares one implementation: DocsApp (App with the docs end column, the settings with ThemeToggle, the docs global style), DocsPage, DocsEnd, MdxPage, ThemeToggle (stores the choice under the key niceThemeBootstrap names) and DocsSiteTokenMap (`nice/siteTokens`, the shell's token overrides; `docs.settingsWidth` joins AppTokenMap). The docs site uses them and sets its theme with config-vite's niceThemeBootstrap (night, `nice-docs-theme`) in place of its inline script.
