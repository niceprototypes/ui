import * as React from "react"
import { render } from "@testing-library/react"
import "@testing-library/jest-dom"
import { TreeGuide } from "."

const columns = (container: HTMLElement) =>
  Array.from(container.firstElementChild?.children ?? []).map(
    column => `${column.getAttribute("data-branch")}/${column.getAttribute("data-path")}`,
  )

describe("TreeGuide", () => {
  it("draws nothing at the top level", () => {
    const { container } = render(<TreeGuide depth={0} last={false} />)
    expect(container).toBeEmptyDOMElement()
  })

  it("is hidden from assistive technology", () => {
    const { container } = render(<TreeGuide depth={1} last />)
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true")
  })

  it("draws ancestor lines, then a tee or an elbow at depth 3", () => {
    const tee = render(<TreeGuide depth={3} last={false} continues={[true, false]} />)
    expect(columns(tee.container)).toEqual(["line/none", "none/none", "tee/none"])
    const elbow = render(<TreeGuide depth={3} last continues={[false, true]} />)
    expect(columns(elbow.container)).toEqual(["none/none", "line/none", "elbow/none"])
  })

  it("marks the active path", () => {
    const { container } = render(
      <TreeGuide depth={3} last={false} continues={[true, true]} onPath pathContinues={[true, false, false]} />,
    )
    expect(columns(container)).toEqual(["line/through", "line/none", "tee/on"])
  })
})
