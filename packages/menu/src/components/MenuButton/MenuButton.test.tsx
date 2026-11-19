import * as React from "react"
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import { MenuButton } from "./index"
import type { MenuButtonItemsType, MenuButtonProps } from "./MenuButton.types"

const item = (name: string) => screen.getByRole("menuitem", { name })

const makeItems = (log: string[] = []): MenuButtonItemsType => [
  { id: "edit", label: "Edit", icon: "edit", onSelect: () => log.push("edit") },
  { id: "copy", label: "Duplicate", onSelect: () => log.push("copy") },
  { type: "separator", id: "s1" },
  {
    type: "group",
    id: "move",
    label: "Move to",
    items: [
      { id: "top", label: "Top", onSelect: () => log.push("top") },
      { id: "bottom", label: "Bottom", disabled: true, onSelect: () => log.push("bottom") },
    ],
  },
  { id: "delete", label: "Delete", icon: "trash", onSelect: () => log.push("delete") },
]

const renderButton = (props: Partial<MenuButtonProps> = {}) =>
  render(
    <>
      <MenuButton label="Actions" items={makeItems()} {...(props as object)} />
      <button>after</button>
    </>
  )

const trigger = () => screen.getByRole("button", { name: /Actions|Row actions/ })

describe("MenuButton", () => {
  describe("trigger ARIA", () => {
    it("is a button with aria-haspopup=menu and aria-expanded=false while closed", () => {
      renderButton()
      expect(trigger()).toHaveAttribute("aria-haspopup", "menu")
      expect(trigger()).toHaveAttribute("aria-expanded", "false")
      expect(trigger()).not.toHaveAttribute("aria-controls")
      expect(screen.queryByRole("menu")).toBeNull()
    })

    it("sets aria-expanded=true and aria-controls to the menu, named by the trigger, while open", async () => {
      renderButton()
      fireEvent.click(trigger())
      const menu = screen.getByRole("menu", { name: "Actions" })
      expect(trigger()).toHaveAttribute("aria-expanded", "true")
      expect(trigger()).toHaveAttribute("aria-controls", menu.id)
    })

    it("icon-only: shows the menu icon and takes its name from aria-label", () => {
      render(<MenuButton aria-label="Row actions" items={makeItems()} />)
      const button = screen.getByRole("button", { name: "Row actions" })
      expect(button.textContent).toBe("")
      expect(button.querySelector("svg")).not.toBeNull()
      fireEvent.click(button)
      expect(screen.getByRole("menu", { name: "Row actions" })).toBeInTheDocument()
    })
  })

  describe("opening", () => {
    it("opens on click and focuses the first enabled item", async () => {
      renderButton()
      fireEvent.click(trigger())
      await waitFor(() => expect(item("Edit")).toHaveFocus())
    })

    it("opens on ArrowDown on the first item and on ArrowUp on the last", async () => {
      const { unmount } = renderButton()
      fireEvent.keyDown(trigger(), { key: "ArrowDown" })
      await waitFor(() => expect(item("Edit")).toHaveFocus())
      unmount()
      renderButton()
      fireEvent.keyDown(trigger(), { key: "ArrowUp" })
      await waitFor(() => expect(item("Delete")).toHaveFocus())
    })

    it("renders items, a separator and a labelled group with a disabled item", () => {
      renderButton()
      fireEvent.click(trigger())
      expect(screen.getAllByRole("menuitem")).toHaveLength(5)
      expect(screen.getByRole("separator")).toBeInTheDocument()
      expect(screen.getByRole("group", { name: "Move to" })).toContainElement(item("Top"))
      expect(item("Bottom")).toHaveAttribute("aria-disabled", "true")
    })

    it("closes on a second trigger press", () => {
      renderButton()
      fireEvent.click(trigger())
      fireEvent.click(trigger())
      expect(screen.queryByRole("menu")).toBeNull()
    })

    it("does not open while disabled", () => {
      renderButton({ disabled: true })
      fireEvent.click(trigger())
      fireEvent.keyDown(trigger(), { key: "ArrowDown" })
      expect(screen.queryByRole("menu")).toBeNull()
    })
  })

  describe("closing and focus return", () => {
    it("on a choice: closes, returns focus to the trigger, then runs onSelect", async () => {
      const log: string[] = []
      let focusedAtSelect: Element | null = null
      const items: MenuButtonItemsType = [
        {
          id: "edit",
          label: "Edit",
          onSelect: () => {
            focusedAtSelect = document.activeElement
            log.push("edit")
          },
        },
      ]
      render(<MenuButton label="Actions" items={items} />)
      fireEvent.click(trigger())
      await waitFor(() => expect(item("Edit")).toHaveFocus())
      fireEvent.keyDown(item("Edit"), { key: "Enter" })
      expect(log).toEqual(["edit"])
      expect(focusedAtSelect).toBe(trigger())
      expect(screen.queryByRole("menu")).toBeNull()
      expect(trigger()).toHaveFocus()
    })

    it("a disabled item neither runs nor closes", () => {
      const log: string[] = []
      render(<MenuButton label="Actions" items={makeItems(log)} />)
      fireEvent.click(trigger())
      fireEvent.click(item("Bottom"))
      expect(log).toEqual([])
      expect(screen.getByRole("menu")).toBeInTheDocument()
    })

    it.each(["Escape", "Tab"])("on %s: closes and returns focus to the trigger", async key => {
      renderButton()
      fireEvent.click(trigger())
      await waitFor(() => expect(item("Edit")).toHaveFocus())
      fireEvent.keyDown(item("Edit"), { key })
      expect(screen.queryByRole("menu")).toBeNull()
      expect(trigger()).toHaveFocus()
    })

    it("on a press outside: closes", () => {
      renderButton()
      fireEvent.click(trigger())
      fireEvent.pointerDown(screen.getByRole("button", { name: "after" }))
      expect(screen.queryByRole("menu")).toBeNull()
    })

    it("Escape in the menu does not reach an enclosing document listener (a dialog)", async () => {
      const onDocumentKey = jest.fn()
      document.addEventListener("keydown", onDocumentKey)
      renderButton()
      fireEvent.click(trigger())
      await waitFor(() => expect(item("Edit")).toHaveFocus())
      fireEvent.keyDown(item("Edit"), { key: "Escape" })
      expect(onDocumentKey).not.toHaveBeenCalled()
      document.removeEventListener("keydown", onDocumentKey)
    })
  })

  describe("controlled", () => {
    it("follows open and reports requests through onOpenChange once each", () => {
      const onOpenChange = jest.fn()
      const { rerender } = render(<MenuButton label="Actions" items={makeItems()} open={false} onOpenChange={onOpenChange} />)
      fireEvent.click(trigger())
      expect(onOpenChange).toHaveBeenLastCalledWith(true)
      expect(screen.queryByRole("menu")).toBeNull()
      rerender(<MenuButton label="Actions" items={makeItems()} open onOpenChange={onOpenChange} />)
      expect(screen.getByRole("menu")).toBeInTheDocument()
      fireEvent.click(item("Edit"))
      expect(onOpenChange).toHaveBeenLastCalledWith(false)
      expect(onOpenChange).toHaveBeenCalledTimes(2)
    })

    it("an open set by the prop does not take focus; ArrowDown on the trigger then moves in", () => {
      render(
        <>
          <button>elsewhere</button>
          <MenuButton label="Actions" items={makeItems()} open />
        </>
      )
      act(() => screen.getByRole("button", { name: "elsewhere" }).focus())
      expect(screen.getByRole("button", { name: "elsewhere" })).toHaveFocus()
      fireEvent.keyDown(trigger(), { key: "ArrowDown" })
      expect(item("Edit")).toHaveFocus()
    })
  })

  describe("select appearance", () => {
    it("shows the placeholder and a caret while there is no label", () => {
      render(<MenuButton appearance="select" placeholder="None selected" aria-label="Bulk actions" items={makeItems()} />)
      const button = screen.getByRole("button", { name: "Bulk actions" })
      expect(button).toHaveTextContent("None selected")
      expect(button).toHaveAttribute("aria-haspopup", "menu")
      expect(button.querySelectorAll("svg")).toHaveLength(1)
    })

    it("shows the label over the placeholder", () => {
      render(<MenuButton appearance="select" placeholder="None selected" label="12 selected" items={makeItems()} />)
      expect(screen.getByRole("button", { name: "12 selected" })).toBeInTheDocument()
    })
  })

  it("forwards ref to the trigger", () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<MenuButton label="Actions" items={makeItems()} ref={ref} />)
    expect(ref.current).toBe(trigger())
  })

  it("pins the theme on the trigger and the menu", () => {
    render(<MenuButton label="Actions" items={makeItems()} theme="night" />)
    fireEvent.click(trigger())
    expect(trigger().closest("[data-theme]")).toHaveAttribute("data-theme", "night")
    expect(screen.getByRole("menu").closest("[data-theme]")).toHaveAttribute("data-theme", "night")
  })
})
