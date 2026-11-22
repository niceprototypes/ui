import * as React from "react"
import Ink from "@niceprototypes/ink"
import {
  StyledTree,
  StyledTreeIcon,
  StyledTreeList,
  StyledTreeNode,
  StyledTreeRow,
  StyledTreeRowContent,
  StyledTreeTarget,
} from "./Tree.styles"
import type { TreeItemsType, TreeNodeType, TreeProps } from "./Tree.types"

/** The caret of an open row (the owner's design: right while open); flip it here to change the convention. */
const OPEN_CARET: TreeExpanderCaretType = "right"
/** The caret of a closed row: the other direction. */
const CLOSED_CARET: TreeExpanderCaretType = OPEN_CARET === "right" ? "bottom" : "right"

/** Every id under a node, at any depth. */
const descendantIds = (node: TreeNodeType): string[] =>
  (node.items ?? []).flatMap(child => [child.id, ...descendantIds(child)])
import { TreeGuide } from "../TreeGuide"
import { TreeExpander, TreeExpanderSlot, type TreeExpanderCaretType } from "../TreeExpander"
import { TREE_ROW_ATTRIBUTE } from "../TreeExpander/TreeExpander.styles"
import { getTreeActivePath } from "../../utilities/getTreeActivePath"
import { useTreeSize } from "../../services/useTreeSize"
import { getTreeRows } from "../../services/getTreeRows"

/**
 * Tree
 *
 * Navigation tree, built on the WAI-ARIA disclosure navigation pattern: a `<nav>` of
 * nested lists, where a node with `items` is a folder whose `<button aria-expanded>`
 * shows or hides its sub-list, and a node with a `url` is a link (`aria-current="page"`
 * when active). A folder with a `url` is a link too, carrying `aria-expanded`: on the active path
 * its title toggles its sub-list as its circle does (TreeExpander, a mark), elsewhere it follows
 * the link; Space acts as Enter on it. Every row with sub-rows shows the circled
 * caret after the guide's arm (right while open, down while closed), sub-rows' rail dropping from
 * its centre; a row without has the arm drawn to where the circle would end. Each level indents by
 * one `tree.guide.indent`, labels a `tree.guide.labelGap` after the circle, so they line up. Closing a row closes every row under it. Keys: Tab between rows, Enter or Space toggles a folder or expander,
 * Enter follows a link, Right opens a closed row and Left closes an open one (the APG tree
 * pattern's keys). Guide lines join each folder to its sub-rows;
 * the active node, its ancestors and the guide leading to it take the `tree.activeColor`
 * token; a project recolours it by overriding that token (setTokens, or on a wrapper).
 *
 * @example
 * ```tsx
 * <Tree
 *   aria-label="Docs"
 *   items={[
 *     { id: "guides", name: "Guides", icon: <Icon name="folder-closed" />, items: [
 *       { id: "start", name: "Start", icon: null, url: "/start", status: "active" },
 *     ] },
 *   ]}
 * />
 * ```
 */
