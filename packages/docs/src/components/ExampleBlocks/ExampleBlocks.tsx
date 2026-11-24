import * as React from "react"
import Flow, { FlowItem } from "@niceprototypes/flow"
import Ink from "@niceprototypes/ink"
import Flex from "@niceprototypes/flex"
import Code from "@niceprototypes/code"
import DocsInk from "../../nice/Ink"
import { StyledExampleBlocksTile } from "./ExampleBlocks.styles"
import { variantKey } from "../../dataTables/utilities"
import type { ComponentExample } from "../../dataTables/components/demos/Components/Components.types"

/**
 * ExampleBlocks
 *
 * A facet's live examples, one per variant, in a Flow column: one full-width Code block each,
 * the live demo above its code, bleeding to the page's edges on phone. With `labels` (the
 * default) each block has an h4 naming its variant as an inline chip ("default" beside the default
 * one); without, the blocks stand alone and the variants are named beside them (ExampleValues).
 */
const ExampleBlocks = ({ example, labels = true }: { example: ComponentExample; labels?: boolean }) => {
  const defaultVariant = example.default ?? "base"
  return (
    <Flow>
      {example.variants.map(item => {
        const variant = variantKey(item)
        return (
          <React.Fragment key={variant}>
            {labels ? (
              <DocsInk as="h4">
                <Code code={variant} inlined margin="none" />
                {variant === defaultVariant ? <Ink size="small" color="lighter">{" default"}</Ink> : null}
              </DocsInk>
            ) : null}
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

/** Source around a value line, so it highlights as a JSX attribute (and its comment) inside a tag. */
const JSX_ATTRIBUTE = { before: "<X ", after: "\n/>" }

/** A variant as a JSX attribute value: a boolean, number or null as an expression, else a string. */
const attributeValue = (variant: string) => (/^(true|false|null|-?\d+(\.\d+)?)$/.test(variant) ? `{${variant}}` : `"${variant}"`)

/**
 * ExampleValues
 *
 * A facet's variants as inline code, sized to its text, one per line in its demos' order, the
 * smallest gap apart: `name="value"`, and `// default` (a comment) after the default one. Display only: no
 * copy button, no copy on click.
 */
export const ExampleValues = ({ name, example }: { name: string; example: ComponentExample }) => {
  const defaultVariant = example.default ?? "base"
  return (
    <Flex direction="column" alignItems="flex-start" gap="smaller">
      {example.variants.map(item => {
        const variant = variantKey(item)
        return (
          <Code
            key={variant}
            language="tsx"
            code={`${name}=${attributeValue(variant)}${variant === defaultVariant ? " // default" : ""}`}
            inlined
            fit
            // Highlighted as an attribute in a tag, as in the code panels; only the attribute shows.
            highlightContext={JSX_ATTRIBUTE}
            margin="none"
            showLabel={false}
            copyOnClick={false}
          />
        )
      })}
    </Flex>
  )
}

export default ExampleBlocks
