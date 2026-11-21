import styled from "styled-components"
import { getToken } from "@niceprototypes/styles"

/** A prop's name row: the name, its type and its presence on one baseline, a small gap apart, wrapping when long. */
export const StyledPropDocsName = styled.h4`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0 ${getToken("gap", "small")};
  font: inherit;
`
