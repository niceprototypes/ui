import React from "react"
import { act, fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import { BREAKPOINTS } from "@niceprototypes/styles"
import TabsSection from "./TabsSection"
import type { TabsItemType } from "../Tabs/Tabs.types"

const ITEMS: TabsItemType[] = [
  { id: "html", label: "HTML/CSS" },
  { id: "js", label: "Vanilla JS" },
  { id: "react", label: "React" },
]

/** Resize the window to `width` and let useBreakpoint's listeners run. */
const resizeTo = (width: number) =>
  act(() => {
    window.innerWidth = width
    window.dispatchEvent(new Event("resize"))
  })

describe("TabsSection", () => {
  beforeEach(() => resizeTo(BREAKPOINTS.laptop))

  it("renders the heading at the level asked for, the row marked as that flow role, and the panel as its sibling", () => {
    const { container } = render(
      <TabsSection title="After" level="h3" items={ITEMS}>
        <p>panel</p>
      </TabsSection>,
    )
    const heading = screen.getByRole("heading", { level: 3, name: "After" })
    const row = container.firstElementChild!
    expect(row).toHaveAttribute("data-flow-role", "h3")
    expect(row).toContainElement(heading)
    expect(row.nextElementSibling).toBe(screen.getByRole("tabpanel"))
    expect(screen.getByRole("heading", { level: 3 }).tagName).toBe("H3")
  })

  it("names the tab list by the heading and associates the selected tab with the panel below", () => {
    render(
      <TabsSection title="After" items={ITEMS}>
        <p>panel</p>
      </TabsSection>,
    )
    const tablist = screen.getByRole("tablist", { name: "After" })
    const tab = screen.getByRole("tab", { name: "HTML/CSS" })
    const panel = screen.getByRole("tabpanel", { name: "HTML/CSS" })
    expect(tablist).toContainElement(tab)
    expect(tab).toHaveAttribute("aria-selected", "true")
    expect(tab).toHaveAttribute("aria-controls", panel.id)
    expect(panel).toHaveTextContent("panel")
  })

  it("selects with clicks and arrow keys, controlled or not", async () => {
    const onSelect = jest.fn()
    render(<TabsSection title="After" items={ITEMS} onSelect={onSelect} />)
    await userEvent.click(screen.getByRole("tab", { name: "Vanilla JS" }))
    expect(screen.getByRole("tab", { name: "Vanilla JS" })).toHaveAttribute("aria-selected", "true")
    await userEvent.keyboard("{ArrowRight}")
    expect(screen.getByRole("tab", { name: "React" })).toHaveFocus()
    expect(onSelect).toHaveBeenLastCalledWith("react", expect.anything())
  })

  it("below selectBelow, shows a select named by the heading that drives the same panel", () => {
    resizeTo(BREAKPOINTS.tablet - 1)
    const onSelect = jest.fn()
    const Panels = () => {
      const [id, setId] = React.useState("html")
      return (
        <TabsSection
          title="After"
          items={ITEMS}
          selected={id}
          onSelect={(next, event) => {
            setId(next)
            onSelect(next, event)
          }}
        >
          <p>{id} panel</p>
        </TabsSection>
      )
    }
    render(<Panels />)
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument()
    const select = screen.getByRole("combobox", { name: "After" })
    const panel = screen.getByRole("region", { name: "After" })
    expect(select).toHaveAttribute("aria-controls", panel.id)
    fireEvent.change(select, { target: { value: "react" } })
    expect(onSelect).toHaveBeenCalledWith("react", expect.anything())
    expect(panel).toHaveTextContent("react panel")
  })

  it("keeps the tabs at every width with selectBelow none, and switches back to tabs from the breakpoint up", () => {
    resizeTo(BREAKPOINTS.tablet - 1)
    const { rerender } = render(<TabsSection title="After" items={ITEMS} selectBelow="none" />)
    expect(screen.getByRole("tablist")).toBeInTheDocument()
    rerender(<TabsSection title="After" items={ITEMS} />)
    expect(screen.getByRole("combobox")).toBeInTheDocument()
    resizeTo(BREAKPOINTS.tablet)
    expect(screen.getByRole("tablist")).toBeInTheDocument()
  })
})
