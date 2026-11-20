import * as React from "react"
import Flow from "@niceprototypes/flow"
import Ink from "@niceprototypes/ink"
import DocsInk from "../../nice/Ink"
import Code from "@niceprototypes/code"
import type { CatalogPropType } from "../../data/catalog"
import { renderInline } from "../../data/text"
import type { ComponentExample } from "../../dataTables/components/demos/Components"
import ExampleBlocks from "../ExampleBlocks"
import { StyledPropDocsMeta } from "./PropDocs.styles"

/**
 * A heading two levels under the page title (a prop, an example), and its description, in an
 * Flow column. A string description renders its `backtick` spans as inline code.
 */
export const SubHeading = ({ title, description }: { title: string; description?: React.ReactNode }) => (
  <Flow>
    <DocsInk as="h3">{title}</DocsInk>
    {description ? <DocsInk as="p">{typeof description === "string" ? renderInline(description) : description}</DocsInk> : null}
  </Flow>
)

/** One labelled row of a prop's metadata grid. */
const MetaRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <>
    <dt>
      <Ink size="small" color="lighter">{label}</Ink>
    </dt>
    <dd>{children}</dd>
  </>
)

/**
 * PropDocs
 *
 * One prop, from the catalog, in a Flow column: its name, its description, a labelled
 * grid of its type, default and whether it is required, then its live examples when it has some.
 */
const PropDocs = ({ prop, example }: { prop: CatalogPropType; example?: ComponentExample }) => (
  <Flow>
    <SubHeading title={prop.name} description={prop.description ?? example?.description} />
    <StyledPropDocsMeta>
      <MetaRow label="Type">
        <Code language="tsx" code={prop.type} inlined margin="none" />
      </MetaRow>
      {prop.default !== undefined && (
        <MetaRow label="Default">
          <Code language="tsx" code={prop.default} inlined margin="none" />
        </MetaRow>
      )}
      {prop.required ? (
        <MetaRow label="Required">
          <Ink size="small">Yes</Ink>
        </MetaRow>
      ) : null}
    </StyledPropDocsMeta>
    {example && <ExampleBlocks example={example} />}
  </Flow>
)

export default PropDocs
