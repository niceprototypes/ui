# @niceprototypes/flow

## Install

```sh
pnpm add @niceprototypes/flow
```

Peer dependencies and app setup: [Build on Nice](../../manifest/agents/README.md).

## Usage

```tsx
import { Flow, FlowItem } from "@niceprototypes/flow"
```

## Docs

| Component | Docs page |
|---|---|
| Flow | `components-flow--docs` |

Props, types, defaults, token addresses and exports: [`manifest/agents/catalog.json`](../../manifest/agents/catalog.json), from the repo root:

```sh
jq '.packages[]|select(.package=="@niceprototypes/flow")' manifest/agents/catalog.json
```

## License

MIT
