import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, fn, waitFor, within } from "storybook/test"
import { getToken as getNiceToken, setTokens } from "@niceprototypes/styles"
import type {
  AnimationDurationType,
  AnimationEasingType,
  BackgroundColorType,
  BorderColorType,
  BoxShadowType,
  ColorType,
  FontSizeType,
} from "@niceprototypes/styles"
import Header from "@niceprototypes/header"
import type { HeaderAppearanceType, HeaderPositionType, HeaderProps, HeaderStateType } from "@niceprototypes/header"
import Flex from "@niceprototypes/flex"
import Ink from "@niceprototypes/ink"
import Logo from "@niceprototypes/logo"
import LifecycleStory from "@niceprototypes/docs/components/LifecycleStory"

/** The scroll-container box and the lifecycle box. */
const getToken = setTokens({ boxHeight: { base: "60vh" }, lifecycleHeight: { base: "240px" } }, "headerStory")

const POSITION_OPTIONS = ["static", "sticky", "fixed"] as const satisfies readonly HeaderPositionType[]
const STATE_OPTIONS = ["unset", "static", "stuck", "hidden", "released"] as const satisfies readonly (HeaderStateType | "unset")[]
const BACKGROUND_OPTIONS = ["unset", "base", "raised", "sunken", "overlay", "success", "highlight", "warning", "error", "link"] as const satisfies readonly (
  | BackgroundColorType
  | "unset"
)[]
const COLOR_OPTIONS = ["unset", "base", "light", "lighter", "lightest", "disabled", "link", "success", "highlight", "warning", "error"] as const satisfies readonly (
  | ColorType
  | "unset"
)[]
const BORDER_OPTIONS = ["unset", "none", "base", "subtle", "strong", "stronger", "success", "highlight", "warning", "error", "link"] as const satisfies readonly (
  | BorderColorType
  | "none"
  | "unset"
)[]
const SHADOW_OPTIONS = ["unset", "none", "base", "large", "sunken", "raised", "overlay"] as const satisfies readonly (BoxShadowType | "none" | "unset")[]
const FONT_SIZE_OPTIONS = ["unset", "smaller", "small", "base", "large", "larger"] as const satisfies readonly (FontSizeType | "unset")[]
const DURATION_OPTIONS = ["unset", "faster", "fast", "base", "slow", "slower"] as const satisfies readonly (AnimationDurationType | "unset")[]
const EASING_OPTIONS = ["unset", "base", "linear", "ease-in", "ease-out", "ease"] as const satisfies readonly (AnimationEasingType | "unset")[]

/**
 * The space Storybook's fixed navigation bar reserves above the story (`#storybook-root`'s top padding,
 * from storybook-navigation), so the window-scrolling stories stick below the bar. 0px where it is absent.
 */
const barOffset = () => getComputedStyle(document.getElementById("storybook-root") ?? document.body).paddingTop

/** `barOffset`, kept current: the bar's style can apply after the story mounts, and its padding resizes the root's border box. */
const useBarOffset = () => {
  const [offset, setOffset] = React.useState<string>()
  React.useLayoutEffect(() => {
    const root = document.getElementById("storybook-root")
    setOffset(barOffset())
    if (!root) return
    const observer = new ResizeObserver(() => setOffset(barOffset()))
    observer.observe(root, { box: "border-box" })
    return () => observer.disconnect()
  }, [])
  return offset
}

/** "unset" in a select leaves the prop undefined. */
const unset = <T extends string>(value: T | "unset" | undefined): T | undefined => (value === "unset" ? undefined : value)

/** The Playground's flat args: nested and element props become scalars, recomposed in render. */
type HeaderStoryArgs = Pick<HeaderProps, "position" | "offset" | "threshold" | "hideOnScroll" | "onStateChange"> & {
  /** stopAt as a scroll distance; 0 leaves it unset */
  stopAt: number
  toleranceUp: number
  toleranceDown: number
  /** Render inside a scroll container passed as `root` */
  inScrollContainer: boolean
  state: (typeof STATE_OPTIONS)[number]
  transitionDuration: (typeof DURATION_OPTIONS)[number]
  transitionEasing: (typeof EASING_OPTIONS)[number]
  defaultBackgroundColor: (typeof BACKGROUND_OPTIONS)[number]
  defaultColor: (typeof COLOR_OPTIONS)[number]
  defaultBorderColor: (typeof BORDER_OPTIONS)[number]
  defaultBoxShadow: (typeof SHADOW_OPTIONS)[number]
  defaultFontSize: (typeof FONT_SIZE_OPTIONS)[number]
  stuckBackgroundColor: (typeof BACKGROUND_OPTIONS)[number]
  stuckColor: (typeof COLOR_OPTIONS)[number]
  stuckBorderColor: (typeof BORDER_OPTIONS)[number]
  stuckBoxShadow: (typeof SHADOW_OPTIONS)[number]
  stuckFontSize: (typeof FONT_SIZE_OPTIONS)[number]
}

