# @niceprototypes/table

## Install

```sh
pnpm add @niceprototypes/table
```

Peer dependencies and app setup: [Build on Nice](../../manifest/agents/README.md).

## Usage

```tsx
import { Table, TableCell, TableHeader, TableRow } from "@niceprototypes/table"
```

`Table` also takes `breakpoints`: breakpoint keys to partial props (`BreakpointOverride`, `packages/styles/src/react/services/withBreakpoints`). `TableHeader`, `TableRow` and `TableCell` are not wrapped: a table renders one per row or cell, and each wrap would subscribe to viewport changes.

## Docs

| Component | Storybook story |
|---|---|
| Table | `components-table--playground` |

TableHeader, TableRow and TableCell are documented on the Table page. Storybook runs with `pnpm storybook` at the nice-ux root. Props, types, defaults, token addresses and exports: [`manifest/agents/catalog.json`](../../manifest/agents/catalog.json), from the nice-ux root:

```sh
jq '.packages[]|select(.package=="@niceprototypes/table")' manifest/agents/catalog.json
```

## License

MIT
