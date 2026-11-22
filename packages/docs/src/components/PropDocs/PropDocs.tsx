import Flow from "@niceprototypes/flow"
import Ink from "@niceprototypes/ink"
import DocsInk from "../../nice/Ink"
import type { CatalogPropType } from "../../data/catalog"
import { renderInline } from "../../data/text"
import type { ComponentExample } from "../../dataTables/components/demos/Components"
import { StyledPropDocsName } from "./PropDocs.styles"

/** Whether the prop is required, else optional with its default when it has one. */
const Presence = ({ prop }: { prop: CatalogPropType }) => {
  if (prop.required) return <Ink size="small" color="lighter">required</Ink>
  if (prop.default === undefined) return <Ink size="small" color="lighter">optional</Ink>
  return (
    <Ink size="small" color="lighter">
      {"optional, default is "}
      <Ink code size="small" color="lighter">{prop.default}</Ink>
    </Ink>
  )
}

/**
 * PropDocs
 *
 * One prop, from the catalog, as an item of a parameter list (Stripe's API reference): its name
 * in semibold code with its type and whether it is required (or its default) small and muted on
 * the same baseline, then its description, a small gap below. The list puts a subsection rule
 * between items (DocsPage), never above the first, under its heading.
 */
const PropDocs = ({ prop, example }: { prop: CatalogPropType; example?: ComponentExample }) => {
  const description = prop.description ?? example?.description
  return (
    <Flow space={{ h4: { before: "none", after: "small" } }}>
      <StyledPropDocsName>
        <Ink code weight="semibold">{prop.name}</Ink>
        <Ink code size="small" color="lighter" wordBreak="break-word">{prop.type}</Ink>
        <Presence prop={prop} />
      </StyledPropDocsName>
      {description ? <DocsInk as="p">{typeof description === "string" ? renderInline(description) : description}</DocsInk> : null}
    </Flow>
  )
}

export default PropDocs