const appearanceOf = (args: HeaderStoryArgs, state: "default" | "stuck"): HeaderAppearanceType => ({
  backgroundColor: unset(args[`${state}BackgroundColor`]),
  color: unset(args[`${state}Color`]),
  borderColor: unset(args[`${state}BorderColor`]),
  boxShadow: unset(args[`${state}BoxShadow`]),
  fontSize: unset(args[`${state}FontSize`]),
})

/** The Header props the flat args stand for. */
const propsOf = (args: HeaderStoryArgs, bar?: string): Omit<HeaderProps, "children" | "root"> => ({
  position: args.position,
  // Empty: below Storybook's navigation bar in the page; the header.offset token in a scroll container.
  offset: args.offset || (args.inScrollContainer ? undefined : bar),
  threshold: args.threshold,
  stopAt: args.stopAt > 0 ? args.stopAt : undefined,
  hideOnScroll: args.hideOnScroll,
  tolerance: { up: args.toleranceUp, down: args.toleranceDown },
  state: unset(args.state),
  transitionDuration: unset(args.transitionDuration),
  transitionEasing: unset(args.transitionEasing),
  appearance: { default: appearanceOf(args, "default"), stuck: appearanceOf(args, "stuck") },
  onStateChange: args.onStateChange,
})

const PARAGRAPH =
  "Header is the outer wrapper of a page header. Scroll this page: with a sticky or fixed position the header stays at the top, takes its stuck appearance, and with hideOnScroll slides away while you read down and comes back as soon as you scroll up."

/** Numbered sections with ids, an in-page link to one of them, and `boundary` as the sixth section's end. */
const Sections = ({ count = 12, boundary }: { count?: number; boundary?: React.Ref<HTMLDivElement> }) => (
  <Flex direction="column" gap="large" padding="base">
    <Ink>
      <a href="#section-5">Jump to section 5</a>
    </Ink>
    {Array.from({ length: count }, (_, index) => (
      <Flex key={index} direction="column" gap="small" as="section">
        <div id={`section-${index + 1}`} ref={index === 5 ? boundary : undefined}>
          <Ink size="large">{`Section ${index + 1}`}</Ink>
        </div>
        <Ink>{PARAGRAPH}</Ink>
        <Ink>{PARAGRAPH}</Ink>
      </Flex>
    ))}
  </Flex>
)

/** The header's content: only the logo, to give it height. */
const HeaderLogo = () => (
  <Flex padding="small">
    <Logo />
  </Flex>
)

/** The Playground render: the header over long content, in the page or in a scroll container. */
const Demo = (args: HeaderStoryArgs) => {
  const container = React.useRef<HTMLDivElement>(null)
  const bar = useBarOffset()
  const header = (
    <Header {...propsOf(args, bar)} root={args.inScrollContainer ? container : undefined}>
      <HeaderLogo />
    </Header>
  )
  if (!args.inScrollContainer)
    return (
      <>
        {header}
        <Sections />
      </>
    )
  return (
    <div ref={container} data-testid="container" style={{ height: getToken("headerStory.boxHeight:base"), overflowY: "auto" }}>
      {header}
      <Sections />
    </div>
  )
}

/** The computed value of a CSS property set to `value`, read from a throwaway element. */
const resolveCss = (property: string, value: string) => {
  const probe = document.createElement("div")
  probe.style.setProperty(property, value)
  document.body.append(probe)
  const resolved = getComputedStyle(probe).getPropertyValue(property)
  probe.remove()
  return resolved
}

/** A CSS length in pixels, resolved on a throwaway element. */
const resolvePx = (length: string) => Math.round(parseFloat(resolveCss("height", length)))

/** The header's resolved `top` (its offset) in whole pixels. */
const offsetOf = (header: HTMLElement) => Math.round(parseFloat(getComputedStyle(header).top))

