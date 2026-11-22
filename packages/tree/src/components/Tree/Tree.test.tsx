import * as React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { getToken } from "@niceprototypes/styles"
import Tree from "."
import type { TreeItemsType } from "./Tree.types"

const items: TreeItemsType = [
  {
    id: "guides",
    name: "Guides",
    icon: null,
    items: [
      { id: "start", name: "Start", icon: null, url: "/start" },
      { id: "theming", name: "Theming", icon: null, url: "/theming", status: "active" },
    ],
  },
  { id: "api", name: "API", icon: null, items: [{ id: "tree", name: "Tree", icon: null, url: "/tree" }] },
]

describe("Tree", () => {
  it("renders a named nav of nested lists", () => {
    render(<Tree aria-label="Docs" items={items} />)
    expect(screen.getByRole("navigation", { name: "Docs" })).toBeInTheDocument()
    expect(screen.getAllByRole("list", { hidden: true })).toHaveLength(3)
  })

  it("opens the active node's ancestors and marks the active link", () => {
    render(<Tree items={items} />)
    expect(screen.getByRole("button", { name: "Guides" })).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByRole("button", { name: "API" })).toHaveAttribute("aria-expanded", "false")
    expect(screen.getByRole("link", { name: "Theming" })).toHaveAttribute("aria-current", "page")
  })

  it("styles the current page's link from the tree.active* tokens", () => {
    render(<Tree aria-label="Docs" items={items} />)
    const link = screen.getByRole("link", { name: "Theming" })
    const css = Array.from(document.querySelectorAll("style")).map(element => element.textContent).join("\n")
    const rule = css.split("}").find(text => text.includes('[aria-current="page"]') && link.classList.contains(text.match(/\.([\w-]+)\[aria-current/)?.[1] ?? ""))
    expect(rule).toContain(`background-color:${getToken("tree.activeBackgroundColor")}`)
    expect(rule).toContain(`border-radius:${getToken("tree.activeBorderRadius")}`)
    expect(rule).toContain(`padding-inline:${getToken("tree.activePaddingInline")}`)
  })

  it("toggles a folder and hides its sub-list when closed", () => {
    const onExpandedChange = jest.fn()
    render(<Tree items={items} onExpandedChange={onExpandedChange} />)
    const api = screen.getByRole("button", { name: "API" })
    const list = document.getElementById(api.getAttribute("aria-controls") ?? "")
    expect(list).not.toBeVisible()
    fireEvent.click(api)
    expect(api).toHaveAttribute("aria-expanded", "true")
    expect(list).toBeVisible()
    expect(onExpandedChange).toHaveBeenCalledWith(["guides", "api"], expect.anything())
  })

  it("follows expandedIds when controlled", () => {
    render(<Tree items={items} expandedIds={[]} />)
    const guides = screen.getByRole("button", { name: "Guides" })
    fireEvent.click(guides)
    expect(guides).toHaveAttribute("aria-expanded", "false")
  })

  it("reports a leaf click to onSelect", () => {
    const onSelect = jest.fn()
    render(<Tree items={items} onSelect={onSelect} />)
    fireEvent.click(screen.getByRole("link", { name: "Start" }))
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: "start" }), expect.anything())
  })

  it("renders a folder with a url as a link whose sub-list follows expandedIds", () => {
    const onSelect = jest.fn()
    const linked: TreeItemsType = [
      { id: "step", name: "Step", icon: null, url: "#step", items: [{ id: "sub", name: "Sub", icon: null, url: "#sub" }] },
    ]
    const { rerender } = render(<Tree items={linked} expandedIds={["step"]} onSelect={onSelect} />)
    // The link is the row's one control: it carries the open state; its circle is a mark.
    expect(screen.getByRole("link", { name: "Step" })).toHaveAttribute("aria-expanded", "true")
    expect(screen.queryByRole("button")).toBeNull()
    fireEvent.click(screen.getByRole("link", { name: "Step" }))
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: "step" }), expect.anything())
    expect(screen.getByRole("link", { name: "Sub" })).toBeVisible()
    rerender(<Tree items={linked} expandedIds={[]} onSelect={onSelect} />)
    expect(screen.getByRole("link", { name: "Sub", hidden: true })).not.toBeVisible()
  })

  it("renders a node's children inside its row", () => {
    render(
      <Tree items={[{ id: "a", name: "A", icon: null, url: "/a", children: <span>badge</span> }]} />,
    )
    expect(screen.getByRole("link", { name: "A" }).parentElement).toHaveTextContent("Abadge")
  })

  it("toggles a linked folder from its circle, the caret right while open and down while closed", () => {
    const onExpandedChange = jest.fn()
    const linked: TreeItemsType = [
      { id: "step", name: "Step", icon: null, url: "#step", items: [{ id: "sub", name: "Sub", icon: null, url: "#sub" }] },
    ]
    render(<Tree items={linked} defaultExpandedIds={[]} onExpandedChange={onExpandedChange} />)
    const link = screen.getByRole("link", { name: "Step" })
    const circle = link.closest("[data-tree-row]")!.querySelector("[data-icon]")!.parentElement!.parentElement!
    expect(link).toHaveAttribute("aria-expanded", "false")
    // One icon, turned by transform: down while closed, right while open.
    expect(circle.querySelectorAll("[data-icon]")).toHaveLength(1)
    const turn = () => getComputedStyle(circle.querySelector("[data-icon]")!.parentElement!).transform
    expect(turn()).toBe("rotate(90deg)")
    fireEvent.click(circle)
    expect(link).toHaveAttribute("aria-expanded", "true")
    expect(turn()).toBe("rotate(0deg)")
    expect(onExpandedChange).toHaveBeenLastCalledWith(["step"], expect.anything())
  })

  it("toggles an open page's sub-rows from its title as from its circle, and follows another page's title", () => {
    const onSelect = jest.fn()
    const linked: TreeItemsType = [
      { id: "here", name: "Here", icon: null, url: "#here", status: "active", items: [{ id: "a", name: "A", icon: null, url: "#a" }] },
      { id: "there", name: "There", icon: null, url: "#there", items: [{ id: "b", name: "B", icon: null, url: "#b" }] },
    ]
    render(<Tree items={linked} defaultExpandedIds={["here"]} onSelect={onSelect} />)
    const here = screen.getByRole("link", { name: "Here" })
    fireEvent.click(here)
    expect(here).toHaveAttribute("aria-expanded", "false")
    fireEvent.keyDown(here, { key: " " })
    expect(here).toHaveAttribute("aria-expanded", "true")
    expect(onSelect).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole("link", { name: "There" }))
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: "there" }), expect.anything())
  })

  it("opens a closed row with Right and closes an open one with Left", () => {
    render(<Tree items={items} defaultExpandedIds={[]} />)
    const guides = screen.getByRole("button", { name: "Guides" })
    fireEvent.keyDown(guides, { key: "ArrowRight" })
    expect(guides).toHaveAttribute("aria-expanded", "true")
    fireEvent.keyDown(guides, { key: "ArrowRight" })
    expect(guides).toHaveAttribute("aria-expanded", "true")
    fireEvent.keyDown(guides, { key: "ArrowLeft" })
    expect(guides).toHaveAttribute("aria-expanded", "false")
  })

  it("closes every row under a closing row, the active path included, so reopening shows them all closed", () => {
    const nested: TreeItemsType = [
      {
        id: "root",
        name: "Root",
        icon: null,
        items: [
          { id: "a", name: "A", icon: null, items: [{ id: "a1", name: "A1", icon: null, url: "/a1" }] },
          { id: "b", name: "B", icon: null, items: [{ id: "b1", name: "B1", icon: null, url: "/b1", status: "active" }] },
        ],
      },
    ]
    const onExpandedChange = jest.fn()
    render(<Tree items={nested} defaultExpandedIds={["root", "a", "b"]} onExpandedChange={onExpandedChange} />)
    fireEvent.click(screen.getByRole("button", { name: "Root" }))
    expect(onExpandedChange).toHaveBeenLastCalledWith([], expect.anything())
    fireEvent.click(screen.getByRole("button", { name: "Root" }))
    expect(screen.getByRole("button", { name: "A" })).toHaveAttribute("aria-expanded", "false")
    // B leads to the active page, and closes too.
    expect(screen.getByRole("button", { name: "B" })).toHaveAttribute("aria-expanded", "false")
  })

  it("keeps the circle's place on rows without sub-rows, the arm drawn through it, so labels line up", () => {
    const { container } = render(<Tree items={items} />)
    const startRow = screen.getByRole("link", { name: "Start" }).closest("[data-tree-row]")!
    const guide = startRow.querySelector(":scope > [aria-hidden]")!
    expect(Array.from(guide.children).map(column => column.getAttribute("data-branch"))).toEqual(["tee"])
    expect(guide.nextElementSibling).toHaveAttribute("aria-hidden", "true")
    expect(startRow.querySelector("[data-icon]")).toBeNull()
    expect(container.querySelectorAll('[data-icon="carat-right"]').length).toBeGreaterThan(0)
  })

  it("starts an open row's rail at its circle, active where the active path goes on below", () => {
    render(<Tree items={items} defaultExpandedIds={["guides"]} />)
    const circleOf = (name: string) => screen.getByRole("button", { name }).closest("[data-tree-row]")!.querySelector("[data-icon]")!.closest("span[aria-hidden]")!
    // Guides is open and leads to the active Theming page; API is closed.
    expect(circleOf("Guides")).toHaveAttribute("data-stem", "active")
    expect(circleOf("API")).not.toHaveAttribute("data-stem")
    fireEvent.click(screen.getByRole("button", { name: "API" }))
    expect(circleOf("API")).toHaveAttribute("data-stem", "base")
  })
})
