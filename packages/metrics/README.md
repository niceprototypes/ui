# @niceprototypes/metrics

## Install

```sh
pnpm add @niceprototypes/metrics
```

Peer dependencies and app setup: [Build on Nice](../../manifest/agents/README.md).

## Usage

```tsx
import { Metrics } from "@niceprototypes/metrics"
```

`maxWidth` (a CSS length) caps the label's width; it defaults to the `metrics.label.maxWidth` token (24ch), and the label stays centred.

`Metrics` also takes `breakpoints`: breakpoint keys to partial props (`BreakpointOverride`, `packages/styles/src/react/services/withBreakpoints`).

## Docs

| Component | Storybook story |
|---|---|
| Metrics | `components-metrics--playground` |

Storybook runs with `pnpm storybook` at the nice-ux root. Props, types, defaults, token addresses and exports: [`manifest/agents/catalog.json`](../../manifest/agents/catalog.json), from the nice-ux root:

```sh
jq '.packages[]|select(.package=="@niceprototypes/metrics")' manifest/agents/catalog.json
```

## License

MIT
