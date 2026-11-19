# @niceprototypes/tree

## Install

```sh
pnpm add @niceprototypes/tree
```

Peer dependencies and app setup: [Build on Nice](../../manifest/agents/README.md).

## Usage

```tsx
import { Tree, TreeGuide, getTreeRows } from "@niceprototypes/tree"
```

`TreeGuide` draws the guide lines of one row of any tree-shaped list; `getTreeRows` flattens a nested list into its visible rows with their guide data.

`Tree` and `TreeGuide` also take `breakpoints`: breakpoint keys to partial props (`BreakpointOverride`, `packages/styles/src/react/services/withBreakpoints`).

## Docs

| Component | Storybook story |
|---|---|
| Tree | `components-tree--playground` |
| TreeGuide | `components-treeguide--playground` |

Storybook runs with `pnpm storybook` at the nice-ux root. Props, types, defaults, token addresses and exports: [`manifest/agents/catalog.json`](../../manifest/agents/catalog.json), from the nice-ux root:

```sh
jq '.packages[]|select(.package=="@niceprototypes/tree")' manifest/agents/catalog.json
```

## License

MIT
