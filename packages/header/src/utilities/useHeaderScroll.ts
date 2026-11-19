import * as React from "react"
import { getToken } from "@niceprototypes/styles"
import type { HeaderPositionType, HeaderRootType, HeaderStateType, HeaderStopAtType } from "../components/Header/Header.types"
import { elementOf } from "./elementOf"
import { getHeaderState } from "./getHeaderState"
import { getStopPush } from "./getStopPush"
import { maxScrollOf } from "./maxScrollOf"
import { scrollTopOf } from "./scrollTopOf"
import { initialHeadroom, stepHeadroom } from "./stepHeadroom"

/** The height variable's name, written on the root at runtime (default from the `header.height` token). */
const HEIGHT_KEY = getToken("header.height", { as: "key" })

type UseHeaderScrollInput = {
  headerRef: React.RefObject<HTMLElement | null>
  sentinelRef: React.RefObject<HTMLDivElement | null>
  placeholderRef: React.RefObject<HTMLDivElement | null>
  /** "sticky" or "fixed" with a placeholder; "static" observes nothing */
  mode: HeaderPositionType
  /** Whether the header is out of the flow (fixed in the window) and needs the placeholder */
  outOfFlow: boolean
  root?: HeaderRootType
  offset: string
  stopAt?: HeaderStopAtType
  hideOnScroll: boolean
  tolerance: { up: number; down: number }
  forced?: HeaderStateType
  onStateChange?: (state: HeaderStateType) => void
}

/**
 * The header's scroll state and the measurements that keep its height accounted for.
 *
 * - Stuck: an IntersectionObserver on the sentinel (no scroll listener).
 * - Hidden and released: one passive scroll listener, batched to one update per animation frame,
 *   attached only with `hideOnScroll` or `stopAt`. Each frame reads geometry first, then writes
 *   (the push as the `translate` property) only when the value changed.
 * - Height: a ResizeObserver writes the measured height to the root's `--np--header--height`, the
 *   default-state height to the placeholder's min-height (fixed) or the margin that keeps the flow
 *   height constant (sticky), and the root's `scroll-padding-top`, all before paint, without re-rendering.
 *
 * @returns The state, and whether the header just stuck from static (for the slide-in)
 */
