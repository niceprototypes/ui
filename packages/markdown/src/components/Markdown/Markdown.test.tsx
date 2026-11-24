import * as React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import Markdown from "."
import type { MarkdownLinkComponentType } from "./Markdown.types"

/** Every Ink render, to count which blocks re-render. */
const inkRenders = jest.fn()

jest.mock("@niceprototypes/ink", () => ({
  __esModule: true,
  default: ({ as: Tag = "span", children, id }: { as?: React.ElementType; children: React.ReactNode; id?: string }) => {
    inkRenders(children)
    return <Tag data-ink id={id}>{children}</Tag>
  },
}))

jest.mock("@niceprototypes/code", () => ({
  __esModule: true,
  default: ({ code, language, inlined }: { code: string; language?: string; inlined?: boolean }) =>
    inlined ? <code data-inlined>{code}</code> : <pre data-language={language}>{code}</pre>,
}))

const SOURCE = "# Title\n\nA paragraph with `inline` code.\n\n- one\n- two\n\n```ts\nconst a = 1\n```\n\n[Docs](/docs/intro)"

describe("Markdown", () => {
  beforeEach(() => inkRenders.mockClear())

  it("renders headings, paragraphs and list items through Ink", () => {
    render(<Markdown>{SOURCE}</Markdown>)
    expect(screen.getByRole("heading", { level: 1, name: "Title" })).toHaveAttribute("data-ink")
    expect(screen.getByText(/A paragraph with/).closest("p")).toHaveAttribute("data-ink")
    const items = screen.getAllByRole("listitem")
    expect(items).toHaveLength(2)
    items.forEach(item => expect(item.firstElementChild).toHaveAttribute("data-ink"))
  })

  it("renders fenced code as a Code block and inline code as Code inlined", () => {
    render(<Markdown>{SOURCE}</Markdown>)
    expect(screen.getByText("const a = 1")).toHaveAttribute("data-language", "ts")
    expect(screen.getByText("inline")).toHaveAttribute("data-inlined")
  })

  it("renders links as anchors, or through linkComponent", () => {
    const { rerender } = render(<Markdown>{SOURCE}</Markdown>)
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute("href", "/docs/intro")

    const Link: MarkdownLinkComponentType = ({ href, children }) => (
      <a href={href} data-router>
        {children}
      </a>
    )
    rerender(<Markdown linkComponent={Link}>{SOURCE}</Markdown>)
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute("data-router")
  })

  it("merges overrides over the defaults", () => {
    const overrides = { h1: ({ children }: { children?: React.ReactNode }) => <h1 data-custom>{children}</h1> }
    render(<Markdown overrides={overrides}>{SOURCE}</Markdown>)
    expect(screen.getByRole("heading", { level: 1 })).toHaveAttribute("data-custom")
    expect(screen.getByText(/A paragraph with/).closest("p")).toHaveAttribute("data-ink")
  })

  it("keeps versioned ids as text and inline code", () => {
    const { container } = render(
      <Markdown>{"Uses nice/chat@1.0.0, scope/name@1.2.3, @scope/name@^1.0.0, @scope/name@1.0.0-beta.1 and `nice/chat@1.0.0`."}</Markdown>,
    )
    expect(container.querySelector("a")).toBeNull()
    expect(screen.getByText(/Uses nice\/chat@1\.0\.0, scope\/name@1\.2\.3, @scope\/name@\^1\.0\.0, @scope\/name@1\.0\.0-beta\.1 and/)).toBeInTheDocument()
    expect(screen.getByText("nice/chat@1.0.0")).toHaveAttribute("data-inlined")
  })

  it("links bare and bracketed emails", () => {
    render(<Markdown>{"Write to user@example.com or <a@b.com>."}</Markdown>)
    expect(screen.getByRole("link", { name: "user@example.com" })).toHaveAttribute("href", "mailto:user@example.com")
    expect(screen.getByRole("link", { name: "a@b.com" })).toHaveAttribute("href", "mailto:a@b.com")
  })

  it("re-renders only the block that changed while the source grows", () => {
    const { rerender } = render(<Markdown>{"First paragraph.\n\nSecond"}</Markdown>)
    inkRenders.mockClear()
    rerender(<Markdown>{"First paragraph.\n\nSecond paragraph"}</Markdown>)
    expect(inkRenders).toHaveBeenCalledTimes(1)
    expect(screen.getByText("Second paragraph")).toBeInTheDocument()
  })

  it("keeps lists' list role, draws their markers, and counts a numbered list from its start", () => {
    const { container } = render(<Markdown>{"- one\n- two\n\n3. three\n4. four"}</Markdown>)
    const lists = screen.getAllByRole("list")
    expect(lists.map(list => list.tagName)).toEqual(["UL", "OL"])
    expect(container.querySelector("ol")).toHaveStyle({ counterReset: "markdown-list 2" })
  })

  it("limits a top-level list to listLimit items behind a Show N more button that toggles the rest", () => {
    const { container } = render(<Markdown listLimit={1}>{"- one\n- two\n- three"}</Markdown>)
    const list = screen.getByRole("list")
    const toggle = screen.getByRole("button", { name: "Show 2 more" })
    expect(toggle).toHaveAttribute("aria-expanded", "false")
    expect(toggle).toHaveAttribute("aria-controls", list.id)
    expect(container.querySelectorAll("li")).toHaveLength(3)
    fireEvent.click(toggle)
    expect(screen.getByRole("button", { name: "Show less" })).toHaveAttribute("aria-expanded", "true")
  })

  it("shows every item without listLimit, or when the list fits it", () => {
    const { rerender } = render(<Markdown>{"- one\n- two"}</Markdown>)
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
    rerender(<Markdown listLimit={2}>{"- one\n- two"}</Markdown>)
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })
})

