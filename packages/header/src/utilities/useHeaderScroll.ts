import * as React from "react"
import type { HeaderPositionType, HeaderResetKeyType, HeaderRootType, HeaderStateType, HeaderStopAtType } from "../components/Header/Header.types"
import { HEADER_PAUSE_QUIET } from "../constants"
import { elementOf } from "./elementOf"
import { getHeaderState } from "./getHeaderState"
import { getStopPush } from "./getStopPush"
import { maxScrollOf } from "./maxScrollOf"
import { nextKeyboardOpen } from "./nextKeyboardOpen"
import { scrollTopOf } from "./scrollTopOf"
import { setHeaderRootMetrics } from "./setHeaderRootMetrics"
import { initialHeadroom, stepHeadroom } from "./stepHeadroom"

/** Transitions that change the header's size: the height variable waits for their end. */
const SIZING = new Set(["font-size", "padding-top"])

type UseHeaderScrollInput = {
  headerRef: React.RefObject<HTMLElement | null>
  sentinelRef: React.RefObject<HTMLDivElement | null>
  placeholderRef: React.RefObject<HTMLDivElement | null>
  /** "sticky" or "fixed"; "static" observes nothing */
  mode: HeaderPositionType
  /** Fixed in the window, with the placeholder */
  outOfFlow: boolean
  root?: HeaderRootType
  /** The offset prop (a CSS length), to re-measure when it changes */
  offset: string
  threshold: number
  stopAt?: HeaderStopAtType
  hideOnScroll: boolean
  tolerance: { up: number; down: number }
  forced?: HeaderStateType
  onStateChange?: (state: HeaderStateType) => void
  resetKey?: HeaderResetKeyType
}

type UseHeaderScrollResult = {
  state: HeaderStateType
  /** It just stuck from static: play the slide-in */
  enter: boolean
  /** After the first layout: fixed may leave the flow */
  mounted: boolean
  /** The on-screen keyboard is open */
  keyboard: boolean
  /** The header is pinned at the root's top edge (offset 0, and stuck, hidden, released, or fixed there): it pads the top safe-area inset */
  atTop: boolean
}

/**
 * The header's scroll state and the measurements that keep its height accounted for.
 *
 * - Stuck: an IntersectionObserver on the sentinel at the stick point. Released by the end of a sticky
 *   header's containing block: a second observer on the parent (untransformed by hide/reveal), whose
 *   bottom passing above the header's stuck bottom pushes it out. No scroll listener.
 * - Hidden and released by `stopAt`: one passive scroll listener, batched to one update per frame,
 *   attached only with `hideOnScroll` or `stopAt`; each frame reads, then writes only changed values.
 *   In-page links, hashchanges and focus pause it until `scrollend` (or a quiet period); the open
 *   on-screen keyboard (visual viewport, with hysteresis) pauses it and shows the header.
 * - Height: a ResizeObserver keeps the placeholder (fixed) or the flow margin (sticky) at the default
 *   state's height, and records the height and inset on the root (`setHeaderRootMetrics`). While a
 *   font-size or padding transition runs, the root variables wait for its end, so the document is not
 *   restyled every frame.
 */
