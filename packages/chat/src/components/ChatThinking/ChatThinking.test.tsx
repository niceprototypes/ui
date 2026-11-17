import * as React from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { ChatThinking } from "."

describe("ChatThinking", () => {
  it("is a status region named Thinking by default", () => {
    render(<ChatThinking />)
    expect(screen.getByRole("status", { name: "Thinking" })).toBeInTheDocument()
  })

  it("takes its accessible name from aria-label", () => {
    render(<ChatThinking aria-label="Working" />)
    expect(screen.getByRole("status", { name: "Working" })).toBeInTheDocument()
  })

  it("renders three hidden dots and no text", () => {
    render(<ChatThinking />)
    const status = screen.getByRole("status")
    expect(status.children).toHaveLength(3)
    Array.from(status.children).forEach(dot => expect(dot).toHaveAttribute("aria-hidden", "true"))
    expect(status).toHaveTextContent("")
  })

  it("staggers the dots", () => {
    render(<ChatThinking />)
    const [first, , third] = Array.from(screen.getByRole("status").children)
    expect(getComputedStyle(first).animationDelay).not.toBe(getComputedStyle(third).animationDelay)
  })
})
