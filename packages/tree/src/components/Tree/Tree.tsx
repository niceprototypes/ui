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

/** Every id under a node, at any depth. */
const descendantIds = (node: TreeNodeType): string[] =>
  (node.items ?? []).flatMap(child => [child.id, ...descendantIds(child)])
import { TreeGuide } from "../TreeGuide"
import { TreeExpander, TreeExpanderSlot, type TreeExpanderCaretType } from "../TreeExpander"
import { getTreeActivePath } from "../../utilities/getTreeActivePath"
import { useTreeSize } from "../../services/useTreeSize"
import { getTreeRows } from "../../services/getTreeRows"

/**
 * Tree
 *
 * Navigation tree, built on the WAI-ARIA disclosure navigation pattern: a `<nav>` of
 * nested lists, where a node with `items` is a folder whose `<button aria-expanded>`
 * shows or hides its sub-list, and a node with a `url` is a link (`aria-current="page"`
 * when active). A folder with a `url` is a link too, with an expander button (TreeExpander,
 * `aria-expanded`) before it that shows its sub-list. Every row with sub-rows shows the circled
 * caret (right while open, down while closed); a row without keeps its slot, the guide's arm
 * drawn on through it, so labels line up at every depth. Closing a row closes the rows under it,
 * except the active path. Keys: Tab between rows, Enter or Space toggles a folder or expander,
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

  // Collapsing a node collapses everything under it too, except the active path, so reopening it
  // shows its children closed and the active page still open.
  const toggle = (node: TreeNodeType, event: React.SyntheticEvent<HTMLElement>) => {
    const closing = expandedIds.includes(node.id)
    const closed = closing ? new Set([node.id, ...descendantIds(node).filter(id => !activePath.includes(id))]) : undefined
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

  // The nav's caret points right while its row is open and down while closed (the owner's design).
  const caretOf = (open: boolean): TreeExpanderCaretType => (open ? "right" : "bottom")

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
      return (
        <StyledTreeTarget
          as="a"
          href={node.url}
          aria-current={node.status === "active" ? "page" : undefined}
          onClick={(event: React.MouseEvent<HTMLAnchorElement>) => onSelect?.(node, event)}
          onKeyDown={onRowKeyDown(node)}
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
          {node.items.length ? <TreeExpander caret={caretOf(open)} active={onPath} /> : <TreeExpanderSlot />}
          {label}
        </StyledTreeTarget>
      )
    }
    return <StyledTreeTarget>{label}</StyledTreeTarget>
  }

  /**
   * What leads a row before its target: a link with sub-rows gets its own expander button; a
   * folder's expander is inside its button (renderTarget); a row without sub-rows keeps the slot,
   * with the guide's arm drawn on through it under a guide, so every label starts at one x.
   */
  const renderLead = (node: TreeNodeType, onPath: boolean, depth: number) => {
    if (node.url === undefined && node.items) return null
    if (node.url !== undefined && node.items?.length) {
      const open = expandedIds.includes(node.id)
      return (
        <TreeExpander
          caret={caretOf(open)}
          expanded={open}
          active={onPath}
          aria-label={node.name}
          controls={`${idPrefix}-${node.id}`}
          onToggle={event => toggle(node, event)}
          onKeyDown={onRowKeyDown(node)}
        />
      )
    }
    return <TreeExpanderSlot arm={depth > 0} active={onPath} />
  }

  const renderList = (level: TreeItemsType, id?: string, hidden?: boolean) => (
    <StyledTreeList id={id} hidden={hidden}>
      {level.map(node => {
        const guide = guides.get(node)
        const onPath = guide?.onPath ?? false
        return (
          <StyledTreeNode key={node.id}>
            <StyledTreeRow>
              {guide ? <TreeGuide {...guide} /> : null}
              <StyledTreeRowContent $onPath={onPath} $receded={activePath.length > 0 && !onPath}>
                {renderLead(node, onPath, guide?.depth ?? 0)}
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