export const useHeaderScroll = ({
  headerRef,
  sentinelRef,
  placeholderRef,
  mode,
  outOfFlow,
  root,
  offset,
  threshold,
  stopAt,
  hideOnScroll,
  tolerance,
  forced,
  onStateChange,
  resetKey,
}: UseHeaderScrollInput): UseHeaderScrollResult => {
  // Read after mount: a passive effect runs once every ref is attached. null is the window.
  const [rootElement, setRootElement] = React.useState<HTMLElement | null>(null)
  React.useEffect(() => setRootElement(elementOf(root)), [root])

  const active = mode !== "static"
  const [mounted, setMounted] = React.useState(false)
  React.useLayoutEffect(() => setMounted(true), [])

  const [stuck, setStuck] = React.useState(false)
  const [hidden, setHidden] = React.useState(false)
  const [pushed, setPushed] = React.useState(false)
  const [ended, setEnded] = React.useState(false)
  const [keyboard, setKeyboard] = React.useState(false)
  const [geometry, setGeometry] = React.useState({ offset: 0, height: 0 })
  const stuckRef = React.useRef(false)
  const stuckAtRef = React.useRef(0)
  const keyboardRef = React.useRef(false)
  const pausedRef = React.useRef(false)
  const headroomRef = React.useRef(initialHeadroom(0))
  const offsetRef = React.useRef(0)
  offsetRef.current = geometry.offset

  // The offset in pixels: the sentinel sits at threshold minus offset (CSS resolves it, no layout read).
  React.useLayoutEffect(() => {
    const sentinel = sentinelRef.current
    if (!active || !sentinel) return
    const measure = () => {
      const next = threshold - (parseFloat(getComputedStyle(sentinel).top) || 0)
      setGeometry(previous => (previous.offset === next ? previous : { ...previous, offset: next }))
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [active, rootElement, threshold, offset, sentinelRef])

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

  // Sticky: the containing block (the parent) ends above the stuck header's bottom edge, so it pushes
  // the header out. The parent is not moved by hide/reveal, so their transforms never read as an end.
  React.useEffect(() => {
    const parent = headerRef.current?.parentElement
    if (!active || outOfFlow || !parent || parent === rootElement || geometry.height === 0) {
      setEnded(false)
      return
    }
    const line = geometry.offset + geometry.height
    const observer = new IntersectionObserver(
      ([entry]) => {
        const rootTop = entry.rootBounds?.top ?? 0
        setEnded(!entry.isIntersecting && entry.boundingClientRect.bottom <= rootTop + line)
      },
      { root: rootElement ?? document, rootMargin: `${-line}px 0px 0px 0px`, threshold: [0] },
    )
    observer.observe(parent)
    return () => observer.disconnect()
  }, [active, outOfFlow, rootElement, geometry.offset, geometry.height, headerRef])

  // The on-screen keyboard: the visual viewport shorter than the layout viewport, with hysteresis.
  React.useEffect(() => {
    const viewport = window.visualViewport
    if (!active || !viewport || (!hideOnScroll && !outOfFlow)) return
    const update = () => {
      keyboardRef.current = nextKeyboardOpen(keyboardRef.current, window.innerHeight - viewport.height * viewport.scale)
      setKeyboard(keyboardRef.current)
      if (keyboardRef.current) setHidden(false)
    }
    viewport.addEventListener("resize", update)
    update()
    return () => viewport.removeEventListener("resize", update)
  }, [active, hideOnScroll, outOfFlow])

  // Hide on scroll down, reveal on scroll up; stopAt's push.
  const stopValue = typeof stopAt === "number" ? stopAt : undefined
  const watchesScroll = active && (hideOnScroll || stopAt !== undefined)
  React.useEffect(() => {
    const header = headerRef.current
    if (!watchesScroll || !header) return
    const target: HTMLElement | Window = rootElement ?? window
    let frame = 0
    let quiet = 0
    let push = 0
    headroomRef.current = initialHeadroom(scrollTopOf(rootElement))
    const resume = () => {
      pausedRef.current = false
    }
    const pause = () => {
      pausedRef.current = true
      window.clearTimeout(quiet)
      quiet = window.setTimeout(resume, HEADER_PAUSE_QUIET)
    }
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a[href^='#']")
      if (link) pause()
    }
    const onFocus = (event: FocusEvent) => {
      pause()
      if (header.contains(event.target as Node)) {
        headroomRef.current = { ...headroomRef.current, hidden: false }
        setHidden(false)
      }
    }
    const update = () => {
      frame = 0
      // Reads
      const y = scrollTopOf(rootElement)
      const isStuck = stuckRef.current
      const height = header.offsetHeight
      const boundary = typeof stopAt === "number" ? null : elementOf(stopAt)
      const rootTop = rootElement ? rootElement.getBoundingClientRect().top : 0
      const boundaryBottom = boundary ? boundary.getBoundingClientRect().bottom - rootTop : undefined
      if (hideOnScroll) {
        headroomRef.current = stepHeadroom(headroomRef.current, {
          y,
          maxY: maxScrollOf(rootElement),
          stuck: isStuck,
          stuckAt: stuckAtRef.current,
          height,
          tolerance,
          paused: pausedRef.current || keyboardRef.current,
        })
      }
      const nextPush = isStuck ? getStopPush({ stopAt: stopValue, boundaryBottom, y, top: offsetRef.current, height }) : 0
      // Writes
      if (nextPush !== push) {
        push = nextPush
        header.style.translate = push > 0 ? `0 ${-push}px` : ""
      }
      setHidden(headroomRef.current.hidden)
      setPushed(push > 0)
    }
    const onScroll = () => {
      if (pausedRef.current) pause()
      if (!frame) frame = requestAnimationFrame(update)
    }
    target.addEventListener("scroll", onScroll, { passive: true })
    target.addEventListener("scrollend", resume)
    window.addEventListener("hashchange", pause)
    document.addEventListener("click", onClick, true)
    document.addEventListener("focusin", onFocus, true)
    update()
    return () => {
      target.removeEventListener("scroll", onScroll)
      target.removeEventListener("scrollend", resume)
      window.removeEventListener("hashchange", pause)
      document.removeEventListener("click", onClick, true)
      document.removeEventListener("focusin", onFocus, true)
      if (frame) cancelAnimationFrame(frame)
      window.clearTimeout(quiet)
      header.style.translate = ""
      setHidden(false)
      setPushed(false)
    }
    // tolerance is compared by value
  }, [watchesScroll, rootElement, hideOnScroll, stopAt, stopValue, tolerance.up, tolerance.down, headerRef])

  // A route change: show the header and restart the run.
  const resetRef = React.useRef(resetKey)
  React.useEffect(() => {
    if (resetRef.current === resetKey) return
    resetRef.current = resetKey
    headroomRef.current = initialHeadroom(scrollTopOf(rootElement))
    setHidden(false)
  }, [resetKey, rootElement])

  const state = getHeaderState({ stuck, hidden, push: pushed ? 1 : 0, ended, forced })
  const stateRef = React.useRef(state)
  stateRef.current = state

  // Height accounting, before paint.
  React.useLayoutEffect(() => {
    const header = headerRef.current
    if (!active || !header) return
    const rootNode = rootElement ?? document.documentElement
    const id = Symbol("header")
    let base = 0
    let sizing = 0
    const measure = () => {
      const height = header.offsetHeight
      if (stateRef.current === "static" || base === 0) base = height
      setGeometry(previous => (previous.height === height ? previous : { ...previous, height }))
      if (outOfFlow && placeholderRef.current) placeholderRef.current.style.minHeight = `${base}px`
      if (!outOfFlow) header.style.marginBlockEnd = base !== height ? `${base - height}px` : ""
      if (sizing === 0) setHeaderRootMetrics(rootNode, id, { height, inset: height + offsetRef.current })
    }
    const onRun = (event: TransitionEvent) => {
      if (event.target === header && SIZING.has(event.propertyName)) sizing++
    }
    const onEnd = (event: TransitionEvent) => {
      if (event.target !== header || !SIZING.has(event.propertyName)) return
      sizing = Math.max(0, sizing - 1)
      if (sizing === 0) measure()
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(header)
    header.addEventListener("transitionrun", onRun)
    header.addEventListener("transitionend", onEnd)
    header.addEventListener("transitioncancel", onEnd)
    return () => {
      observer.disconnect()
      header.removeEventListener("transitionrun", onRun)
      header.removeEventListener("transitionend", onEnd)
      header.removeEventListener("transitioncancel", onEnd)
      setHeaderRootMetrics(rootNode, id, null)
      header.style.marginBlockEnd = ""
      if (placeholderRef.current) placeholderRef.current.style.minHeight = ""
    }
  }, [active, outOfFlow, rootElement, geometry.offset, headerRef, placeholderRef])

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

  const atTop = geometry.offset === 0 && (state !== "static" || (outOfFlow && mounted && threshold === 0 && !keyboard))

  return { state, enter: tracked.enter, mounted, keyboard, atTop }
}
