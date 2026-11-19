import styled from "styled-components"
import Ink from "@niceprototypes/ink"
import type { MetricsMaxWidthType } from "./Metrics.types"

/** The label Ink, at most `$maxWidth` wide and centred in the column by auto inline margins. */
export const Label = styled(Ink)<{ $maxWidth: MetricsMaxWidthType }>`
  max-width: ${({ $maxWidth }) => $maxWidth};
  margin-inline: auto;
`
