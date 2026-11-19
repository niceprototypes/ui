# @niceprototypes/datatable

## Install

```sh
pnpm add @niceprototypes/datatable
```

Peer dependencies and app setup: [Build on Nice](../../manifest/agents/README.md).

## Usage

```tsx
import DataTable from "@niceprototypes/datatable"
```

`DataTable` also takes `breakpoints`: breakpoint keys to partial props (`BreakpointOverride`, `packages/styles/src/react/services/withBreakpoints`). It is built on `@niceprototypes/table`.

## Docs

| Component | Storybook story |
|---|---|
| DataTable | `patterns-datatable--playground` |

Storybook runs with `pnpm storybook` at the nice-ux root. Props, types, defaults, token addresses and exports: [`manifest/agents/catalog.json`](../../manifest/agents/catalog.json), from the nice-ux root:

```sh
jq '.packages[]|select(.package=="@niceprototypes/datatable")' manifest/agents/catalog.json
```

## License

MIT
