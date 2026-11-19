import React from "react"
import { act, render } from "@testing-library/react"
import "@testing-library/jest-dom"
import { getToken } from "@niceprototypes/styles"
import Header from "./Header"

/** CSS text of every rule whose selector starts at one of `element`'s classes. */
function cssFor(element: Element): string {
  const css = Array.from(document.head.querySelectorAll("style"))
    .map(tag => tag.textContent ?? "")
    .join("\n")
  return Array.from(element.classList)
    .flatMap(className => css.match(new RegExp(`\\.${className}[^{]*\\{[^}]*\\}`, "g")) ?? [])
    .join("\n")
}

/** Every IntersectionObserver created, to fire entries by hand. */
let observers: Array<{ callback: IntersectionObserverCallback; options?: IntersectionObserverInit; targets: Element[] }> = []

beforeEach(() => {
  observers = []
  ;(globalThis as any).IntersectionObserver = class {
    record: (typeof observers)[number]
    constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
      this.record = { callback, options, targets: [] }
      observers.push(this.record)
    }
    observe(target: Element) {
      this.record.targets.push(target)
    }
    disconnect() {}
    unobserve() {}
    takeRecords() {
      return []
    }
  }
  ;(globalThis as any).ResizeObserver = class {
    observe() {}
    disconnect() {}
    unobserve() {}
  }
})