const headerOf = (canvasElement: HTMLElement) => canvasElement.querySelector("header")!

/** Scroll the page (or `element`) to `y` and wait two frames for the observers and the scroll frame. */
const scrollTo = async (y: number, element?: HTMLElement) => {
  if (element) element.scrollTop = y
  else window.scrollTo(0, y)
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
}

const expectState = (header: HTMLElement, state: HeaderStateType) => waitFor(() => expect(header.dataset.state).toBe(state))

const DEFAULT_ARGS: HeaderStoryArgs = {
  position: "sticky",
  offset: "",
  threshold: 0,
  stopAt: 0,
  hideOnScroll: false,
  toleranceUp: 8,
  toleranceDown: 24,
  inScrollContainer: false,
  state: "unset",
  transitionDuration: "unset",
  transitionEasing: "unset",
  defaultBackgroundColor: "unset",
  defaultColor: "unset",
  defaultBorderColor: "unset",
  defaultBoxShadow: "unset",
  defaultFontSize: "unset",
  stuckBackgroundColor: "unset",
  stuckColor: "unset",
  stuckBorderColor: "unset",
  stuckBoxShadow: "unset",
  stuckFontSize: "unset",
  onStateChange: fn(),
}

const meta = {
  title: "Components/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Header>

export default meta

type Story = StoryObj<HeaderStoryArgs>

const appearanceArgTypes = (state: "default" | "stuck") => ({
  [`${state}BackgroundColor`]: { control: "select", options: BACKGROUND_OPTIONS, table: { category: `Appearance: ${state}` } },
  [`${state}Color`]: { control: "select", options: COLOR_OPTIONS, table: { category: `Appearance: ${state}` } },
  [`${state}BorderColor`]: { control: "select", options: BORDER_OPTIONS, table: { category: `Appearance: ${state}` } },
  [`${state}BoxShadow`]: { control: "select", options: SHADOW_OPTIONS, table: { category: `Appearance: ${state}` } },
  [`${state}FontSize`]: { control: "select", options: FONT_SIZE_OPTIONS, table: { category: `Appearance: ${state}` } },
})

export const Playground: Story = {
  args: DEFAULT_ARGS,
  argTypes: {
    position: { control: "select", options: POSITION_OPTIONS, table: { category: "Position" } },
    offset: {
      control: "text",
      description: "A CSS length. Empty here: below Storybook's navigation bar (the header.offset token in a scroll container).",
      table: { category: "Position" },
    },
    threshold: { control: { type: "number", min: 0 }, table: { category: "Position" } },
    stopAt: { control: { type: "number", min: 0 }, table: { category: "Position" } },
    inScrollContainer: { control: "boolean", table: { category: "Position" } },
    hideOnScroll: { control: "boolean", table: { category: "Hide on scroll" } },
    toleranceUp: { control: { type: "number", min: 0 }, table: { category: "Hide on scroll" } },
    toleranceDown: { control: { type: "number", min: 0 }, table: { category: "Hide on scroll" } },
    state: { control: "select", options: STATE_OPTIONS, table: { category: "State" } },
    onStateChange: { table: { category: "State" } },
    transitionDuration: { control: "select", options: DURATION_OPTIONS, table: { category: "Transition" } },
    transitionEasing: { control: "select", options: EASING_OPTIONS, table: { category: "Transition" } },
    ...appearanceArgTypes("default"),
    ...appearanceArgTypes("stuck"),
  },
  render: args => <Demo {...args} />,
  play: async ({ canvasElement }) => {
    await scrollTo(0)
    const header = headerOf(canvasElement)
    await expect(header.dataset.state).toBe("static")
    await expect(getComputedStyle(header).position).toBe("sticky")
    // The measured height is on the root, and anchor jumps clear it.
    const height = getComputedStyle(document.documentElement).getPropertyValue(getNiceToken("header.height", { as: "key" }))
    await expect(height).toBe(`${header.offsetHeight}px`)
    await expect(parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)).toBe(header.offsetHeight + resolvePx(barOffset()))
  },
}

