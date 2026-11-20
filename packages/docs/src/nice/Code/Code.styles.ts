import styled from "styled-components"
import ContentFlex from "../ContentFlex"

/**
 * Sizing wrapper for docs Code instances: a ContentFlex the card inside always fits.
 *
 * @niceprototypes/code's card fills its container up to the `code.maxWidth` token
 * (`width: max-content` when `fit`); the child rule keeps a fit card inside this
 * wrapper as well.
 */
export const CodeFlex = styled(ContentFlex)`
  min-width: 0;

  & > * {
    max-width: 100%;
  }

  /* A block Code fills its column; a Flow column spaces it from the blocks around it. */
  ${({ inlined }) => !inlined && `width: 100%;`}
`
