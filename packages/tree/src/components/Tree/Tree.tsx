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
import { TreeGuide } from "../TreeGuide"
import { getTreeActivePath } from "../../utilities/getTreeActivePath"
import { useTreeSize } from "../../services/useTreeSize"
import { getTreeRows } from "../../services/getTreeRows"

/**
 * Tree
 *
 * Navigation tree, built on the WAI-ARIA disclosure navigation pattern: a `<nav>` of
 * nested lists, where a node with `items` is a folder whose `<button aria-expanded>`
 * shows or hides its sub-list, and a node with a `url` is a link (`aria-current="page"`
 * when active). A folder with a `url` is a link too: it has no toggle, and its sub-list
 * shows while its id is in `expandedIds`. Keyboard support is the native one: Tab between rows, Enter or Space
 * toggles a folder, Enter follows a link. Guide lines join each folder to its sub-rows;
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

  const toggle = (id: string, event: React.MouseEvent<HTMLButtonElement>) => {
    const next = expandedIds.includes(id) ? expandedIds.filter(open => open !== id) : [...expandedIds, id]
    if (expandedIdsProp === undefined) setInternalExpandedIds(next)
    onExpandedChange?.(next, event)
  }

  const renderTarget = (node: TreeNodeType) => {
    const content = (
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
        >
          {content}
        </StyledTreeTarget>
      )
    }
    if (node.items) {
      const open = expandedIds.includes(node.id)
      return (
        <StyledTreeTarget
          as="button"
          type="button"
          aria-expanded={open}
          aria-controls={`${idPrefix}-${node.id}`}
          aria-current={node.status === "active" ? "true" : undefined}
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => toggle(node.id, event)}
        >
          {content}
        </StyledTreeTarget>
      )
    }
    return <StyledTreeTarget>{content}</StyledTreeTarget>
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
                {renderTarget(node)}
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
