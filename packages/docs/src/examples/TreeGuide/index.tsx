// TreeGuide example configs: one ComponentExample per facet. ComponentDocs renders each entry as a
// section of the TreeGuide docs page, sorted by name.
import styled from "styled-components"
import { getToken } from "@niceprototypes/styles"
import Ink from "@niceprototypes/ink"
import { getTreeRows, TreeGuide } from "@niceprototypes/tree"
import type { ComponentExample } from "../../dataTables/components/demos/Components"

/** A demo row: positioned, so the guide spans its height. */
const Row = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding-block: ${getToken("tree.row.paddingBlock")};
`

type Item = { id: string; name: string; items?: Item[] }

/** Three levels: a project, its two checkouts, and their ports. */
const ITEMS: Item[] = [
  {
    id: "studio",
    name: "animation-studio",
    items: [
      { id: "main", name: "main", items: [{ id: "4012", name: "4012" }, { id: "4013", name: "4013" }] },
      { id: "voice", name: "voice", items: [{ id: "4112", name: "4112" }, { id: "4113", name: "4113" }] },
    ],
  },
  { id: "docs", name: "docs" },
]

const ITEMS_CODE = `const items = [
  {
    id: "studio",
    name: "animation-studio",
    items: [
      { id: "main", name: "main", items: [{ id: "4012", name: "4012" }, { id: "4013", name: "4013" }] },
      { id: "voice", name: "voice", items: [{ id: "4112", name: "4112" }, { id: "4113", name: "4113" }] },
    ],
  },
  { id: "docs", name: "docs" },
]`

const List = ({ activeId }: { activeId?: string }) => (
  <div>
    {getTreeRows(ITEMS, { getId: item => item.id, getChildren: item => item.items, expandedIds: "all", activeId }).map(row => (
      <Row key={row.id}>
        <TreeGuide {...row.guide} />
        <Ink>{row.item.name}</Ink>
      </Row>
    ))}
  </div>
)

const listCode = (activeId?: string) =>
  `${ITEMS_CODE}\n\ngetTreeRows(items, {\n  getId: item => item.id,\n  getChildren: item => item.items,\n  expandedIds: "all",${activeId ? `\n  activeId: "${activeId}",` : ""}\n}).map(row => (\n  <Row key={row.id}>\n    <TreeGuide {...row.guide} />\n    <Ink>{row.item.name}</Ink>\n  </Row>\n))`

export const treeGuideDepth = {
  name: "depth",
  description:
    "One guide column per level: the ancestors' lines, then the row's own tee or elbow. getTreeRows computes depth, last, continues and the active path for every visible row.",
  variants: ["rows"],
  default: "rows",
  preview: () => <List />,
  code: () => listCode(),
} satisfies ComponentExample

export const treeGuideOnPath = {
  name: "onPath",
  description: "With an activeId, the path from the top row down to it takes the tree.activeColor token.",
  variants: ["4113"],
  default: "4113",
  preview: (variant: string) => <List activeId={variant} />,
  code: (variant: string) => listCode(variant),
} satisfies ComponentExample

/** Every TreeGuide example facet: each one a section of the TreeGuide docs page. */
export const treeGuideExamples = {
  depth: treeGuideDepth,
  onPath: treeGuideOnPath,
} satisfies Record<string, ComponentExample>
