import * as React from "react"
import Flow, { FlowItem } from "@niceprototypes/flow"
import Ink from "@niceprototypes/ink"
import Code from "@niceprototypes/code"
import DocsInk from "../../nice/Ink"
import { StyledExampleBlocksTile } from "./ExampleBlocks.styles"
import { variantKey } from "../../dataTables/utilities"
import type { ComponentExample } from "../../dataTables/components/demos/Components/Components.types"

/**
 * ExampleBlocks
 *
 * A facet's live examples, one per variant, in a Flow column: an h4 naming the variant as
 * an inline chip (the default one labelled "default"), and under it one full-width Code block
 * with the live demo above its code, bleeding to the page's edges on phone.
 */
const ExampleBlocks = ({ example }: { example: ComponentExample }) => {
  const defaultVariant = example.default ?? "base"
  return (
    <Flow>
      {example.variants.map(item => {
        const variant = variantKey(item)
        return (
          <React.Fragment key={variant}>
            <DocsInk as="h4">
              <Code code={variant} inlined margin="none" />
              {variant === defaultVariant ? <Ink size="small" color="lighter">{" default"}</Ink> : null}
            </DocsInk>
            <FlowItem bleed>
              <StyledExampleBlocksTile>
                <Code code={example.code(item)} language="tsx">
                  {example.preview(item)}
                </Code>
              </StyledExampleBlocksTile>
            </FlowItem>
          </React.Fragment>
        )
      })}
    </Flow>
  )
}

export default ExampleBlocks