/** `position="sticky"`: stuck at the top once scrolled, with the stuck appearance; static again at the top. */
export const Sticky: Story = {
  ...Playground,
  play: async ({ canvasElement, args }) => {
    const header = headerOf(canvasElement)
    await scrollTo(0)
    const staticShadow = getComputedStyle(header).boxShadow
    await scrollTo(400)
    await expectState(header, "stuck")
    await expect(Math.round(header.getBoundingClientRect().top)).toBe(offsetOf(header))
    await waitFor(() => expect(getComputedStyle(header).boxShadow).not.toBe(staticShadow))
    await expect(args.onStateChange).toHaveBeenCalledWith("stuck")
    await scrollTo(0)
    await expectState(header, "static")
  },
}

/** `position="fixed"`: pinned to the viewport; the placeholder keeps the content below it, so nothing jumps. */
export const Fixed: Story = {
  ...Playground,
  args: { ...DEFAULT_ARGS, position: "fixed" },
  play: async ({ canvasElement }) => {
    const header = headerOf(canvasElement)
    await scrollTo(0)
    const placeholder = header.parentElement!
    const content = placeholder.nextElementSibling as HTMLElement
    await expect(getComputedStyle(header).position).toBe("fixed")
    await expect(placeholder.getBoundingClientRect().height).toBe(header.offsetHeight)
    // No overlap: the content starts below the header.
    await expect(content.getBoundingClientRect().top).toBeGreaterThanOrEqual(header.getBoundingClientRect().bottom)
    await scrollTo(400)
    await expectState(header, "stuck")
    await expect(Math.round(header.getBoundingClientRect().top)).toBe(offsetOf(header))
  },
}

/** `threshold`: the header scrolls away with the content, then slides back in, stuck, past the threshold. */
export const Threshold: Story = {
  ...Playground,
  args: { ...DEFAULT_ARGS, threshold: 300 },
  play: async ({ canvasElement }) => {
    const header = headerOf(canvasElement)
    await scrollTo(0)
    await scrollTo(200)
    await expectState(header, "static")
    await expect(header.getBoundingClientRect().top).toBeLessThan(0)
    await scrollTo(500)
    await expectState(header, "stuck")
    await waitFor(() => expect(Math.round(header.getBoundingClientRect().top)).toBe(offsetOf(header)))
  },
}

/** `offset`: sticks below the top by a CSS length; the scroll padding includes it. */
export const Offset: Story = {
  ...Playground,
  args: DEFAULT_ARGS,
  render: args => {
    const OffsetDemo = () => {
      const bar = useBarOffset()
      return bar === undefined ? null : <Demo {...args} offset={`calc(${bar} + ${getNiceToken("gap", "large")})`} />
    }
    return <OffsetDemo />
  },
  play: async ({ canvasElement }) => {
    const header = headerOf(canvasElement)
    await scrollTo(0)
    await scrollTo(400)
    await expectState(header, "stuck")
    const offset = offsetOf(header)
    await expect(offset).toBe(resolvePx(`calc(${barOffset()} + ${getNiceToken("gap", "large")})`))
    await expect(Math.round(header.getBoundingClientRect().top)).toBe(Math.round(offset))
    await expect(parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)).toBe(header.offsetHeight + offset)
  },
}

/** `stopAt` as a scroll distance: past it the header scrolls away one-to-one ("released"). */
export const StopAt: Story = {
  ...Playground,
  args: { ...DEFAULT_ARGS, stopAt: 600 },
  play: async ({ canvasElement }) => {
    const header = headerOf(canvasElement)
    await scrollTo(0)
    await scrollTo(400)
    await expectState(header, "stuck")
    await scrollTo(640)
    await expectState(header, "released")
    await waitFor(() => expect(Math.round(header.getBoundingClientRect().top)).toBe(offsetOf(header) - 40))
    await scrollTo(400)
    await expectState(header, "stuck")
    await expect(Math.round(header.getBoundingClientRect().top)).toBe(offsetOf(header))
  },
}

/** `hideOnScroll`: a long scroll down hides the stuck header; a short scroll up reveals it. */
export const HideOnScroll: Story = {
  ...Playground,
  args: { ...DEFAULT_ARGS, hideOnScroll: true },
  play: async ({ canvasElement }) => {
    const header = headerOf(canvasElement)
    await scrollTo(0)
    await scrollTo(60)
    await expectState(header, "stuck")
    await scrollTo(600)
    await expectState(header, "hidden")
    await waitFor(() => expect(header.getBoundingClientRect().bottom).toBeLessThanOrEqual(0))
    // A run shorter than the up tolerance keeps it hidden; a longer one reveals it.
    await scrollTo(596)
    await expectState(header, "hidden")
    await scrollTo(580)
    await expectState(header, "stuck")
  },
}