export const useHeaderScroll = ({
  headerRef,
  sentinelRef,
  placeholderRef,
  mode,
  outOfFlow,
  root,
  offset,
  stopAt,
  hideOnScroll,
  tolerance,
  forced,
  onStateChange,
}: UseHeaderScrollInput): { state: HeaderStateType; enter: boolean } => {
  // Read after mount: a passive effect runs once every ref is attached. null is the window.
  const [rootElement, setRootElement] = React.useState<HTMLElement | null>(null)
  React.useEffect(() => setRootElement(elementOf(root)), [root])

  const [stuck, setStuck] = React.useState(false)
  const [hidden, setHidden] = React.useState(false)
  const [pushed, setPushed] = React.useState(false)
  const stuckRef = React.useRef(false)
  const stuckAtRef = React.useRef(0)

  const active = mode !== "static"

  // Stuck while the sentinel is above the root's top. Overscroll at the top moves it further down,
  // so a rubber-band never reads as stuck.
  React.useEffect(() => {
    const sentinel = sentinelRef.current
    if (!active || !sentinel) {
      stuckRef.current = false
      setStuck(false)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        const rootTop = entry.rootBounds?.top ?? 0
        const isStuck = !entry.isIntersecting && entry.boundingClientRect.top < rootTop
        if (isStuck && !stuckRef.current) stuckAtRef.current = scrollTopOf(rootElement) + entry.boundingClientRect.top - rootTop
        stuckRef.current = isStuck
        setStuck(isStuck)
      },
      { root: rootElement ?? document, threshold: [0] },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [active, rootElement, sentinelRef])

  // Hide on scroll down, reveal on scroll up; stopAt's push.
  const stopValue = typeof stopAt === "number" ? stopAt : undefined
  const watchesScroll = active && (hideOnScroll || stopAt !== undefined)
  React.useEffect(() => {
    const header = headerRef.current
    if (!watchesScroll || !header) return
    const target: HTMLElement | Window = rootElement ?? window
    let frame = 0
    let headroom = initialHeadroom(scrollTopOf(rootElement))
    let push = 0
    const update = () => {
      frame = 0
      // Reads
      const y = scrollTopOf(rootElement)
      const isStuck = stuckRef.current
      const height = header.offsetHeight
      const boundary = typeof stopAt === "number" ? null : elementOf(stopAt)
      const rootTop = rootElement ? rootElement.getBoundingClientRect().top : 0
      const boundaryBottom = boundary ? boundary.getBoundingClientRect().bottom - rootTop : undefined
      const top = isStuck ? parseFloat(getComputedStyle(header).top) || 0 : 0
      if (hideOnScroll) {
        headroom = stepHeadroom(headroom, {
          y,
          maxY: maxScrollOf(rootElement),
          stuck: isStuck,
          stuckAt: stuckAtRef.current,
          height,
          tolerance,
        })
      }
      const nextPush = isStuck ? getStopPush({ stopAt: stopValue, boundaryBottom, y, top, height }) : 0
      // Writes
      if (nextPush !== push) {
        push = nextPush
        header.style.translate = push > 0 ? `0 ${-push}px` : ""
      }
      setHidden(headroom.hidden)
      setPushed(push > 0)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    target.addEventListener("scroll", onScroll, { passive: true })
    update()
    return () => {
      target.removeEventListener("scroll", onScroll)
      if (frame) cancelAnimationFrame(frame)
      header.style.translate = ""
      setHidden(false)
      setPushed(false)
    }
    // tolerance is compared by value
  }, [watchesScroll, rootElement, hideOnScroll, stopAt, stopValue, tolerance.up, tolerance.down, headerRef])

  const state = getHeaderState({ stuck, hidden, push: pushed ? 1 : 0, forced })
  const stateRef = React.useRef(state)
  stateRef.current = state

  // Height accounting, before paint.
  React.useLayoutEffect(() => {
    const header = headerRef.current
    if (!active || !header) return
    const rootStyle = (rootElement ?? document.documentElement).style
    const previousPadding = rootStyle.scrollPaddingTop
    rootStyle.scrollPaddingTop = `calc(${getToken("header.height")} + ${offset})`
    let base = 0
    const measure = () => {
      const height = header.offsetHeight
      if (stateRef.current === "static" || base === 0) base = height
      rootStyle.setProperty(HEIGHT_KEY, `${height}px`)
      if (outOfFlow && placeholderRef.current) placeholderRef.current.style.minHeight = `${base}px`
      if (!outOfFlow) header.style.marginBlockEnd = base > height ? `${base - height}px` : ""
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(header)
    return () => {
      observer.disconnect()
      rootStyle.removeProperty(HEIGHT_KEY)
      rootStyle.scrollPaddingTop = previousPadding
      header.style.marginBlockEnd = ""
      if (placeholderRef.current) placeholderRef.current.style.minHeight = ""
    }
  }, [active, outOfFlow, rootElement, offset, headerRef, placeholderRef])

  // The slide-in plays when the header sticks from static (derived during render, StrictMode-safe).
  const [tracked, setTracked] = React.useState({ state, enter: false })
  if (tracked.state !== state) setTracked({ state, enter: tracked.state === "static" && state === "stuck" })

  const onStateChangeRef = React.useRef(onStateChange)
  onStateChangeRef.current = onStateChange
  const reportedRef = React.useRef(state)
  React.useEffect(() => {
    if (reportedRef.current === state) return
    reportedRef.current = state
    onStateChangeRef.current?.(state)
  }, [state])

  return { state, enter: tracked.enter }
}
