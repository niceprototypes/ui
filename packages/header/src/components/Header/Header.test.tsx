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

/** The latest observer on the sentinel (the others watch the header for the containing block's end). */
const sentinelObserver = () => [...observers].reverse().find(record => record.targets[0]?.tagName !== "HEADER")!

/** Fire the sentinel's observer: the sentinel is above the root's top (stuck) or not. */
const setStuck = (stuck: boolean) =>
  act(() => {
    const record = sentinelObserver()
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

  it("sticky: CSS sticky at the offset token and the z-index token; no top inset while resting", () => {
    const { container } = render(<Header position="sticky">Logo</Header>)
    const css = cssFor(header(container))
    expect(css).toContain("position:sticky")
    expect(css).toContain(`top:${getToken("header.offset")}`)
    expect(css).not.toContain(`padding-top:${getToken("header.safeArea.top")}`) // resting: no top inset
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
    expect(sentinelObserver().targets[0]).toBe(sentinel)
    expect(sentinelObserver().options?.root).toBe(document)
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

  it("height: the root gets the height and inset variables and opts into the overridable scroll-padding rule; removed on unmount", () => {
    const heightKey = getToken("header.height", { as: "key" })
    const insetKey = getToken("header.inset", { as: "key" })
    const { unmount } = render(<Header position="sticky">Logo</Header>)
    const html = document.documentElement
    expect(html.style.getPropertyValue(heightKey)).toBe("0px") // jsdom measures 0
    expect(html.style.getPropertyValue(insetKey)).toBe("0px")
    expect(html).toHaveAttribute("data-np-header-root")
    expect(html.style.scrollPaddingTop).toBe("") // never inline: the :where() rule applies it (asserted in the Playground story)
    unmount()
    expect(html.style.getPropertyValue(heightKey)).toBe("")
    expect(html).not.toHaveAttribute("data-np-header-root")
  })

  it("two positioned headers on one root: the variables stay until the last one unmounts", () => {
    const heightKey = getToken("header.height", { as: "key" })
    const first = render(<Header position="sticky">One</Header>)
    const second = render(<Header position="fixed">Two</Header>)
    first.unmount()
    expect(document.documentElement.style.getPropertyValue(heightKey)).toBe("0px")
    second.unmount()
    expect(document.documentElement.style.getPropertyValue(heightKey)).toBe("")
  })

  it("safe area: fixed pads its physical sides; sticky pads no sides; no top inset while static mid-page", () => {
    const rect = jest.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ top: 500, bottom: 500 } as DOMRect)
    const fixed = render(<Header position="fixed">Logo</Header>)
    const fixedCss = cssFor(header(fixed.container))
    expect(fixedCss).toContain(`padding-left:${getToken("header.safeArea.left")}`)
    expect(fixedCss).toContain(`padding-right:${getToken("header.safeArea.right")}`)
    expect(fixedCss).not.toContain("padding-inline")
    fixed.unmount()
    const sticky = render(<Header position="sticky">Logo</Header>)
    expect(cssFor(header(sticky.container))).not.toContain("padding-left")
    expect(cssFor(header(sticky.container))).not.toContain(`padding-top:${getToken("header.safeArea.top")}`)
    // Stuck at the top (offset 0): the top inset applies.
    setStuck(true)
    expect(cssFor(header(sticky.container))).toContain(`padding-top:${getToken("header.safeArea.top")}`)
    rect.mockRestore()
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

  it("reduced motion turns transitions and the slide-in off, over the reset's global rule", () => {
    render(<Header>Logo</Header>)
    const css = Array.from(document.head.querySelectorAll("style"))
      .map(tag => tag.textContent ?? "")
      .join("\n")
    expect(css).toMatch(/prefers-reduced-motion:\s*reduce\)\{[^}]*\{transition-duration:0s!important;animation:none!important;\}/)
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
