import { readFileSync } from "node:fs"
import { join } from "node:path"
import { docsHeadingsOfContent, docsHeadingsOfSource } from "./docsHeadings"

const welcome = readFileSync(join(__dirname, "../content/Onboarding/Welcome.mdx"), "utf8")

/** Every label in nested rows, depth first. */
const labels = (rows: { label: string; items?: { label: string }[] }[]): string[] =>
  rows.flatMap(row => [row.label, ...labels(row.items ?? [])])

describe("docsHeadingsOfSource", () => {
  it("leaves out the Welcome page's title and its link cards' titles", () => {
    const rows = docsHeadingsOfSource(welcome, "Welcome")
    const all = labels(rows)
    expect(all).not.toContain("Welcome")
    for (const card of ["Reset", "Tokens", "Fonts", "Icons", "Breakpoints", "Themes"]) expect(all).not.toContain(card)
    expect(rows.map(row => row.label)).toContain("For agents")
  })

  it("lists a page of h3s alone at the top level, with no phantom level", () => {
    const rows = docsHeadingsOfSource(`<Ink as="h3">Setup</Ink>\n\nText.\n\n### Usage\n`, "Page")
    expect(rows).toEqual([
      { id: "setup", label: "Setup" },
      { id: "usage", label: "Usage" },
    ])
  })
})

describe("docsHeadingsOfContent", () => {
  it("takes the content column's own headings only, less the title, and gives them ids", () => {
    const root = document.createElement("div")
    root.innerHTML = `
      <h2>Welcome</h2>
      <p>Intro</p>
      <div class="card"><h3>Reset</h3></div>
      <div class="card"><h3>Tokens</h3></div>
      <h2>For agents</h2>
      <h3>Load model</h3>`
    document.body.append(root)
    const rows = docsHeadingsOfContent(root, "Welcome")
    expect(rows).toEqual([{ id: "for-agents", label: "For agents", items: [{ id: "load-model", label: "Load model" }] }])
    expect(root.querySelector(":scope > h2:last-of-type")).toHaveProperty("id", "for-agents")
    root.remove()
  })

  it("lists h3-only sections at the top level", () => {
    const root = document.createElement("div")
    root.innerHTML = `<h3>Setup</h3><p>a</p><h3>Usage</h3>`
    expect(docsHeadingsOfContent(root, "Page").map(row => row.label)).toEqual(["Setup", "Usage"])
  })
})
