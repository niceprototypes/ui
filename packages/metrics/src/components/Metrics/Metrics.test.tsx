import React from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { getToken } from "@niceprototypes/styles"
import Metrics from "./Metrics"

/** CSS text of every rule whose selector starts at one of `element`'s classes. */
function cssFor(element: Element): string {
  const css = Array.from(document.head.querySelectorAll("style"))
    .map(tag => tag.textContent ?? "")
    .join("\n")
  return Array.from(element.classList)
    .flatMap(className => css.match(new RegExp(`\\.${className}[^{]*\\{[^}]*\\}`, "g")) ?? [])
    .join("\n")
}

describe("Metrics", () => {
  it("renders the value, then the label below it", () => {
    const { container } = render(<Metrics value="2.5 GB/s" label="Decode throughput, measured natively" />)
    expect(container.textContent).toBe("2.5 GB/sDecode throughput, measured natively")
    expect(cssFor(container.firstElementChild!)).toContain("flex-direction:column")
  })

  it("value: large Ink in the mono font, centred", () => {
    render(<Metrics value="90%" label="Of channels answered exactly on ciphertext" />)
    const css = cssFor(screen.getByText("90%"))
    expect(css).toContain(`font-family:${getToken("ink.fontFamily:code")}`)
    expect(css).toContain(`font-size:${getToken("ink.fontSize:large")}`)
    expect(css).toContain("text-align:center")
  })

  it("label: small Ink in the base font, centred", () => {
    render(<Metrics value="100%" label="Lossless, bit for bit, every round-trip" />)
    const css = cssFor(screen.getByText("Lossless, bit for bit, every round-trip"))
    expect(css).toContain(`font-family:${getToken("ink.fontFamily:base")}`)
    expect(css).toContain(`font-size:${getToken("ink.fontSize:small")}`)
    expect(css).toContain("text-align:center")
  })
})
