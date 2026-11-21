import * as React from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { getConstantKey, getToken } from "@niceprototypes/styles"
import Flow from "./Flow"
import { getBleedRadius } from "../../services"
import { FlowItem } from "../FlowItem"

/** Text of every <style> tag styled-components injected into the document. */
const getInjectedCss = () =>
  Array.from(document.querySelectorAll("style"))
    .map(element => element.textContent)
    .join("\n")

/** A role's margin-block declaration, as the flow rules write it. */
const margins = (role: string) => {
  const factors = `${getToken("flow.density")} * ${getToken("flow.scale")}`
  return `margin-block-start:calc(${getToken(`flow.${role}:before` as "flow.h2:before")} * ${factors});margin-block-end:calc(${getToken(`flow.${role}:after` as "flow.h2:after")} * ${factors})`
}

describe("Flow", () => {
  it("renders a div marked data-flow by default, and the element named by as", () => {
    const { rerender } = render(<Flow><p>text</p></Flow>)
    expect(screen.getByText("text").parentElement?.tagName).toBe("DIV")
    expect(screen.getByText("text").parentElement).toHaveAttribute("data-flow")
    rerender(<Flow as="section"><p>text</p></Flow>)
    expect(screen.getByText("text").parentElement?.tagName).toBe("SECTION")
  })

  it("spaces each role from its flow tokens times the density and the breakpoint scale", () => {
    render(<Flow><h2>title</h2></Flow>)
    const css = getInjectedCss()
    for (const role of ["block", "h1", "h2", "h3", "h4", "h5", "h6", "text", "list", "blockquote", "table", "code", "media", "rule"]) {
      expect(css).toContain(margins(role))
    }
  })

  it("zeroes the outer edges unless nested in a flow", () => {
    render(<Flow><p>text</p></Flow>)
    const css = getInjectedCss()
    expect(css).toMatch(/:not\(:where\(\[data-flow\] > \*\)\)>:where\(:first-child\)[^{]*\{margin-block-start:0;\}/)
    expect(css).toMatch(/:not\(:where\(\[data-flow\] > \*\)\)>:where\(:last-child\)[^{]*\{margin-block-end:0;\}/)
  })

  it("flushes a nested column's first and last child inside a root that sits in another flow's later child", () => {
    // The page's column > its second section > a grid cell (no flow) > a root column > a nested column > the rule.
    render(
      <Flow>
        <p>first</p>
        <section data-flow="">
          <div>
            <Flow>
              <Flow>
                <hr data-testid="edge" />
                <p>last</p>
              </Flow>
            </Flow>
          </div>
        </section>
      </Flow>,
    )
    const edge = screen.getByTestId("edge")
    const root = edge.parentElement!.parentElement!
    const rootClasses = Array.from(root.classList)
    // The flush rules of the root's own class, with & as that class.
    const rules = getInjectedCss()
      .split("}")
      .filter(rule => rule.includes("margin-block-start:0") && rootClasses.some(name => rule.includes(`.${name}`)))
      .map(rule => rule.slice(0, rule.indexOf("{")))
    expect(rules.length).toBeGreaterThan(0)
    expect(rules.some(selector => edge.matches(selector))).toBe(true)
    expect(screen.getByText("last").matches(rules.join(","))).toBe(false)
  })

  it("drops the before-space of a heading straight after a rule, or opening the column after it", () => {
    render(
      <Flow>
        <hr />
        <h2>sibling</h2>
        <hr />
        <section data-flow="">
          <div data-flow="">
            <h2>nested</h2>
            <h3>later</h3>
          </div>
        </section>
      </Flow>,
    )
    const selectors = getInjectedCss()
      .split("}")
      .filter(rule => rule.includes(":where(hr)+") || rule.includes(":where(hr) +"))
      .map(rule => rule.slice(0, rule.indexOf("{")))
      .join(",")
    expect(selectors).not.toBe("")
    expect(screen.getByText("sibling").matches(selectors)).toBe(true)
    expect(screen.getByText("nested").matches(selectors)).toBe(true)
    expect(screen.getByText("later").matches(selectors)).toBe(false)
  })

  it("spaces a child marked data-flow-role as that role, and treats a heading row after a rule as a heading", () => {
    render(
      <Flow>
        <hr />
        <div data-flow-role="h2">row</div>
      </Flow>,
    )
    const rules = getInjectedCss().split("}")
    const selectorsWith = (declaration: string) =>
      rules
        .filter(rule => rule.includes(declaration))
        .map(rule => rule.slice(0, rule.indexOf("{")))
        .join(",")
    const row = screen.getByText("row")
    expect(row.matches(selectorsWith(margins("h2")))).toBe(true)
    const afterRule = rules
      .filter(rule => rule.includes(":where(hr)+") || rule.includes(":where(hr) +"))
      .map(rule => rule.slice(0, rule.indexOf("{")))
      .join(",")
    expect(row.matches(afterRule)).toBe(true)
  })

  it("sets the density multiplier and role overrides on the instance", () => {
    render(<Flow density="spacious" space={{ h2: { before: "large" }, code: { after: "base" } }}><p>text</p></Flow>)
    const css = getInjectedCss()
    expect(css).toContain(`${getConstantKey("flow.density")}:${getToken("flow.density:spacious")}`)
    expect(css).toContain(`${getConstantKey("flow.h2:before")}:${getToken("gap", "large")}`)
    expect(css).toContain(`${getConstantKey("flow.code:after")}:${getToken("gap", "base")}`)
  })

  it("forwards id and ref", () => {
    const ref = React.createRef<HTMLElement>()
    render(<Flow id="column" ref={ref}><p>text</p></Flow>)
    expect(ref.current).toHaveAttribute("id", "column")
  })
})

describe("FlowItem", () => {
  it("bleeds past the column's sides by flow.bleed", () => {
    render(<Flow><FlowItem bleed>item</FlowItem></Flow>)
    expect(getInjectedCss()).toContain(`margin-inline:calc(-1 * ${getToken("flow.bleed")})`)
  })

  it("re-maps the block tokens on itself", () => {
    render(<Flow><FlowItem before="small" after="larger">item</FlowItem></Flow>)
    const css = getInjectedCss()
    expect(css).toContain(`${getConstantKey("flow.block:before")}:${getToken("gap", "small")}`)
    expect(css).toContain(`${getConstantKey("flow.block:after")}:${getToken("gap", "larger")}`)
  })
})

describe("getBleedRadius", () => {
  it("is the radius less the bleed, floored at zero", () => {
    expect(getBleedRadius("8px")).toBe(`max(calc(8px * 0), calc(8px - ${getToken("flow.itemBleed")}))`)
  })
})
