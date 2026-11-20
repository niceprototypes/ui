import * as React from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { getConstantKey, getToken } from "@niceprototypes/styles"
import Flow from "./Flow"
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
  it("re-maps the block tokens on itself", () => {
    render(<Flow><FlowItem before="small" after="larger">item</FlowItem></Flow>)
    const css = getInjectedCss()
    expect(css).toContain(`${getConstantKey("flow.block:before")}:${getToken("gap", "small")}`)
    expect(css).toContain(`${getConstantKey("flow.block:after")}:${getToken("gap", "larger")}`)
  })
})
