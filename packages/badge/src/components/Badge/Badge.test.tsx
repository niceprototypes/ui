import * as React from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import Badge from "."

describe("Badge", () => {
  it("renders its label", () => {
    render(<Badge label="Running" status="success" />)
    expect(screen.getByText("Running")).toBeInTheDocument()
  })

  it("defaults to the base status", () => {
    render(<Badge label="Stopped" />)
    expect(screen.getByText("Stopped")).toHaveAttribute("data-status", "base")
  })

  it.each(["success", "warning", "error"] as const)("marks the %s status", status => {
    render(<Badge label={status} status={status} />)
    expect(screen.getByText(status)).toHaveAttribute("data-status", status)
  })
})
