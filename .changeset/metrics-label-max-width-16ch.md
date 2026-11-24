---
"@niceprototypes/styles": patch
"@niceprototypes/metrics": patch
---

`metrics.label.maxWidth` (`--np--metrics--label--max-width`) is 16ch, was 24ch: a Metrics label wraps sooner. Consumers that set the token themselves keep their value.
