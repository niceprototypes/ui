import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import { ChatToolCall } from "."

describe("ChatToolCall", () => {
  it("is a group named by its title, with its details and both actions while pending", async () => {
    const onApprove = jest.fn()
    const onDeny = jest.fn()
    render(
      <ChatToolCall
        title="Install asset"
        onApprove={onApprove}
        onDeny={onDeny}
      >
        nice/chat@1.0.0
      </ChatToolCall>
    )
    expect(screen.getByRole("group", { name: "Install asset" })).toHaveTextContent("nice/chat@1.0.0")
    expect(screen.queryByRole("status")).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole("button", { name: "Approve" }))
    await userEvent.click(screen.getByRole("button", { name: "Deny" }))
    expect(onApprove).toHaveBeenCalledTimes(1)
    expect(onDeny).toHaveBeenCalledTimes(1)
  })

  it.each([
    ["running", "Running"],
    ["done", "Done"],
    ["denied", "Denied"],
  ] as const)("%s shows its status in place of the actions", (status, label) => {
    render(<ChatToolCall title="Install asset" status={status} />)
    expect(screen.getByRole("status")).toHaveTextContent(label)
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })

  it("shows the outcome after a failed status", () => {
    render(
      <ChatToolCall
        title="Install asset"
        status="failed"
        outcome="Asset not found"
      />
    )
    expect(screen.getByRole("status")).toHaveTextContent("Failed: Asset not found")
  })
})