/** Fire the latest observer: the sentinel is above the root's top (stuck) or not. */
const setStuck = (stuck: boolean) =>
  act(() => {
    const record = observers[observers.length - 1]
    record.callback(
      [
        {
          isIntersecting: !stuck,
          boundingClientRect: { top: stuck ? -10 : 10 } as DOMRectReadOnly,
          rootBounds: { top: 0 } as DOMRectReadOnly,
          target: record.targets[0],
        } as unknown as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver,
    )
  })

const header = (container: HTMLElement) => container.querySelector("header")!

describe("Header", () => {
  it("static by default: a header element in the flow, no sentinel, no observer", () => {
    const { container } = render(<Header>Logo</Header>)
    expect(header(container)).toHaveAttribute("data-state", "static")
    expect(cssFor(header(container))).toContain("position:static")
    expect(container.children).toHaveLength(1)
    expect(observers).toHaveLength(0)
  })

  it("sticky: CSS sticky at the offset token, with the safe-area top and the z-index token", () => {
    const { container } = render(<Header position="sticky">Logo</Header>)
    const css = cssFor(header(container))
    expect(css).toContain("position:sticky")
    expect(css).toContain(`top:${getToken("header.offset")}`)
    expect(css).toContain(`padding-block-start:${getToken("header.safeArea.top")}`)
    expect(css).toContain(`z-index:${getToken("header.zIndex")}`)
  })

  it("sticky: the sentinel sits before the header, shifted by threshold minus offset, observed against the document", () => {
    const { container } = render(
      <Header position="sticky" threshold={40} offset="8px">
        Logo
      </Header>,
    )
    const sentinel = container.firstElementChild!
    expect(sentinel.nextElementSibling).toBe(header(container))
    expect(cssFor(sentinel)).toContain("top:calc(40px - 8px)")
    expect(observers[observers.length - 1].targets[0]).toBe(sentinel)
    expect(observers[observers.length - 1].options?.root).toBe(document)
  })

  it("the stuck state: data-state follows the observer and onStateChange reports each change", () => {
    const onStateChange = jest.fn()
    const { container } = render(
      <Header position="sticky" onStateChange={onStateChange}>
        Logo
      </Header>,
    )
    setStuck(true)
    expect(header(container)).toHaveAttribute("data-state", "stuck")
    setStuck(false)
    expect(header(container)).toHaveAttribute("data-state", "static")
    expect(onStateChange.mock.calls).toEqual([["stuck"], ["static"]])
  })

  it("threshold: relative in the flow until stuck, then sticky with the slide-in", () => {
    const { container } = render(
      <Header position="sticky" threshold={200}>
        Logo
      </Header>,
    )
    expect(cssFor(header(container))).toContain("position:relative")
    expect(header(container)).not.toHaveAttribute("data-enter")
    setStuck(true)
    expect(cssFor(header(container))).toContain("position:sticky")
    expect(header(container)).toHaveAttribute("data-enter")
  })

  it("no threshold: always pinned, no slide-in", () => {
    const { container } = render(<Header position="fixed">Logo</Header>)
    setStuck(true)
    expect(cssFor(header(container))).toContain("position:fixed")
    expect(header(container)).not.toHaveAttribute("data-enter")
  })

  it("fixed: a placeholder wraps the sentinel and the header", () => {
    const { container } = render(<Header position="fixed">Logo</Header>)
    const placeholder = container.firstElementChild!
    expect(placeholder.tagName).toBe("DIV")
    expect(placeholder.lastElementChild).toBe(header(container))
    expect(cssFor(header(container))).toContain("position:fixed")
  })

  it("fixed in a scroll container renders sticky, without a placeholder", () => {
    const root = document.createElement("div")
    const { container } = render(
      <Header position="fixed" root={root}>
        Logo
      </Header>,
    )
    expect(cssFor(header(container))).toContain("position:sticky")
    expect(header(container).parentElement).toBe(container) // no placeholder: sticky stays in the flow
  })

  it("height: the root gets the measured height variable and scroll-padding-top from it, removed on unmount", () => {
    const key = getToken("header.height", { as: "key" })
    const { unmount } = render(<Header position="sticky">Logo</Header>)
    const style = document.documentElement.style
    expect(style.getPropertyValue(key)).toBe("0px") // jsdom measures 0
    expect(style.scrollPaddingTop).toBe(`calc(${getToken("header.height")} + ${getToken("header.offset")})`)
    unmount()
    expect(style.getPropertyValue(key)).toBe("")
    expect(style.scrollPaddingTop).toBe("")
  })

  it("appearance: default and stuck values from the header tokens; set values from core tokens", () => {
    const { container } = render(
      <Header position="sticky" appearance={{ stuck: { backgroundColor: "raised", boxShadow: "none", fontSize: "small" } }}>
        Logo
      </Header>,
    )
    const css = cssFor(header(container))
    expect(css).toContain(`background-color:${getToken("header.backgroundColor:base")}`)
    expect(css).toContain(`box-shadow:${getToken("header.boxShadow:base")}`)
    expect(css).toContain(`background-color:${getToken("backgroundColor", "raised")}`)
    expect(css).toContain(`box-shadow:${getToken("header.boxShadow:none")}`)
    expect(css).toContain(`font-size:${getToken("fontSize", "small")}`)
    expect(css).toContain(`border-block-end-color:${getToken("header.borderColor:stuck")}`)
  })

  it("transitions: the header tokens by default, core motion tokens when set", () => {
    const { container, rerender } = render(<Header>Logo</Header>)
    expect(cssFor(header(container))).toContain(`transition-duration:${getToken("header.transitionDuration")}`)
    expect(cssFor(header(container))).toContain(`transition-timing-function:${getToken("header.transitionEasing")}`)
    rerender(
      <Header transitionDuration="slow" transitionEasing="ease-out">
        Logo
      </Header>,
    )
    expect(cssFor(header(container))).toContain(`transition-duration:${getToken("animationDuration", "slow")}`)
    expect(cssFor(header(container))).toContain(`transition-timing-function:${getToken("animationEasing", "ease-out")}`)
  })

  it("reduced motion turns transitions and the slide-in off", () => {
    render(<Header>Logo</Header>)
    const css = Array.from(document.head.querySelectorAll("style"))
      .map(tag => tag.textContent ?? "")
      .join("\n")
    expect(css).toMatch(/prefers-reduced-motion:\s*reduce\)\{[^}]*\{transition:none;animation:none;\}/)
  })

  it("state: a forced state renders without scrolling; hidden slides out unless focus is inside", () => {
    const { container } = render(
      <Header position="sticky" state="hidden">
        Logo
      </Header>,
    )
    expect(header(container)).toHaveAttribute("data-state", "hidden")
    const css = Array.from(document.head.querySelectorAll("style"))
      .map(tag => tag.textContent ?? "")
      .join("\n")
    expect(css).toContain(`[data-state="hidden"]{transform:translateY(calc(-100% - ${getToken("header.offset")}));}`)
    expect(css).toContain(`[data-state="hidden"]:focus-within{transform:none;}`)
  })

  it("hideOnScroll: hides on a long scroll down once stuck, reveals on scroll up", () => {
    const frames: FrameRequestCallback[] = []
    jest.spyOn(window, "requestAnimationFrame").mockImplementation(callback => {
      frames.push(callback)
      return frames.length
    })
    Object.defineProperty(document.documentElement, "scrollHeight", { configurable: true, value: 5000 })
    Object.defineProperty(document.documentElement, "clientHeight", { configurable: true, value: 800 })
    const scrollTo = (y: number) =>
      act(() => {
        ;(window as any).scrollY = y
        window.dispatchEvent(new Event("scroll"))
        frames.splice(0).forEach(frame => frame(0))
      })
    const { container } = render(
      <Header position="sticky" hideOnScroll>
        Logo
      </Header>,
    )
    setStuck(true)
    scrollTo(100)
    scrollTo(300)
    expect(header(container)).toHaveAttribute("data-state", "hidden")
    scrollTo(290)
    expect(header(container)).toHaveAttribute("data-state", "stuck")
    jest.restoreAllMocks()
  })
})
