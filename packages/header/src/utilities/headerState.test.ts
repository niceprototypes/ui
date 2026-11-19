import { getHeaderState } from "./getHeaderState"
import { getStopPush } from "./getStopPush"
import { normalizeTolerance } from "./normalizeTolerance"
import { initialHeadroom, stepHeadroom, type HeadroomInputType, type HeadroomStateType } from "./stepHeadroom"

const BASE: Omit<HeadroomInputType, "y"> = { maxY: 2000, stuck: true, stuckAt: 0, height: 60, tolerance: { up: 8, down: 24 } }

/** Run the headroom over scroll positions, from `start`. */
const run = (positions: number[], input: Partial<HeadroomInputType> = {}, start = 0): HeadroomStateType =>
  positions.reduce((state, y) => stepHeadroom(state, { ...BASE, ...input, y }), initialHeadroom(start))

describe("stepHeadroom", () => {
  it("hides after a downward run longer than the down tolerance, once past the header's height", () => {
    expect(run([120], {}, 100).hidden).toBe(false) // a 20px run: within tolerance
    expect(run([130], {}, 100).hidden).toBe(true) // a 30px run > 24
  })

  it("never hides within the header's height of where it stuck", () => {
    expect(run([50]).hidden).toBe(false) // y - stuckAt = 50 ≤ 60
    expect(run([300, 340], { stuckAt: 290 }).hidden).toBe(false)
    expect(run([300, 400], { stuckAt: 290 }).hidden).toBe(true)
  })

  it("reveals after an upward run longer than the up tolerance", () => {
    const hidden = run([200, 400])
    expect(hidden.hidden).toBe(true)
    expect(stepHeadroom(hidden, { ...BASE, y: 395 }).hidden).toBe(true) // 5 ≤ 8
    expect(stepHeadroom(stepHeadroom(hidden, { ...BASE, y: 395 }), { ...BASE, y: 390 }).hidden).toBe(false) // run 10 > 8
  })

  it("restarts the run when the direction flips, so alternating jitter never toggles it", () => {
    const jitter = [200, 220, 205, 225, 210, 230, 215]
    expect(run(jitter, {}, 190).hidden).toBe(false)
  })

  it("accumulates travel across frames of a long scroll", () => {
    expect(run([200, 205, 210, 215, 220, 225, 230], {}, 200).hidden).toBe(true) // 30 > 24 in 5px frames
  })

  it("ignores overscroll: the rubber-band at the top and the bounce at the bottom never reveal or hide", () => {
    const hidden = run([200, 2000])
    expect(hidden.hidden).toBe(true)
    // Bottom bounce: past maxY then back to maxY.
    const bounced = [2040, 2080, 2030, 2000].reduce((state, y) => stepHeadroom(state, { ...BASE, y }), hidden)
    expect(bounced.hidden).toBe(true)
    expect(bounced.lastY).toBe(2000)
    // Top rubber-band: negative positions are skipped entirely.
    const top = [-30, -60, -10].reduce((state, y) => stepHeadroom(state, { ...BASE, y }), initialHeadroom(0))
    expect(top).toEqual(initialHeadroom(0))
  })

  it("shows the header whenever it is not stuck", () => {
    const hidden = run([200, 400])
    expect(stepHeadroom(hidden, { ...BASE, y: 450, stuck: false }).hidden).toBe(false)
  })

  it("returns the same memory when the position did not change", () => {
    const state = run([200])
    expect(stepHeadroom(state, { ...BASE, y: 200 })).toBe(state)
  })
})

describe("getStopPush", () => {
  it("a scroll distance: pushes one-to-one past it", () => {
    expect(getStopPush({ stopAt: 500, y: 400, top: 0, height: 60 })).toBe(0)
    expect(getStopPush({ stopAt: 500, y: 500, top: 0, height: 60 })).toBe(0)
    expect(getStopPush({ stopAt: 500, y: 540, top: 0, height: 60 })).toBe(40)
  })

  it("an element: its bottom edge pushes the header's bottom edge, offset included", () => {
    expect(getStopPush({ boundaryBottom: 300, y: 0, top: 0, height: 60 })).toBe(0)
    expect(getStopPush({ boundaryBottom: 60, y: 0, top: 0, height: 60 })).toBe(0)
    expect(getStopPush({ boundaryBottom: 50, y: 0, top: 0, height: 60 })).toBe(10)
    expect(getStopPush({ boundaryBottom: 50, y: 0, top: 8, height: 60 })).toBe(18)
    expect(getStopPush({ boundaryBottom: -100, y: 0, top: 0, height: 60 })).toBe(160)
  })

  it("no stop: never pushes", () => {
    expect(getStopPush({ y: 10000, top: 0, height: 60 })).toBe(0)
  })
})

describe("getHeaderState", () => {
  it("static unless stuck", () => {
    expect(getHeaderState({ stuck: false, hidden: true, push: 10 })).toBe("static")
  })
  it("stuck, hidden over released, released over stuck", () => {
    expect(getHeaderState({ stuck: true, hidden: false, push: 0 })).toBe("stuck")
    expect(getHeaderState({ stuck: true, hidden: true, push: 10 })).toBe("hidden")
    expect(getHeaderState({ stuck: true, hidden: false, push: 10 })).toBe("released")
  })
  it("a forced state wins", () => {
    expect(getHeaderState({ stuck: false, hidden: false, push: 0, forced: "hidden" })).toBe("hidden")
  })
})

describe("normalizeTolerance", () => {
  it("a number sets both directions", () => {
    expect(normalizeTolerance(12)).toEqual({ up: 12, down: 12 })
    expect(normalizeTolerance({ up: 4, down: 30 })).toEqual({ up: 4, down: 30 })
  })
})
