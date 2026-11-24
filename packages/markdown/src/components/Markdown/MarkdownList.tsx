import * as React from "react"
import Button from "@niceprototypes/button"
import { StyledMarkdownList, StyledMarkdownListToggle } from "./Markdown.styles"

/** Whether a list sits inside another list's item: only top-level lists are limited. */
const NestedListContext = React.createContext(false)

type MarkdownListProps = {
  /** The list element */
  as: "ul" | "ol"
  /** Its items */
  children?: React.ReactNode
  /** A numbered list's first number */
  start?: number
  /** Items shown before the toggle; unset, all */
  limit?: number
}

/**
 * A Markdown list. Its markers are drawn, so it keeps `role="list"`. A top-level list with more
 * items than `limit` shows the first `limit` and, after them, a link-style button that reveals the
 * rest in place ("Show N more", then "Show less"), with `aria-expanded` and `aria-controls`; the
 * revealed items fade in over the fast animation duration (none under reduced motion).
 */
const MarkdownList: React.FC<MarkdownListProps> = ({ as: List, children, start, limit }) => {
  const nested = React.useContext(NestedListContext)
  const id = React.useId()
  const [expanded, setExpanded] = React.useState(false)
  const count = React.Children.toArray(children).filter(React.isValidElement).length
  const hidden = limit === undefined || nested ? 0 : Math.max(0, count - limit)
  const list = (
    <StyledMarkdownList
      as={List}
      id={id}
      role="list"
      $limit={hidden > 0 ? limit : undefined}
      $expanded={expanded}
      start={List === "ol" ? start : undefined}
      // The drawn numbers count from `start` (counter-reset below the first number).
      style={List === "ol" && start !== undefined ? { counterReset: `markdown-list ${start - 1}` } : undefined}
    >
      <NestedListContext.Provider value={true}>{children}</NestedListContext.Provider>
    </StyledMarkdownList>
  )
  if (hidden === 0) return list
  return (
    <>
      {list}
      <StyledMarkdownListToggle>
        <Button inlined aria-expanded={expanded} aria-controls={id} onClick={() => setExpanded(!expanded)}>
          {expanded ? "Show less" : `Show ${hidden} more`}
        </Button>
      </StyledMarkdownListToggle>
    </>
  )
}

export default MarkdownList
