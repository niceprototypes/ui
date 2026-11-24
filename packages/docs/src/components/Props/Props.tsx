import * as React from "react"
import Contents from "@niceprototypes/contents"
import DocsColumns from "../DocsColumns"
import DocsRule from "../DocsRule"
import { StyledPropsStory } from "./Props.styles"
import type { PropsProps } from "./Props.types"

/**
 * Props
 *
 * A component's props demoed as stories: at its top, a list of every story (Contents in the
 * page's flow: a link scrolls smoothly to its story, instantly under reduced motion, and names it
 * in the address), then each story in the story layout (DocsColumns: its text beside its demo), a
 * subsection rule between two of them. The list is content, not the page's navigation: the
 * stories are not sections, so neither the nav nor the Contents column lists them.
 *
 * @example
 * <Props stories={[{ id: "prop-size", label: "size", content: <PropDocs prop={size} />, aside: <ExampleBlocks example={sizes} /> }]} />
 */
const Props: React.FC<PropsProps> = ({ stories, "aria-label": ariaLabel = "Props" }) => (
  <>
    {stories.length > 1 ? (
      <Contents size="base" sticky={false} aria-label={ariaLabel} items={stories.map(({ id, label }) => ({ id, label }))} />
    ) : null}
    {stories.map((story, index) => (
      <React.Fragment key={story.id}>
        {index > 0 ? <DocsRule level="subsection" /> : null}
        <StyledPropsStory id={story.id}>
          <DocsColumns aside={story.aside ?? null}>{story.content}</DocsColumns>
        </StyledPropsStory>
      </React.Fragment>
    ))}
  </>
)

export default Props
