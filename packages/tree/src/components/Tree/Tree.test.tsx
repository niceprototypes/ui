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
})
