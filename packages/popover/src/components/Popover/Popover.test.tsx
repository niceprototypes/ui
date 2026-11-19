import * as React from "react"
import { render, screen, fireEvent, act } from "@testing-library/react"
import "@testing-library/jest-dom"
import Popover from "./Popover"
import WrappedPopover from "./index"
import { computeAnchorPosition } from "../../services/computeAnchorPosition"
import { ANCHOR_OFFSET_FALLBACK } from "../../services/getAnchorOffset"
import type { PopoverProps } from "./Popover.types"

const ANCHOR_RECT = { top: 100, left: 40, right: 140, bottom: 130, width: 100, height: 30, x: 40, y: 100 }

type HarnessProps = Partial<Omit<PopoverProps, "anchorRef">> & { initialOpen?: boolean }

/**
 * Anchor button + controlled Popover. The anchor's rect is stubbed so the
 * position assertions are deterministic under jsdom (which has no layout).
 */
const Harness: React.FC<HarnessProps> = ({ initialOpen = true, onOpenChange, children, ...rest }) => {
  const anchorRef = React.useRef<HTMLButtonElement>(null)
  const [open, setOpen] = React.useState(initialOpen)
  return (
    <>
      <button
        ref={(node) => {
          anchorRef.current = node
          if (node) node.getBoundingClientRect = () => ({ ...ANCHOR_RECT, toJSON: () => ({}) }) as DOMRect
        }}
        onClick={() => setOpen((o) => !o)}
      >
        anchor
      </button>
      <button>outside</button>
      <Popover
        {...rest}
        open={open}
        anchorRef={anchorRef}
        onOpenChange={(next) => {
          onOpenChange?.(next)
          setOpen(next)
        }}
      >
        {children ?? <button>inside</button>}
      </Popover>
    </>
  )
}

