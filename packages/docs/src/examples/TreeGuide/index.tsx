// TreeGuide example configs: one ComponentExample per facet. ComponentDocs renders each entry as a
// section of the TreeGuide docs page, sorted by name. The prop facets render small lists with the
// guide data written out; the getTreeRows facets compute it from a nested list.
import styled from "styled-components"
import { getToken } from "@niceprototypes/styles"
import Ink from "@niceprototypes/ink"
import { getTreeRows, TreeGuide, type TreeGuideProps } from "@niceprototypes/tree"
import type { ComponentExample } from "../../dataTables/components/demos/Components"

/** A demo row: positioned, so the guide spans its height. */
const Row = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding-block: ${getToken("tree.row.paddingBlock")};
`

/** One written-out row: its label and its guide data. */
type GuideRow = { label: string; guide: TreeGuideProps }

/** Rows with their guide data written out. */
const Rows = ({ rows }: { rows: GuideRow[] }) => (
  <div>
    {rows.map(row => (
      <Row key={row.label}>
        <TreeGuide {...row.guide} />
        <Ink>{row.label}</Ink>
      </Row>
    ))}
  </div>
)

/** The JSX of written-out rows. */
const rowsCode = (rows: GuideRow[]) =>
  rows
    .map(({ label, guide }) => {
      const props = [
        `depth={${guide.depth}}`,
        guide.last ? "last" : "last={false}",
        guide.continues?.length ? `continues={${JSON.stringify(guide.continues)}}` : "",
        guide.onPath ? "onPath" : "",
        guide.pathContinues?.length ? `pathContinues={${JSON.stringify(guide.pathContinues)}}` : "",
      ].filter(Boolean)
      return `<Row>\n  <TreeGuide ${props.join(" ")} />\n  <Ink>${label}</Ink>\n</Row>`
    })
    .join("\n")

/** depth: a chain down to the variant's level, each row the only (last) child of the one above. */
const depthRows = (depth: number): GuideRow[] =>
  ["animation-studio", "main", "owner instance", "4012"].slice(0, depth + 1).map((label, index) => ({ label, guide: { depth: index, last: true } }))

export const treeGuideDepth = {
  name: "depth",
  description: "One guide column per level: the ancestors' columns, then the row's own tee or elbow. Depth 0 draws nothing.",
  variants: ["0", "1", "2", "3"],
  default: "0",
  preview: (variant: string) => <Rows rows={depthRows(Number(variant))} />,
  code: (variant: string) => rowsCode(depthRows(Number(variant))),
} satisfies ComponentExample

/** last: a parent and one child row with the variant's last; a sibling follows a non-last row. */
const lastRows = (last: boolean): GuideRow[] => [
  { label: "animation-studio", guide: { depth: 0, last: true } },
  { label: "main", guide: { depth: 1, last } },
  ...(last ? [] : [{ label: "voice worktree", guide: { depth: 1, last: true } }]),
]

export const treeGuideLast = {
  name: "last",
  description: "false draws a tee: the line runs on to a later sibling. true draws an elbow: the line ends at the row.",
  variants: ["false", "true"],
  default: "false",
  preview: (variant: string) => <Rows rows={lastRows(variant === "true")} />,
  code: (variant: string) => rowsCode(lastRows(variant === "true")),
} satisfies ComponentExample

/** continues: rows under an ancestor that does, or does not, have a later sibling. */
const CONTINUES_ROWS: Record<string, GuideRow[]> = {
  "[true]": [
    { label: "animation-studio", guide: { depth: 0, last: true } },
    { label: "main", guide: { depth: 1, last: false } },
    { label: "owner instance", guide: { depth: 2, last: true, continues: [true] } },
    { label: "voice worktree", guide: { depth: 1, last: true } },
  ],
  "[false]": [
    { label: "animation-studio", guide: { depth: 0, last: true } },
    { label: "main", guide: { depth: 1, last: true } },
    { label: "owner instance", guide: { depth: 2, last: true, continues: [false] } },
  ],
  "[true, false]": [
    { label: "animation-studio", guide: { depth: 0, last: true } },
    { label: "main", guide: { depth: 1, last: false } },
    { label: "owner instance", guide: { depth: 2, last: true, continues: [true] } },
    { label: "4012", guide: { depth: 3, last: true, continues: [true, false] } },
    { label: "voice worktree", guide: { depth: 1, last: true } },
  ],
}

export const treeGuideContinues = {
  name: "continues",
  description:
    "Per ancestor level below the top, outermost first: whether that ancestor has a later sibling, so its line runs through this row. [true] keeps main's line running to voice worktree; [false] leaves the column empty.",
  variants: Object.keys(CONTINUES_ROWS),
  default: "[false]",
  preview: (variant: string) => <Rows rows={CONTINUES_ROWS[variant]} />,
  code: (variant: string) => rowsCode(CONTINUES_ROWS[variant]),
} satisfies ComponentExample

type Item = { id: string; name: string; items?: Item[] }

/** Four levels: projects, their worktrees, the instances and their ports. */
const ITEMS: Item[] = [
  { id: "ports", name: "ports" },
  {
    id: "studio",
    name: "animation-studio",
    items: [
      {
        id: "main",
        name: "main",
        items: [
          { id: "main-owner", name: "owner instance", items: [{ id: "4012", name: "4012" }, { id: "4013", name: "4013" }] },
          { id: "main-member", name: "member instance", items: [{ id: "4014", name: "4014" }] },
        ],
      },
      { id: "voice", name: "voice worktree", items: [{ id: "voice-owner", name: "owner instance", items: [{ id: "4112", name: "4112" }] }] },
    ],
  },
  { id: "docs", name: "docs" },
]

const ITEMS_CODE = `const items = [
  { id: "ports", name: "ports" },
  {
    id: "studio",
    name: "animation-studio",
    items: [
      {
        id: "main",
        name: "main",
        items: [
          { id: "main-owner", name: "owner instance", items: [{ id: "4012", name: "4012" }, { id: "4013", name: "4013" }] },
          { id: "main-member", name: "member instance", items: [{ id: "4014", name: "4014" }] },
        ],
      },
      { id: "voice", name: "voice worktree", items: [{ id: "voice-owner", name: "owner instance", items: [{ id: "4112", name: "4112" }] }] },
    ],
  },
  { id: "docs", name: "docs" },
]`

/** The list through getTreeRows. */
const List = ({ activeId, expandedIds = "all" }: { activeId?: string; expandedIds?: string[] | "all" }) => (
  <div>
    {getTreeRows(ITEMS, { getId: item => item.id, getChildren: item => item.items, expandedIds, activeId }).map(row => (
      <Row key={row.id}>
        <TreeGuide {...row.guide} />
        <Ink>{row.item.name}</Ink>
      </Row>
    ))}
  </div>
)

const listCode = ({ activeId, expandedIds = "all", withItems = false }: { activeId?: string; expandedIds?: string[] | "all"; withItems?: boolean }) =>
  `${withItems ? `${ITEMS_CODE}\n\n` : "// items: the four-level list in the getTreeRows example\n"}getTreeRows(items, {\n  getId: item => item.id,\n  getChildren: item => item.items,\n  expandedIds: ${JSON.stringify(expandedIds)},${activeId ? `\n  activeId: "${activeId}",` : ""}\n}).map(row => (\n  <Row key={row.id}>\n    <TreeGuide {...row.guide} />\n    <Ink>{row.item.name}</Ink>\n  </Row>\n))`

/** activeId per onPath variant. */
const ACTIVE: Record<string, string | undefined> = {
  "no active row": undefined,
  "depth 1": "main",
  "depth 3": "4013",
}

export const treeGuideOnPath = {
  name: "onPath",
  description:
    "The active row and its ancestors are on the path: their arms and the lines above them take the tree.activeColor token. getTreeRows sets it from activeId. A top-level row draws no guide, so it shows no path.",
  variants: Object.keys(ACTIVE),
  default: "no active row",
  preview: (variant: string) => <List activeId={ACTIVE[variant]} />,
  code: (variant: string) => listCode({ activeId: ACTIVE[variant] }),
} satisfies ComponentExample

export const treeGuidePathContinues = {
  name: "pathContinues",
  description:
    "Per guide column: whether the active path runs through this row on its way to a later sibling. With 4112 active, the path's line runs past main and its rows to voice worktree in the active colour.",
  variants: ["4112", "4014"],
  default: "4112",
  preview: (variant: string) => <List activeId={variant} />,
  code: (variant: string) => listCode({ activeId: variant }),
} satisfies ComponentExample

/** expandedIds per getTreeRows variant. */
const EXPANDED: Record<string, string[] | "all"> = {
  "all open": "all",
  "studio and main open": ["studio", "main"],
  "studio open": ["studio"],
}

/** getTreeRows: the visible rows and their guide data for a nested list. */
export const treeGuideGetTreeRows = {
  name: "getTreeRows",
  description:
    "getTreeRows flattens a nested list into its visible rows, each with depth, last, continues and the active path, plus aria-level, aria-posinset and aria-setsize. Children of a closed row are left out.",
  variants: Object.keys(EXPANDED),
  default: "all open",
  preview: (variant: string) => <List expandedIds={EXPANDED[variant]} />,
  code: (variant: string) => listCode({ expandedIds: EXPANDED[variant], withItems: true }),
} satisfies ComponentExample

/** Every TreeGuide example facet: each one a section of the TreeGuide docs page. */
export const treeGuideExamples = {
  depth: treeGuideDepth,
  last: treeGuideLast,
  continues: treeGuideContinues,
  onPath: treeGuideOnPath,
  pathContinues: treeGuidePathContinues,
  getTreeRows: treeGuideGetTreeRows,
} satisfies Record<string, ComponentExample>
