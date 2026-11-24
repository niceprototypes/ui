import * as React from "react"
import Flow, { FlowItem } from "@niceprototypes/flow"
import Ink from "@niceprototypes/ink"
import Flex from "@niceprototypes/flex"
import Code from "@niceprototypes/code"
import DocsInk from "../../nice/Ink"
import { breakpointKeyMatches, parseBreakpointKey, useBreakpoint } from "@niceprototypes/styles"
import { StyledExampleBlocksTile, StyledExampleValue } from "./ExampleBlocks.styles"
import { variantKey } from "../../dataTables/utilities"
import { pickVariantInView } from "../../utilities/pickVariantInView"
import type { ComponentExample } from "../../dataTables/components/demos/Components/Components.types"

/**
 * ExampleBlocks
 *
 * A facet's live examples, one per variant, in a Flow column: one full-width Code block each,
 * the live demo above its code, bleeding to the page's edges on phone. With `labels` (the
 * default) each block has an h4 naming its variant as an inline chip ("default" beside the default
 * one); without, the blocks stand alone and the variants are named beside them (ExampleValues).
 */
const ExampleBlocks = ({ example, labels = true }: { example: ComponentExample; labels?: boolean }) => {
  const defaultVariant = example.default ?? "base"
  return (
    <Flow>
      {example.variants.map(item => {
        const variant = variantKey(item)
        return (
          <React.Fragment key={variant}>
            {labels ? (
              <DocsInk as="h4">
                <Code code={variant} inlined margin="none" />
                {variant === defaultVariant ? <Ink size="small" color="lighter">{" default"}</Ink> : null}
              </DocsInk>
            ) : null}
            <FlowItem bleed>
              <StyledExampleBlocksTile data-example-variant={variant}>
                <Code code={example.code(item)} language="tsx">
                  {example.preview(item)}
                </Code>
              </StyledExampleBlocksTile>
            </FlowItem>
          </React.Fragment>
        )
      })}
    </Flow>
  )
}

/** Source around a value line, so it highlights as a JSX attribute (and its comment) inside a tag. */
const JSX_ATTRIBUTE = { before: "<X ", after: "\n/>" }

/** A variant as a JSX attribute value: a boolean, number or null as an expression, else a string. */
const attributeValue = (variant: string) => (/^(true|false|null|-?\d+(\.\d+)?)$/.test(variant) ? `{${variant}}` : `"${variant}"`)

/** The element a story scrolls in: its nearest ancestor that scrolls (an app's region), else the viewport. */
const scrollerOf = (element: HTMLElement): HTMLElement | null => {
  for (let parent = element.parentElement; parent; parent = parent.parentElement) {
    const overflow = getComputedStyle(parent).overflowY
    if ((overflow === "auto" || overflow === "scroll") && parent.scrollHeight > parent.clientHeight) return parent
  }
  return null
}

/** The top offset the value lines pin at (their sticky column's `top`, `contents.top`), in pixels; 0 if not pinned. */
const stickyTopOf = (element: HTMLElement): number => {
  for (let node: HTMLElement | null = element; node; node = node.parentElement) {
    const style = getComputedStyle(node)
    if (style.position === "sticky") return parseFloat(style.top) || 0
  }
  return 0
}

/**
 * The variant whose demo is at the reading position, among the story's demos (ExampleBlocks tiles
 * beside the lines): the activation line is where the lines pin (`contents.top` below the scroll
 * container's top), and pickVariantInView decides from the tiles' tops. Measured before paint and
 * on every scroll frame and resize; undefined while `enabled` is off.
 */
const useVariantInView = (element: React.RefObject<HTMLElement | null>, enabled: boolean) => {
  const [inView, setInView] = React.useState<string>()
  React.useLayoutEffect(() => {
    const lines = element.current
    const story = lines?.closest("[data-docs-columns]")
    if (!enabled || !story || !lines) return setInView(undefined)
    const tiles = [...story.querySelectorAll<HTMLElement>("[data-example-variant]")]
    const scroller = scrollerOf(lines)
    const target: HTMLElement | Window = scroller ?? window
    const measure = () => {
      const view = scroller ? scroller.getBoundingClientRect() : { top: 0, bottom: window.innerHeight }
      const page = scroller ?? document.scrollingElement ?? document.documentElement
      setInView(
        pickVariantInView(
          tiles.map(tile => ({ variant: tile.dataset.exampleVariant!, top: tile.getBoundingClientRect().top })),
          {
            line: view.top + stickyTopOf(lines),
            atEnd: page.scrollTop > 0 && page.scrollTop + page.clientHeight >= page.scrollHeight - 1,
            viewBottom: view.bottom,
          },
        ),
      )
    }
    let frame = 0
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }
    measure()
    target.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      cancelAnimationFrame(frame)
      target.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [element, enabled])
  return inView
}

/** From laptop up the values stand beside the demos; stacked below, each demo follows its story and no line is outlined. */
const SIDE_BY_SIDE = parseBreakpointKey("laptop+")

/**
 * ExampleValues
 *
 * A facet's variants as inline code, sized to its text, one per line in its demos' order, the
 * smallest gap apart: `name="value"`, and `// default` (a comment) after the default one. Display
 * only: no copy button, no copy on click. Beside its demos (laptop and up) with more than one
 * value, the line whose demo is at the reading position (pickVariantInView) is outlined in
 * `docs.activeColor`.
 */
export const ExampleValues = ({ name, example }: { name: string; example: ComponentExample }) => {
  const defaultVariant = example.default ?? "base"
  const lines = React.useRef<HTMLDivElement>(null)
  const sideBySide = breakpointKeyMatches(SIDE_BY_SIDE, useBreakpoint())
  const inView = useVariantInView(lines, sideBySide && example.variants.length > 1)
  return (
    <div ref={lines}>
      <Flex direction="column" alignItems="flex-start" gap="smaller">
        {example.variants.map(item => {
          const variant = variantKey(item)
          return (
            <StyledExampleValue key={variant} $active={inView === variant}>
              <Code
                language="tsx"
                code={`${name}=${attributeValue(variant)}${variant === defaultVariant ? " // default" : ""}`}
                inlined
                fit
                // Highlighted as an attribute in a tag, as in the code panels; only the attribute shows.
                highlightContext={JSX_ATTRIBUTE}
                margin="none"
                showLabel={false}
                copyOnClick={false}
              />
            </StyledExampleValue>
          )
        })}
      </Flex>
    </div>
  )
}

export default ExampleBlocks
