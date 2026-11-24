import { pickVariantInView } from "./pickVariantInView"

const line = 100
const viewBottom = 900

describe("pickVariantInView", () => {
  it("picks the first tile before any tile reaches the line", () => {
    const tiles = [{ variant: "user", top: 400 }, { variant: "assistant", top: 700 }]
    expect(pickVariantInView(tiles, { line, atEnd: false, viewBottom })).toBe("user")
  })

  it("picks the last tile whose top has crossed the line, not the most visible one", () => {
    // user fully visible in the lower half, assistant taller and partly visible below it, a
    // previous tile above the line: the reading position decides, so "system" (crossed) wins
    // until "user" crosses, regardless of how much of "assistant" shows.
    const tiles = [{ variant: "system", top: -300 }, { variant: "user", top: 450 }, { variant: "assistant", top: 750 }]
    expect(pickVariantInView(tiles, { line, atEnd: false, viewBottom })).toBe("system")
    const scrolled = tiles.map(tile => ({ ...tile, top: tile.top - 400 }))
    expect(pickVariantInView(scrolled, { line, atEnd: false, viewBottom })).toBe("user")
  })

  it("treats a top exactly on the line as crossed", () => {
    const tiles = [{ variant: "a", top: 0 }, { variant: "b", top: line }]
    expect(pickVariantInView(tiles, { line, atEnd: false, viewBottom })).toBe("b")
  })

  it("at the end of the scroll container picks the last tile whose top is visible", () => {
    const tiles = [{ variant: "a", top: -200 }, { variant: "b", top: 300 }, { variant: "c", top: 700 }, { variant: "d", top: 950 }]
    expect(pickVariantInView(tiles, { line, atEnd: true, viewBottom })).toBe("c")
  })

  it("gives the same answer for the same positions whichever way the reader scrolled", () => {
    const at = (offset: number) => pickVariantInView([{ variant: "a", top: 200 - offset }, { variant: "b", top: 600 - offset }], { line, atEnd: false, viewBottom })
    const down = [0, 150, 300, 550].map(at)
    const up = [550, 300, 150, 0].map(at).reverse()
    expect(down).toEqual(up)
  })

  it("returns undefined without tiles", () => {
    expect(pickVariantInView([], { line, atEnd: false, viewBottom })).toBeUndefined()
  })
})