describe("Popover", () => {
  it("renders into document.body when open", () => {
    const { container } = render(<Harness aria-label="menu" />)
    const popover = screen.getByRole("dialog", { name: "menu" })
    expect(popover.parentElement).toBe(document.body)
    expect(container.contains(popover)).toBe(false)
  })

  it("renders nothing when closed", () => {
    render(<Harness initialOpen={false} aria-label="menu" />)
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    expect(screen.queryByText("inside")).not.toBeInTheDocument()
  })

  it("applies role, aria and id props", () => {
    render(<Harness role="listbox" aria-labelledby="lbl" id="pop" />)
    const popover = screen.getByRole("listbox")
    expect(popover).toHaveAttribute("aria-labelledby", "lbl")
    expect(popover).toHaveAttribute("id", "pop")
  })

  it("calls onOpenChange(false) on Escape", () => {
    const onOpenChange = jest.fn()
    render(<Harness onOpenChange={onOpenChange} aria-label="menu" />)
    fireEvent.keyDown(document, { key: "Escape" })
    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("calls onOpenChange(false) on pointerdown outside popover and anchor", () => {
    const onOpenChange = jest.fn()
    render(<Harness onOpenChange={onOpenChange} aria-label="menu" />)
    fireEvent.pointerDown(screen.getByText("outside"))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it("does not dismiss on pointerdown inside the popover", () => {
    const onOpenChange = jest.fn()
    render(<Harness onOpenChange={onOpenChange} aria-label="menu" />)
    fireEvent.pointerDown(screen.getByText("inside"))
    expect(onOpenChange).not.toHaveBeenCalled()
    expect(screen.getByRole("dialog")).toBeInTheDocument()
  })

  it("does not dismiss on pointerdown on the anchor", () => {
    const onOpenChange = jest.fn()
    render(<Harness onOpenChange={onOpenChange} aria-label="menu" />)
    fireEvent.pointerDown(screen.getByText("anchor"))
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  describe("ignoreOutsideRefs", () => {
    const IgnoreHarness: React.FC<{ onOpenChange: (open: boolean) => void }> = ({ onOpenChange }) => {
      const anchorRef = React.useRef<HTMLInputElement>(null)
      const triggerRef = React.useRef<HTMLButtonElement>(null)
      return (
        <>
          <input ref={anchorRef} aria-label="date" />
          <button ref={triggerRef}>
            <span>calendar</span>
          </button>
          <button>outside</button>
          {/* Inline array: a new value every render, read through a latest-value ref. */}
          <Popover open anchorRef={anchorRef} ignoreOutsideRefs={[triggerRef]} onOpenChange={onOpenChange} aria-label="menu">
            <button>inside</button>
          </Popover>
        </>
      )
    }

    it("does not dismiss on pointerdown inside an ignored element", () => {
      const onOpenChange = jest.fn()
      render(<IgnoreHarness onOpenChange={onOpenChange} />)
      fireEvent.pointerDown(screen.getByText("calendar"))
      fireEvent.pointerDown(screen.getByRole("button", { name: "calendar" }))
      expect(onOpenChange).not.toHaveBeenCalled()
    })

    it("still dismisses on pointerdown elsewhere", () => {
      const onOpenChange = jest.fn()
      render(<IgnoreHarness onOpenChange={onOpenChange} />)
      fireEvent.pointerDown(screen.getByText("outside"))
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })

    it("does not re-run the dismiss effect when an inline array changes identity", () => {
      const onOpenChange = jest.fn()
      const add = jest.spyOn(document, "addEventListener")
      const { rerender } = render(<IgnoreHarness onOpenChange={onOpenChange} />)
      rerender(<IgnoreHarness onOpenChange={onOpenChange} />)
      expect(add.mock.calls.filter(([type]) => type === "pointerdown")).toHaveLength(1)
      add.mockRestore()
    })
  })

  it("returns focus to the anchor on close when focus was inside", () => {
    render(<Harness aria-label="menu" />)
    act(() => screen.getByText("inside").focus())
    expect(screen.getByText("inside")).toHaveFocus()
    fireEvent.keyDown(document, { key: "Escape" })
    expect(screen.getByText("anchor")).toHaveFocus()
  })

  it("does not move focus on close when focus was outside", () => {
    render(<Harness aria-label="menu" />)
    act(() => screen.getByText("outside").focus())
    fireEvent.keyDown(document, { key: "Escape" })
    expect(screen.getByText("outside")).toHaveFocus()
  })

  it("forwards ref to the popover element", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Harness ref={ref} aria-label="menu" />)
    expect(ref.current).toBe(screen.getByRole("dialog"))
  })

  it("forwards ref through the withBreakpoints-wrapped export", () => {
    const ref = React.createRef<HTMLDivElement>()
    const Wrapped: React.FC = () => {
      const anchorRef = React.useRef<HTMLButtonElement>(null)
      return (
        <>
          <button ref={anchorRef}>anchor</button>
          <WrappedPopover open anchorRef={anchorRef} ref={ref} aria-label="wrapped" />
        </>
      )
    }
    render(<Wrapped />)
    expect(ref.current).toBe(screen.getByRole("dialog", { name: "wrapped" }))
  })

  it("applies position styles from computeAnchorPosition (defaults bottom / start)", () => {
    render(<Harness aria-label="menu" />)
    const expected = computeAnchorPosition(ANCHOR_RECT, "bottom", "start", ANCHOR_OFFSET_FALLBACK)
    const popover = screen.getByRole("dialog")
    expect(popover.style.top).toBe(`${expected.top}px`)
    expect(popover.style.left).toBe(`${expected.left}px`)
    expect(popover.style.transform).toBe(expected.transform)
  })

  it("applies position styles for a given position and align", () => {
    render(<Harness aria-label="menu" position="right" align="center" />)
    const expected = computeAnchorPosition(ANCHOR_RECT, "right", "center", ANCHOR_OFFSET_FALLBACK)
    const popover = screen.getByRole("dialog")
    expect(popover.style.top).toBe(`${expected.top}px`)
    expect(popover.style.left).toBe(`${expected.left}px`)
    expect(popover.style.transform).toBe(expected.transform)
  })

  it("flips to the opposite side when its side overflows the viewport", () => {
    // The surface measures innerHeight tall (the anchor stubs its own rect).
    const rect = jest
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockReturnValue({ top: 0, left: 0, right: 80, bottom: window.innerHeight, width: 80, height: window.innerHeight, x: 0, y: 0, toJSON: () => ({}) })
    render(<Harness aria-label="menu" position="top" />)
    // top overflows by innerHeight - 92; bottom by 138 → bottom
    expect(screen.getByRole("dialog").style.transform).toBe("translate(0, 0)")
    rect.mockRestore()
  })

  it("shifts by the surface's fractional width, ending exactly at the viewport edge", () => {
    const width = 167.44
    const rect = jest
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockReturnValue({ top: 0, left: 0, right: width, bottom: 40, width, height: 40, x: 0, y: 0, toJSON: () => ({}) })
    const AtEdge: React.FC = () => {
      const anchorRef = React.useRef<HTMLButtonElement>(null)
      return (
        <>
          <button
            ref={node => {
              anchorRef.current = node
              const left = window.innerWidth - 50
              if (node) node.getBoundingClientRect = () => ({ ...ANCHOR_RECT, left, right: left + 40, x: left, toJSON: () => ({}) }) as DOMRect
            }}
          >
            anchor
          </button>
          <Popover open anchorRef={anchorRef} aria-label="menu" />
        </>
      )
    }
    render(<AtEdge />)
    expect(Number.parseFloat(screen.getByRole("dialog").style.left) + width).toBeCloseTo(window.innerWidth, 5)
    rect.mockRestore()
  })

  describe("inside an open <dialog>", () => {
    it("portals into the dialog, so a modal dialog does not cover it or make it inert", () => {
      const InDialog: React.FC = () => {
        const anchorRef = React.useRef<HTMLButtonElement>(null)
        return (
          <dialog open>
            <button ref={anchorRef}>anchor</button>
            <Popover open anchorRef={anchorRef} aria-label="menu" />
          </dialog>
        )
      }
      render(<InDialog />)
      const popover = screen.getByRole("dialog", { name: "menu" })
      expect(popover.parentElement?.tagName).toBe("DIALOG")
    })

    it("still portals to <body> for an anchor outside any dialog", () => {
      render(<Harness aria-label="menu" />)
      expect(screen.getByRole("dialog", { name: "menu" }).parentElement).toBe(document.body)
    })
  })

  describe("matchAnchorWidth", () => {
    it("sets min-width to the anchor's width", () => {
      render(<Harness aria-label="menu" matchAnchorWidth />)
      expect(screen.getByRole("dialog").style.minWidth).toBe(`${ANCHOR_RECT.width}px`)
    })

    it("sets no min-width by default", () => {
      render(<Harness aria-label="menu" />)
      expect(screen.getByRole("dialog").style.minWidth).toBe("")
    })
  })

  it("forwards className and wraps in Theme when theme is set", () => {
    render(<Harness aria-label="menu" className="custom" theme="night" />)
    const popover = screen.getByRole("dialog")
    expect(popover).toHaveClass("custom")
    expect(popover.parentElement).toHaveAttribute("data-theme", "night")
  })

  it("adds one scroll and one resize listener while open and removes them on close", () => {
    const add = jest.spyOn(window, "addEventListener")
    const remove = jest.spyOn(window, "removeEventListener")
    render(<Harness aria-label="menu" />)
    expect(add.mock.calls.filter(([type]) => type === "scroll")).toHaveLength(1)
    expect(add.mock.calls.filter(([type]) => type === "resize")).toHaveLength(1)
    fireEvent.keyDown(document, { key: "Escape" })
    expect(remove.mock.calls.filter(([type]) => type === "scroll")).toHaveLength(1)
    expect(remove.mock.calls.filter(([type]) => type === "resize")).toHaveLength(1)
    add.mockRestore()
    remove.mockRestore()
  })
})
