# @niceprototypes/docs

The docs building blocks shared by the Storybook (`@niceprototypes/storybook`) and the docs site
(`@niceprototypes/docs-site`): the docs data, the shared MDX pages, the component examples, and the
components that lay out a docs page.

Private and source-only: it has no build, and every export points at a file in `src/`. Workspace
packages depend on it with `"@niceprototypes/docs": "workspace:^"`.

## Contents

| Path | Holds |
|---|---|
| `src/data/` | `storybook.json`, the one docs tree (sidebar order, page settings, column sets), its schema, and the getters over it (`getTree`, `getItem`, `getColumns`, …); `catalog.ts` reads `manifest/agents/catalog.json` |
| `src/content/` | The MDX pages both apps render (Onboarding, Bindings, Configuration, CLI) |
| `src/examples/` | Each component's live examples by facet; `componentExamples` collects every `examples/<Component>/index.tsx` |
| `src/components/` | Page parts: `Story`, `DataTable`, `PropDocs`, `SubcomponentDocs`, `Install`, `Callout`, `ShikiPre`, … |
| `src/dataTables/` | Token tables and demo tables built on `DataTable` |
| `src/nice/` | The docs `setTokens` call with its typed `getToken` (`nice/tokens`); the `Ink`, `Code` and `ContentFlex` wrappers |
| `src/services/` | `toSource`, `parseTokenVarLink` |

## Usage

Import by subpath; the `exports` map in `package.json` lists every one.

```tsx
import { DataTable } from "@niceprototypes/docs/components/DataTable"
import { getColumns } from "@niceprototypes/docs/data"
```

The apps load `src/content/` by path, not through `exports`: the Storybook through its `stories`
glob (`apps/storybook/.storybook/main.ts`), the docs site through `import.meta.glob`
(`apps/docs/src/pages.tsx`). `npm run check:data` in `apps/storybook` validates `storybook.json`.

Requires (peers): `react` 19, `react-dom` 19, `styled-components` 6, `@storybook/addon-docs` ≥ 10.

## License

MIT
