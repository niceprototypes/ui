import styled from "styled-components"
import { getToken } from "@niceprototypes/styles"

/** A prop's metadata as one label/value grid: the labels in one column, the values aligned beside them. */
export const StyledPropDocsMeta = styled.dl`
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  align-items: center;
  gap: ${getToken("gap", "small")} ${getToken("gap", "base")};

  & > dd {
    margin: 0;
    min-width: 0;
  }
`
