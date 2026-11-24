import * as React from "react"
import Flow, { FlowItem } from "@niceprototypes/flow"
import Ink from "@niceprototypes/ink"
import Flex from "@niceprototypes/flex"
import Code from "@niceprototypes/code"
import DocsInk from "../../nice/Ink"
import { breakpointKeyMatches, parseBreakpointKey, useBreakpoint } from "@niceprototypes/styles"
import { StyledExampleBlocksTile, StyledExampleValue } from "./ExampleBlocks.styles"
import { variantKey } from "../../dataTables/utilities"
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

/** Visibility steps the observer reports at, so the share of each demo in view stays current while scrolling. */
const THRESHOLDS = Array.from({ length: 21 }, (_, step) => step / 20)

/**
 * The variant whose demo is in view, among the story's demos (ExampleBlocks tiles beside the
 * lines): the one across the middle of the scroll container's view, else the one showing the most
 * of itself (when two are partly in view); undefined while `enabled` is off. Two
 * IntersectionObservers on the scroll container, no scroll listener.
 */
const useVariantInView = (element: React.RefObject<HTMLElement | null>, enabled: boolean) => {
  const [inView, setInView] = React.useState<string>()
  React.useEffect(() => {
    const story = element.current?.closest("[data-docs-columns]")
    if (!enabled || !story || !element.current) return setInView(undefined)
    const tiles = [...story.querySelectorAll<HTMLElement>("[data-example-variant]")]
    const root = scrollerOf(element.current)
    const shown = new Map<string, number>()
    const centred = new Set<string>()
    const decide = () => {
      let best: string | undefined
      for (const [variant, height] of shown) if (height > 0 && (best === undefined || height > shown.get(best)!)) best = variant
      setInView([...centred][0] ?? best)
    }
    const variantOf = (entry: IntersectionObserverEntry) => (entry.target as HTMLElement).dataset.exampleVariant!
    const visibility = new IntersectionObserver(
      entries => {
        for (const entry of entries) shown.set(variantOf(entry), entry.intersectionRect.height)
        decide()
      },
      { root, threshold: THRESHOLDS },
    )
    // The view narrowed to its middle line: the demo across it is the one being looked at.
    const middle = new IntersectionObserver(
      entries => {
        for (const entry of entries) entry.isIntersecting ? centred.add(variantOf(entry)) : centred.delete(variantOf(entry))
        decide()
      },
      { root, rootMargin: "-50% 0px -50% 0px" },
    )
    tiles.forEach(tile => {
      visibility.observe(tile)
      middle.observe(tile)
    })
    return () => {
      visibility.disconnect()
      middle.disconnect()
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
 * value, the line whose demo is the one in view (across the view's middle, else showing the most
 * of itself) is outlined in `docs.activeColor`.
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
