import { useEffect, useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { useArgs } from "storybook/preview-api"
import { expect, fn, waitFor, within } from "storybook/test"
import { BREAKPOINTS, type SizeType } from "@niceprototypes/styles"
import Flow from "@niceprototypes/flow"
import Ink from "@niceprototypes/ink"
import {
  TabsSection,
  type TabsItemType,
  type TabsSectionLevelType,
  type TabsSectionProps,
  type TabsSectionSelectBelowType,
  type TabsVariantType,
} from "@niceprototypes/tabs"

/** Option lists, typed against the unions on disk. */
const LEVEL_OPTIONS = ["h2", "h3", "h4"] as const satisfies readonly TabsSectionLevelType[]
const SELECT_BELOW_OPTIONS = ["tablet", "laptop", "desktop", "none"] as const satisfies readonly TabsSectionSelectBelowType[]
const SIZE_OPTIONS = ["smaller", "small", "base", "large", "larger"] as const satisfies readonly SizeType[]
const VARIANT_OPTIONS = ["underline", "pill"] as const satisfies readonly TabsVariantType[]

const LANGUAGES: TabsItemType[] = [
  { id: "html", label: "HTML/CSS" },
  { id: "js", label: "Vanilla JS" },
  { id: "react", label: "React" },
]
const ID_OPTIONS = LANGUAGES.map(item => item.id)

/** An unset choice for optional selects; `mapping` turns it into `undefined`. */
const NONE = "none"

/**
 * PlaygroundArgs
 *
 * TabsSectionProps with `children` as panel text and `items` fixed to the three languages.
 * `selected` is controlled through useArgs; set it to "none" to start at `defaultSelected`.
 */
type PlaygroundArgs = Omit<TabsSectionProps, "items" | "children"> & { children: string; items?: never }

const meta = {
  title: "Widgets/TabsSection",
  component: TabsSection,
  parameters: { layout: "padded" },
} satisfies Meta<typeof TabsSection>

export default meta

type Story = StoryObj<PlaygroundArgs>

const select = (options: readonly string[], category: string) => ({
  control: "select" as const,
  options,
  table: { category },
})

const optionalSelect = (options: readonly string[], category: string) => ({
  ...select([NONE, ...options], category),
  mapping: { [NONE]: undefined },
})

export const Playground: Story = {
  args: {
    title: "After",
    level: "h2",
    selected: "html",
    defaultSelected: NONE,
    onSelect: fn(),
    children: "Panel",
    size: "base",
    variant: "underline",
    selectBelow: "tablet",
  },
  argTypes: {
    title: { control: "text", table: { category: "Content" } },
    children: { control: "text", table: { category: "Content" } },
    level: select(LEVEL_OPTIONS, "Content"),
    selected: optionalSelect(ID_OPTIONS, "Selection"),
    defaultSelected: optionalSelect(ID_OPTIONS, "Selection"),
    size: select(SIZE_OPTIONS, "Appearance"),
    variant: select(VARIANT_OPTIONS, "Appearance"),
    selectBelow: select(SELECT_BELOW_OPTIONS, "Layout"),
    onSelect: { table: { category: "Events" } },
    items: { table: { disable: true } },
  },
  // Two sections in a Flow column, so the heading row's spacing shows against a plain heading.
  render: function Render({ children, onSelect, ...rest }) {
    const [, updateArgs] = useArgs<PlaygroundArgs>()
    // Local mirror of `selected`: the test runner renders without a manager.
    const [selected, setSelected] = useState(rest.selected)
    useEffect(() => setSelected(rest.selected), [rest.selected])
    const props: TabsSectionProps = {
      ...rest,
      selected,
      items: LANGUAGES,
      children: <Ink as="p">{`${children}: ${selected ?? rest.defaultSelected ?? "html"}`}</Ink>,
      onSelect: (id, event) => {
        onSelect?.(id, event)
        if (rest.selected === undefined) return
        setSelected(id)
        updateArgs({ selected: id })
      },
    }
    return (
      <Flow>
        <Ink as={rest.level ?? "h2"} weight="semibold">Before</Ink>
        <Ink as="p">The section above.</Ink>
        <TabsSection key={rest.defaultSelected} {...props} />
      </Flow>
    )
  },
  play: async ({ canvasElement, args, userEvent }) => {
    const canvas = within(canvasElement)
    // Below the tablet floor the default shows the select; the test runs on a wider canvas.
    if (window.innerWidth < BREAKPOINTS.tablet) return
    const heading = canvas.getByRole("heading", { name: "After" })
    const row = heading.closest("[data-flow-role]")
    await expect(row).toHaveAttribute("data-flow-role", "h2")
    const tablist = canvas.getByRole("tablist", { name: "After" })
    const tab = (name: string) => within(tablist).getByRole("tab", { name })
    await expect(tab("HTML/CSS")).toHaveAttribute("aria-selected", "true")
    const panel = canvas.getByRole("tabpanel")
    await expect(panel).toHaveAttribute("aria-labelledby", tab("HTML/CSS").id)
    await expect(row?.nextElementSibling).toBe(panel)
    // The tabs sit at the row's right edge.
    await expect(Math.round(tablist.getBoundingClientRect().right)).toBe(Math.round(row!.getBoundingClientRect().right))
    await userEvent.click(tab("React"))
    await expect(args.onSelect).toHaveBeenLastCalledWith("react", expect.objectContaining({ type: "click" }))
    await waitFor(() => expect(tab("React")).toHaveAttribute("aria-selected", "true"))
  },
}

export const SelectBelowDesktop: Story = {
  ...Playground,
  args: { ...Playground.args, selectBelow: "desktop" },
  play: async ({ canvasElement }) => {
    if (window.innerWidth >= BREAKPOINTS.desktop) return
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole("tablist")).toBeNull()
    const control = canvas.getByRole("combobox", { name: "After" })
    await expect(canvas.getByRole("region", { name: "After" })).toBeInTheDocument()
    await expect(control).toHaveValue("html")
  },
}