/** `root`: sticky inside a scroll container; the height variable is set on the container. */
export const Root: Story = {
  ...Playground,
  args: { ...DEFAULT_ARGS, position: "fixed", inScrollContainer: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const container = canvas.getByTestId("container")
    const header = headerOf(canvasElement)
    await expect(getComputedStyle(header).position).toBe("sticky")
    await scrollTo(400, container)
    await expectState(header, "stuck")
    await expect(Math.round(header.getBoundingClientRect().top)).toBe(Math.round(container.getBoundingClientRect().top))
    await expect(container.style.getPropertyValue(getNiceToken("header.height", { as: "key" }))).toBe(`${header.offsetHeight}px`)
  },
}

/** `appearance` and the transition: each state's colours and the duration they change over. */
export const Appearance: Story = {
  ...Playground,
  args: { ...DEFAULT_ARGS, state: "stuck", stuckBackgroundColor: "raised", stuckBorderColor: "strong", transitionDuration: "slow" },
  play: async ({ canvasElement }) => {
    const header = headerOf(canvasElement)
    await waitFor(() => expect(getComputedStyle(header).backgroundColor).toBe(resolveCss("background-color", getNiceToken("backgroundColor", "raised"))))
    await expect(getComputedStyle(header).borderBottomColor).toBe(resolveCss("border-bottom-color", getNiceToken("borderColor", "strong")))
    await expect(getComputedStyle(header).transitionDuration.split(",")[0]).toBe(resolveCss("transition-duration", getNiceToken("animationDuration", "slow")))
  },
}

/** Long content: the header sticks, hides on the way down, returns on the way up, and stops at section 6's end. In-page links land below it. */
export const Scrolling: Story = {
  args: DEFAULT_ARGS,
  render: () => {
    const Scrolling = () => {
      const boundary = React.useRef<HTMLDivElement>(null)
      const bar = useBarOffset()
      return (
        <>
          <Header position="sticky" offset={bar} hideOnScroll stopAt={boundary}>
            <HeaderLogo />
          </Header>
          <Sections boundary={boundary} />
        </>
      )
    }
    return <Scrolling />
  },
  play: async ({ canvasElement }) => {
    const header = headerOf(canvasElement)
    await scrollTo(0)
    await expectState(header, "static")
    // Scrolling to a section (what the in-page link does; a click would navigate the test frame)
    // lands it below the header, through the root's scroll-padding-top.
    const target = canvasElement.querySelector<HTMLElement>("#section-5")!
    target.scrollIntoView({ block: "start" })
    await scrollTo(window.scrollY)
    await expect(Math.round(target.getBoundingClientRect().top)).toBe(header.offsetHeight + offsetOf(header))
    // Down past section 6's end: released, pushed up by the boundary.
    const boundary = canvasElement.querySelector<HTMLElement>("#section-6")!
    await scrollTo(0)
    await scrollTo(60)
    await expectState(header, "stuck")
    await scrollTo(window.scrollY + boundary.getBoundingClientRect().bottom - 10)
    await expectState(header, "hidden")
    // Scrolling back up a little reveals it where the boundary holds it: released, partly pushed out.
    await scrollTo(window.scrollY - 20)
    await expectState(header, "released")
    await waitFor(() => expect(Math.round(header.getBoundingClientRect().bottom)).toBe(Math.round(boundary.getBoundingClientRect().bottom)))
    await scrollTo(0)
    await expectState(header, "static")
  },
}

/** Each state in turn through the `state` prop: static, stuck, hidden, stuck again. */
export const Lifecycle: Story = {
  args: DEFAULT_ARGS,
  render: () => (
    <LifecycleStory
      steps={[
        { label: "static", props: { state: "static" as HeaderStateType } },
        { label: "stuck", props: { state: "stuck" as HeaderStateType } },
        { label: "hidden", props: { state: "hidden" as HeaderStateType } },
        { label: "stuck", props: { state: "stuck" as HeaderStateType } },
      ]}
      render={({ state }: Pick<HeaderProps, "state">) => (
        <div style={{ height: getToken("headerStory.lifecycleHeight:base"), overflow: "hidden" }}>
          <Header position="sticky" state={state} transitionDuration="slow">
            <HeaderLogo />
          </Header>
          <Sections count={1} />
        </div>
      )}
    />
  ),
}
