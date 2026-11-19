import type { Meta, StoryObj } from "@storybook/react-vite"
import styled from "styled-components"
import { expect, within } from "storybook/test"
import { getToken } from "@niceprototypes/styles"
import Ink from "@niceprototypes/ink"
import LifecycleStory from "@niceprototypes/docs/components/LifecycleStory"
import { getTreeRows, TreeGuide } from "@niceprototypes/tree"
import type { TreeGuideProps } from "@niceprototypes/tree"

/** A demo row: positioned, so the guide spans its height; rows touch, so the lines join. */
const Row = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding-block: ${getToken("tree.row.paddingBlock")};
  gap: ${getToken("tree.icon.gap")};
`

/** The deepest level the Playground controls offer. */
const DEPTH_OPTIONS = [0, 1, 2, 3, 4] as const

/** Playground args: TreeGuide's props with the per-level arrays flattened into one control per level. */
type PlaygroundArgs = Pick<TreeGuideProps, "depth" | "last" | "onPath"> & {
  continues1: boolean
  continues2: boolean
  continues3: boolean
  pathContinues1: boolean
  pathContinues2: boolean
  pathContinues3: boolean
  pathContinues4: boolean
}

/** Recompose the flattened args into TreeGuide's props. */
const toProps = (args: PlaygroundArgs): TreeGuideProps => ({
  depth: args.depth,
  last: args.last,
  onPath: args.onPath,
  continues: [args.continues1, args.continues2, args.continues3].slice(0, Math.max(0, args.depth - 1)),
  pathContinues: [args.pathContinues1, args.pathContinues2, args.pathContinues3, args.pathContinues4].slice(0, args.depth),
})

const meta = {
  title: "Components/TreeGuide",
  component: TreeGuide,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof TreeGuide>

export default meta

type Story = StoryObj<PlaygroundArgs>

const level = (category: string) => ({ control: "boolean" as const, table: { category } })

export const Playground: Story = {
  args: {
    depth: 3,
    last: false,
    onPath: false,
    continues1: true,
    continues2: false,
    continues3: false,
    pathContinues1: false,
    pathContinues2: false,
    pathContinues3: false,
    pathContinues4: false,
  },
  argTypes: {
    depth: { control: "select", options: DEPTH_OPTIONS, table: { category: "Shape" } },
    last: { control: "boolean", table: { category: "Shape" } },
    continues1: level("continues"),
    continues2: level("continues"),
    continues3: level("continues"),
    onPath: { control: "boolean", table: { category: "Active path" } },
    pathContinues1: level("pathContinues"),
    pathContinues2: level("pathContinues"),
    pathContinues3: level("pathContinues"),
    pathContinues4: level("pathContinues"),
  },
  render: args => (
    <Row>
      <TreeGuide {...toProps(args)} />
      <Ink>Row</Ink>
    </Row>
  ),
  play: async ({ canvasElement, args }) => {
    const label = within(canvasElement).getByText("Row")
    const guide = label.previousElementSibling
    if (args.depth === 0) {
      await expect(guide).toBeNull()
      return
    }
    // One column per level, the last one the row's own connector.
    const columns = Array.from(guide!.children)
    await expect(guide).toHaveAttribute("aria-hidden", "true")
    await expect(columns).toHaveLength(args.depth)
    await expect(columns[args.depth - 1]).toHaveAttribute("data-branch", args.last ? "elbow" : "tee")
    const props = toProps(args)
    const ownPath = props.pathContinues?.[args.depth - 1] ? "through" : args.onPath ? "on" : "none"
    await expect(columns[args.depth - 1]).toHaveAttribute("data-path", ownPath)
    // The guide runs the full height of the row.
    const drawn = getComputedStyle(columns[0], "::before")
    await expect(drawn.position).toBe("absolute")
    await expect(parseFloat(drawn.height)).toBeCloseTo(label.parentElement!.getBoundingClientRect().height, 0)
  },
}

/** `last`: an elbow ends the rail at the last child; any other child takes a tee. */
export const Last: Story = {
  ...Playground,
  args: { ...Playground.args, depth: 1, last: true },
}

/** `onPath`: the arm and the line above it take `tree.activeColor`. */
export const OnPath: Story = {
  ...Playground,
  args: { ...Playground.args, depth: 2, onPath: true },
  play: async ({ canvasElement }) => {
    const guide = within(canvasElement).getByText("Row").previousElementSibling!
    const own = getComputedStyle(guide.children[1], "::before").backgroundImage
    const ancestor = getComputedStyle(guide.children[0], "::before").backgroundImage
    // The own column carries the active arm and line over the neutral pieces: more layers.
    await expect(own.split("linear-gradient").length).toBeGreaterThan(ancestor.split("linear-gradient").length)
  },
}

/** A nested list three levels deep, drawn row by row from `getTreeRows`. */
type Item = { id: string; name: string; items?: Item[] }
const ITEMS: Item[] = [
  {
    id: "studio",
    name: "animation-studio",
    items: [
      { id: "main", name: "main", items: [{ id: "4012", name: "4012" }, { id: "4013", name: "4013" }, { id: "4014", name: "4014" }] },
      { id: "voice", name: "voice", items: [{ id: "4112", name: "4112" }, { id: "4113", name: "4113" }] },
    ],
  },
  { id: "docs", name: "docs" },
]

const List = ({ expandedIds, activeId }: { expandedIds: string[]; activeId?: string }) => (
  <div>
    {getTreeRows(ITEMS, { getId: item => item.id, getChildren: item => item.items, expandedIds, activeId }).map(row => (
      <Row key={row.id}>
        <TreeGuide {...row.guide} />
        <Ink>{row.item.name}</Ink>
      </Row>
    ))}
  </div>
)

/** Rows open and close level by level; the guide follows at every depth, then the active path lights up. */
export const Lifecycle: Story = {
  args: Playground.args,
  render: () => (
    <LifecycleStory
      steps={[
        { label: "collapsed", props: { expandedIds: [] } },
        { label: "level 1 open", props: { expandedIds: ["studio"] } },
        { label: "level 2 open", props: { expandedIds: ["studio", "main"] } },
        { label: "both level 2 open", props: { expandedIds: ["studio", "main", "voice"] } },
        { label: "active path", props: { expandedIds: ["studio", "main", "voice"], activeId: "4113" } },
        { label: "level 2 closed", props: { expandedIds: ["studio"] } },
      ]}
      render={props => <List {...props} />}
    />
  ),
}