const Tree: React.FC<TreeProps> = ({
  items,
  expandedIds: expandedIdsProp,
  defaultExpandedIds,
  onExpandedChange,
  onSelect,
  "aria-label": ariaLabel,
  size: sizeProp,
}) => {
  const idPrefix = React.useId()
  const size = useTreeSize(sizeProp)
  const activePath = React.useMemo(() => getTreeActivePath(items), [items])
  // Every node's guide, closed folders included (a hidden sub-list keeps its rows), keyed by the
  // node object so a repeated id cannot take another node's guide.
  const guides = React.useMemo(
    () =>
      new Map(
        getTreeRows(items, {
          getId: node => node.id,
          getChildren: node => node.items,
          expandedIds: "all",
          activeId: activePath[activePath.length - 1],
        }).map(row => [row.item, row.guide]),
      ),
    [items, activePath],
  )
  const [internalExpandedIds, setInternalExpandedIds] = React.useState<readonly string[]>(
    () => defaultExpandedIds ?? activePath.slice(0, -1),
  )
  const expandedIds = expandedIdsProp ?? internalExpandedIds

  // Collapsing a node collapses everything under it too, the active path included, so reopening
  // it shows all its children closed; rows open otherwise only from defaultExpandedIds (uncontrolled
  // or a controlling consumer).
  const toggle = (node: TreeNodeType, event: React.SyntheticEvent<HTMLElement>) => {
    const closing = expandedIds.includes(node.id)
    const closed = closing ? new Set([node.id, ...descendantIds(node)]) : undefined
    const next = closed ? expandedIds.filter(open => !closed.has(open)) : [...expandedIds, node.id]
    if (expandedIdsProp === undefined) setInternalExpandedIds(next)
    onExpandedChange?.(next, event)
  }

  // APG tree keys on a row's link, button or expander: Right opens a closed row, Left closes an open one.
  const onRowKeyDown = (node: TreeNodeType) => (event: React.KeyboardEvent<HTMLElement>) => {
    if (!node.items?.length) return
    const open = expandedIds.includes(node.id)
    if ((event.key === "ArrowRight" && !open) || (event.key === "ArrowLeft" && open)) {
      event.preventDefault()
      toggle(node, event)
    }
  }

  const caretOf = (open: boolean): TreeExpanderCaretType => (open ? OPEN_CARET : CLOSED_CARET)

  const renderTarget = (node: TreeNodeType, onPath: boolean) => {
    const open = expandedIds.includes(node.id)
    const label = (
      <>
        {node.icon !== null && node.icon !== undefined ? <StyledTreeIcon aria-hidden="true">{node.icon}</StyledTreeIcon> : null}
        <Ink size={size}>
          {node.name}
        </Ink>
      </>
    )
    if (node.url !== undefined) {
      const expandable = !!node.items?.length
      return (
        <StyledTreeTarget
          as="a"
          href={node.url}
          aria-current={node.status === "active" ? "page" : undefined}
          // A link with sub-rows is the row's one control: it carries the open state its circle shows.
          aria-expanded={expandable ? open : undefined}
          aria-controls={expandable ? `${idPrefix}-${node.id}` : undefined}
          onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
            // On the active path (the page is open), the title toggles its sub-rows as the circle
            // does; elsewhere it follows the link (the consumer opens the page it navigates to).
            if (expandable && onPath && !(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) {
              event.preventDefault()
              toggle(node, event)
              return
            }
            onSelect?.(node, event)
          }}
          onKeyDown={(event: React.KeyboardEvent<HTMLAnchorElement>) => {
            // Space acts as Enter on a link with sub-rows, as on the circle.
            if (expandable && event.key === " ") {
              event.preventDefault()
              event.currentTarget.click()
              return
            }
            onRowKeyDown(node)(event)
          }}
        >
          {label}
        </StyledTreeTarget>
      )
    }
    if (node.items) {
      return (
        <StyledTreeTarget
          as="button"
          type="button"
          aria-expanded={open}
          aria-controls={`${idPrefix}-${node.id}`}
          aria-current={node.status === "active" ? "true" : undefined}
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => toggle(node, event)}
          onKeyDown={onRowKeyDown(node)}
        >
          {label}
        </StyledTreeTarget>
      )
    }
    return <StyledTreeTarget>{label}</StyledTreeTarget>
  }

  /**
   * A row's expander, right after its guide (TreeExpander): a mark its click toggles, the row's
   * title being its one control (a folder's button, or a link with `aria-expanded`). A row without
   * sub-rows keeps the circle's place, the guide's arm drawn through it.
   */
  const renderExpander = (node: TreeNodeType, onPath: boolean, depth: number) => {
    if (!node.items?.length) return <TreeExpanderSlot arm={depth > 0} active={onPath} />
    const open = expandedIds.includes(node.id)
    return <TreeExpander caret={caretOf(open)} active={onPath} decorative onToggle={event => toggle(node, event)} />
  }

  const renderList = (level: TreeItemsType, id?: string, hidden?: boolean) => (
    <StyledTreeList id={id} hidden={hidden}>
      {level.map(node => {
        const guide = guides.get(node)
        const onPath = guide?.onPath ?? false
        return (
          <StyledTreeNode key={node.id}>
            <StyledTreeRow {...{ [TREE_ROW_ATTRIBUTE]: "" }}>
              {guide ? <TreeGuide {...guide} /> : null}
              {renderExpander(node, onPath, guide?.depth ?? 0)}
              <StyledTreeRowContent $onPath={onPath} $receded={activePath.length > 0 && !onPath}>
                {renderTarget(node, onPath)}
                {node.children}
              </StyledTreeRowContent>
            </StyledTreeRow>
            {node.items ? renderList(node.items, `${idPrefix}-${node.id}`, !expandedIds.includes(node.id)) : null}
          </StyledTreeNode>
        )
      })}
    </StyledTreeList>
  )

  return (
    <StyledTree aria-label={ariaLabel} $size={size}>
      {renderList(items)}
    </StyledTree>
  )
}

export default Tree
