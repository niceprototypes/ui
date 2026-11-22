import { getSpiedId } from "./getSpiedId"

/** A section element whose top sits at `top` px in the viewport. */
const section = (id: string, top: number) => {
  const element = document.createElement("h2")
  element.id = id
  element.getBoundingClientRect = () => ({ top, bottom: top + 20, left: 0, right: 0, width: 0, height: 20, x: 0, y: top, toJSON: () => ({}) })
  return element
}

/** A scrolling region (the docs site scrolls in App's region, not the document) holding the sections. */
const region = (scrollTop: number, clientHeight: number, scrollHeight: number) => {
  const element = document.createElement("div")
  element.style.overflowY = "auto"
  Object.defineProperties(element, {
    scrollTop: { value: scrollTop, configurable: true },
    clientHeight: { value: clientHeight, configurable: true },
    scrollHeight: { value: scrollHeight, configurable: true },
  })
  return element
}

describe("getSpiedId", () => {
  afterEach(() => document.body.replaceChildren())

  it("takes the last section whose top passed the spy line", () => {
    const scroller = region(100, 800, 3000)
    scroller.append(section("a", -400), section("b", 100), section("c", 600))
    document.body.append(scroller)
    window.innerHeight = 800
    expect(getSpiedId(["a", "b", "c"])).toBe("b")
  })

  it("takes the last section once its scrolling region is at its end, however short the section", () => {
    const scroller = region(2200, 800, 3000)
    scroller.append(section("a", -900), section("b", 300), section("principles", 700))
    document.body.append(scroller)
    window.innerHeight = 800
    expect(getSpiedId(["a", "b", "principles"])).toBe("principles")
  })
})
