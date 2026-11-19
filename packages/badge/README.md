# @niceprototypes/badge

## Install

```sh
pnpm add @niceprototypes/badge
```

Peer dependencies and app setup: [Build on Nice](../../manifest/agents/README.md).

## Usage

```tsx
import Badge from "@niceprototypes/badge"
```

`Badge` also takes `breakpoints`: breakpoint keys to partial props (`BreakpointOverride`, `packages/styles/src/react/services/withBreakpoints`).

## Docs

| Component | Storybook story |
|---|---|
| Badge | `components-badge--playground` |

Props, types, defaults, token addresses and exports: [`manifest/agents/catalog.json`](../../manifest/agents/catalog.json), from the nice-ux root:

```sh
jq '.packages[]|select(.package=="@niceprototypes/badge")' manifest/agents/catalog.json
```

## License

MIT
