import * as React from "react"
import { act, fireEvent, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { Menu } from "./index"
import { MenuItem } from "../MenuItem"
import { MenuGroup } from "../MenuGroup"
import { MenuSeparator } from "../MenuSeparator"
import type { MenuProps } from "./Menu.types"

const item = (name: string) => screen.getByRole("menuitem", { name })
// jsdom has no PointerEvent: a pointermove MouseEvent carrying pointerType stands in.
const pointerMove = (target: Element, pointerType: string) => {
  const event = new MouseEvent("pointermove", { bubbles: true })
  Object.defineProperty(event, "pointerType", { value: pointerType })
  fireEvent(target, event)
}
const press = (key: string, target: Element = document.activeElement as Element) => fireEvent.keyDown(target, { key })

/** New, Open, (separator), Export group with PNG, PDF (disabled), SVG; Delete (disabled). */
const FileMenu: React.FC<Partial<MenuProps> & { onSelect?: (name: string) => void }> = ({ onSelect, ...props }) => (
  <Menu aria-label="File" {...props}>
    <MenuItem icon="plus" onSelect={() => onSelect?.("New")}>
      New
    </MenuItem>
    <MenuItem onSelect={() => onSelect?.("Open")}>Open</MenuItem>
    <MenuSeparator />
    <MenuGroup label="Export">
      <MenuItem onSelect={() => onSelect?.("PNG")}>PNG</MenuItem>
      <MenuItem disabled onSelect={() => onSelect?.("PDF")}>
        PDF
      </MenuItem>
      <MenuItem onSelect={() => onSelect?.("SVG")}>SVG</MenuItem>
    </MenuGroup>
    <MenuItem disabled onSelect={() => onSelect?.("Delete")}>
      Delete
    </MenuItem>
  </Menu>
)

describe("Menu", () => {
  describe("ARIA", () => {
    it("renders role=menu with its name, menuitems, a named group and a separator", () => {
      render(<FileMenu />)
      expect(screen.getByRole("menu", { name: "File" })).toBeInTheDocument()
      expect(screen.getAllByRole("menuitem")).toHaveLength(6)
      expect(screen.getByRole("group", { name: "Export" })).toContainElement(item("PNG"))
      expect(screen.getByRole("separator")).not.toHaveAttribute("tabindex")
    })

    it("marks disabled items aria-disabled and keeps them out of the tab order", () => {
      render(<FileMenu />)
      expect(item("PDF")).toHaveAttribute("aria-disabled", "true")
      expect(item("PDF")).toHaveAttribute("tabindex", "-1")
      expect(item("New")).not.toHaveAttribute("aria-disabled")
    })

    it("names the menu by aria-labelledby", () => {
      render(
        <>
          <span id="lbl">Actions</span>
          <Menu aria-labelledby="lbl">
            <MenuItem>One</MenuItem>
          </Menu>
        </>
      )
      expect(screen.getByRole("menu", { name: "Actions" })).toBeInTheDocument()
    })

    it("hides the item icon from assistive technology", () => {
      render(<FileMenu />)
      expect(item("New").querySelector('[aria-hidden="true"] svg, [aria-hidden="true"]')).not.toBeNull()
      expect(item("New")).toHaveAccessibleName("New")
    })
  })

  describe("roving tabindex", () => {
    it("is one tab stop: the menu until an item has focus, then that item", () => {
      render(<FileMenu />)
      const menu = screen.getByRole("menu")
      expect(menu).toHaveAttribute("tabindex", "0")
      expect(screen.getAllByRole("menuitem").every(element => element.getAttribute("tabindex") === "-1")).toBe(true)
      act(() => item("Open").focus())
      expect(menu).toHaveAttribute("tabindex", "-1")
      expect(item("Open")).toHaveAttribute("tabindex", "0")
      expect(item("New")).toHaveAttribute("tabindex", "-1")
    })

    it("passes focus from the menu to its first enabled item", () => {
      render(<FileMenu />)
      act(() => screen.getByRole("menu").focus())
      expect(item("New")).toHaveFocus()
    })
  })

  describe("keyboard", () => {
    it("moves with ArrowDown / ArrowUp, skipping disabled items and wrapping", () => {
      render(<FileMenu />)
      act(() => item("New").focus())
      press("ArrowDown")
      expect(item("Open")).toHaveFocus()
      press("ArrowDown")
      expect(item("PNG")).toHaveFocus()
      press("ArrowDown")
      expect(item("SVG")).toHaveFocus()
      // Delete is disabled: wraps to New
      press("ArrowDown")
      expect(item("New")).toHaveFocus()
      press("ArrowUp")
      expect(item("SVG")).toHaveFocus()
    })

    it("moves to the first / last enabled item with Home / End", () => {
      render(<FileMenu />)
      act(() => item("Open").focus())
      press("End")
      expect(item("SVG")).toHaveFocus()
      press("Home")
      expect(item("New")).toHaveFocus()
    })

    it("enters from the menu itself: ArrowDown to the first item, ArrowUp to the last", () => {
      render(<FileMenu />)
      const menu = screen.getByRole("menu")
      press("ArrowUp", menu)
      expect(item("SVG")).toHaveFocus()
    })

    it("typeahead focuses the next enabled item starting with the typed text, skipping disabled", () => {
      render(<FileMenu />)
      act(() => item("New").focus())
      press("p")
      // PDF is disabled
      expect(item("PNG")).toHaveFocus()
      press("s")
      // "ps" matches nothing; a repeated character would cycle, a new one does not
      expect(item("PNG")).toHaveFocus()
    })

    it("typeahead cycles through items starting with one repeated character", () => {
      render(
        <Menu aria-label="Fruit">
          <MenuItem>Apple</MenuItem>
          <MenuItem>Avocado</MenuItem>
          <MenuItem>Banana</MenuItem>
        </Menu>
      )
      act(() => item("Banana").focus())
      press("a")
      expect(item("Apple")).toHaveFocus()
      press("a")
      expect(item("Avocado")).toHaveFocus()
    })

    it("typeahead buffer clears after the timeout", () => {
      jest.useFakeTimers()
      render(<FileMenu />)
      act(() => item("New").focus())
      press("s")
      expect(item("SVG")).toHaveFocus()
      act(() => jest.advanceTimersByTime(600))
      press("n")
      expect(item("New")).toHaveFocus()
      jest.useRealTimers()
    })

    it("activates the focused item with Enter and with Space", () => {
      const onSelect = jest.fn()
      render(<FileMenu onSelect={onSelect} />)
      act(() => item("Open").focus())
      press("Enter")
      expect(onSelect).toHaveBeenLastCalledWith("Open")
      press("ArrowDown")
      press(" ")
      expect(onSelect).toHaveBeenLastCalledWith("PNG")
      expect(onSelect).toHaveBeenCalledTimes(2)
    })
  })

  describe("activation", () => {
    it("runs onSelect on click and asks a transient menu to close with 'select'", () => {
      const onSelect = jest.fn()
      const onClose = jest.fn()
      render(<FileMenu onSelect={onSelect} onClose={onClose} />)
      fireEvent.click(item("New"))
      expect(onSelect).toHaveBeenCalledWith("New")
      expect(onClose).toHaveBeenCalledWith("select")
    })

    it("keeps the menu open when onSelect calls event.preventDefault()", () => {
      const onClose = jest.fn()
      render(
        <Menu aria-label="View" onClose={onClose}>
          <MenuItem onSelect={event => event.preventDefault()}>Grid</MenuItem>
        </Menu>
      )
      fireEvent.click(item("Grid"))
      expect(onClose).not.toHaveBeenCalled()
    })

    it("ignores clicks on a disabled item and does not let it take focus", () => {
      const onSelect = jest.fn()
      const onClose = jest.fn()
      render(<FileMenu onSelect={onSelect} onClose={onClose} />)
      const mouseDown = fireEvent.mouseDown(item("Delete"))
      fireEvent.click(item("Delete"))
      expect(mouseDown).toBe(false)
      expect(onSelect).not.toHaveBeenCalled()
      expect(onClose).not.toHaveBeenCalled()
    })
  })

  describe("transient (onClose)", () => {
    it("reports Escape and stops it from reaching the document", () => {
      const onClose = jest.fn()
      const onDocumentKey = jest.fn()
      document.addEventListener("keydown", onDocumentKey)
      render(<FileMenu onClose={onClose} />)
      act(() => item("New").focus())
      press("Escape")
      expect(onClose).toHaveBeenCalledWith("escape")
      expect(onDocumentKey).not.toHaveBeenCalled()
      document.removeEventListener("keydown", onDocumentKey)
    })

    it("holds Tab and reports it", () => {
      const onClose = jest.fn()
      render(<FileMenu onClose={onClose} />)
      act(() => item("New").focus())
      const notPrevented = fireEvent.keyDown(item("New"), { key: "Tab" })
      expect(notPrevented).toBe(false)
      expect(onClose).toHaveBeenCalledWith("tab")
    })

    it("leaves Escape and Tab alone without onClose (an embedded menu)", () => {
      render(<FileMenu />)
      act(() => item("New").focus())
      expect(fireEvent.keyDown(item("New"), { key: "Tab" })).toBe(true)
      expect(fireEvent.keyDown(item("New"), { key: "Escape" })).toBe(true)
    })
  })

  describe("autoFocus", () => {
    it("focuses the first enabled item on mount", () => {
      render(<FileMenu autoFocus="first" />)
      expect(item("New")).toHaveFocus()
    })

    it("focuses the last enabled item on mount, skipping a disabled last item", () => {
      render(<FileMenu autoFocus="last" />)
      expect(item("SVG")).toHaveFocus()
    })

    it("focuses the menu itself when every item is disabled", () => {
      render(
        <Menu aria-label="Empty" autoFocus="first">
          <MenuItem disabled>Nothing</MenuItem>
        </Menu>
      )
      expect(screen.getByRole("menu")).toHaveFocus()
    })

    it("focuses nothing without autoFocus", () => {
      render(<FileMenu />)
      expect(document.body).toHaveFocus()
    })
  })

  describe("pointer", () => {
    it("focuses an enabled item a mouse moves over, not a disabled one, not on touch", () => {
      render(<FileMenu />)
      pointerMove(item("Open"), "mouse")
      expect(item("Open")).toHaveFocus()
      pointerMove(item("PDF"), "mouse")
      expect(item("Open")).toHaveFocus()
      pointerMove(item("PNG"), "touch")
      expect(item("Open")).toHaveFocus()
    })
  })

  it("hands the tab stop back to the menu when the active item becomes disabled", () => {
    const { rerender } = render(
      <Menu aria-label="Edit">
        <MenuItem>Cut</MenuItem>
        <MenuItem>Copy</MenuItem>
      </Menu>
    )
    act(() => item("Cut").focus())
    rerender(
      <Menu aria-label="Edit">
        <MenuItem disabled>Cut</MenuItem>
        <MenuItem>Copy</MenuItem>
      </Menu>
    )
    expect(screen.getByRole("menu")).toHaveAttribute("tabindex", "0")
  })

  it("throws a clear error for a MenuItem outside a Menu", () => {
    const error = jest.spyOn(console, "error").mockImplementation(() => {})
    expect(() => render(<MenuItem>Alone</MenuItem>)).toThrow("MenuItem must be rendered inside a Menu")
    error.mockRestore()
  })

  it("forwards ref and wraps in Theme when theme is set", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<FileMenu ref={ref} theme="night" />)
    expect(ref.current).toBe(screen.getByRole("menu"))
    expect(screen.getByRole("menu").parentElement).toHaveAttribute("data-theme", "night")
  })
})
