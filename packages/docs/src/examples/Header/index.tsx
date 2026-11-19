// Header example configs — one ComponentExample per facet, shaped like Scroll's. Each preview is a
// bordered scroll box passed as the header's `root`, so the scroll behaviours work inside the cell:
// scroll the box to see them. The header holds the logo, to give it height.
import * as React from "react"
import Header from "@niceprototypes/header"
import type { HeaderProps, HeaderStateType } from "@niceprototypes/header"
import Button from "@niceprototypes/button"
import Flex from "@niceprototypes/flex"
import Ink from "@niceprototypes/ink"
import Logo from "@niceprototypes/logo"
import { getToken, type AnimationDurationType, type AnimationEasingType } from "@niceprototypes/styles"
import type { ComponentExample } from "../../dataTables/components/demos/Components"

/** The box: seven rows tall, six wide. */
const BOX = {
  blockSize: `calc(${getToken("size", "larger")} * 7)`,
  inlineSize: `calc(${getToken("size", "larger")} * 6)`,
  maxInlineSize: "100%",
  overflowY: "auto",
  border: `${getToken("borderWidth", "small")} solid ${getToken("borderColor", "base")}`,
  borderRadius: getToken("borderRadius", "base"),
} as const

/** The section a stopAt element example ends the header at. */
const SECTION = {
  borderBlockEnd: `${getToken("borderWidth", "small")} solid ${getToken("borderColor", "strong")}`,
} as const

const lines = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, index) => `Line ${from + index}`)

const Lines = ({ from, to }: { from: number; to: number }) => (
  <Flex direction="column" gap="small" padding="small">
    {lines(from, to).map(line => (
      <Ink key={line}>{line}</Ink>
    ))}
  </Flex>
)

type BoxProps = Omit<HeaderProps, "children" | "root" | "stopAt"> & {
  /** A number passes through; "section" ends the header at the bottom of a section of the content */
  stopAt?: number | "section"
  /** The header's content; unset, the logo */
  content?: React.ReactNode
}

/** A scroll box with a header (`props` over the defaults) above lines of text. */
const Box = ({ stopAt, content, ...props }: BoxProps) => {
  const root = React.useRef<HTMLDivElement>(null)
  const section = React.useRef<HTMLDivElement>(null)
  return (
    <div ref={root} style={BOX}>
      <Header {...props} root={root} stopAt={stopAt === "section" ? section : stopAt}>
        {content ?? (
          <Flex padding="small">
            <Logo />
          </Flex>
        )}
      </Header>
      {stopAt === "section" ? (
        <>
          <div ref={section} style={SECTION}>
            <Lines from={1} to={6} />
          </div>
          <Lines from={7} to={60} />
        </>
      ) : (
        <Lines from={1} to={60} />
      )}
    </div>
  )
}

/** A box that shows the header's last reported state below it. */
const Reported = (props: BoxProps) => {
  const [state, setState] = React.useState<HeaderStateType>("static")
  return (
    <Flex direction="column" gap="small">
      <Box {...props} onStateChange={setState} />
      <Ink size="small">{`onStateChange: ${state}`}</Ink>
    </Flex>
  )
}

/** A hide-on-scroll box with a button that changes resetKey, as a route change would. */
const Resettable = () => {
  const [key, setKey] = React.useState(0)
  return (
    <Flex direction="column" gap="small" alignItems="flex-start">
      <Box position="sticky" hideOnScroll resetKey={key} />
      <Button onClick={() => setKey(key + 1)}>{`Change resetKey (now ${key})`}</Button>
    </Flex>
  )
}

const LOGO = `  <Flex padding="small">\n    <Logo />\n  </Flex>`

/** The JSX of a header with these attribute lines. */
const headerCode = (...attributes: string[]) =>
  attributes.length === 0
    ? `<Header root={scrollBox}>\n${LOGO}\n</Header>`
    : `<Header\n  root={scrollBox}\n${attributes.map(attribute => `  ${attribute}`).join("\n")}\n>\n${LOGO}\n</Header>`

export const headerChildren = {
  name: "children",
  description: "The header's content, laid out by you; the header supplies the surface, the border and the scroll behaviour.",
  variants: ["logo", "logo and title"],
  default: "logo",
  preview: (variant: string) => (
    <Box
      position="sticky"
      content={
        variant === "logo" ? undefined : (
          <Flex padding="small" gap="small" alignItems="center">
            <Logo />
            <Ink weight="bold">Docs</Ink>
          </Flex>
        )
      }
    />
  ),
  code: (variant: string) =>
    variant === "logo"
      ? headerCode(`position="sticky"`)
      : `<Header root={scrollBox} position="sticky">\n  <Flex padding="small" gap="small" alignItems="center">\n    <Logo />\n    <Ink weight="bold">Docs</Ink>\n  </Flex>\n</Header>`,
} satisfies ComponentExample

export const headerPosition = {
  name: "position",
  description:
    "How the header sits. static (default) scrolls away; sticky (recommended) stays in the flow and sticks at the offset inside its containing block, and is released at that block's end; fixed is pinned to the viewport with a placeholder of its height in the flow, for layouts where an ancestor's overflow defeats sticky. In a scroll container (these previews) fixed renders sticky.",
  variants: ["static", "sticky", "fixed"],
  default: "static",
  preview: (variant: HeaderProps["position"]) => <Box position={variant} />,
  code: (variant: string) => (variant === "static" ? headerCode() : headerCode(`position="${variant}"`)),
} satisfies ComponentExample

/** offset per variant: the header.offset token, or a size token. */
const OFFSETS: Record<string, string | undefined> = {
  "header.offset token": undefined,
  'getToken("size", "small")': getToken("size", "small"),
}

export const headerOffset = {
  name: "offset",
  description: "The distance from the top of the root at which the header sticks, a CSS length; unset, the header.offset token.",
  variants: Object.keys(OFFSETS),
  default: "header.offset token",
  preview: (variant: string) => <Box position="sticky" offset={OFFSETS[variant]} />,
  code: (variant: string) =>
    OFFSETS[variant] === undefined ? headerCode(`position="sticky"`) : headerCode(`position="sticky"`, `offset={${variant}}`),
} satisfies ComponentExample

export const headerThreshold = {
  name: "threshold",
  description: "Pixels scrolled past the header's place before it sticks. With a threshold it scrolls away first, then slides back in, stuck.",
  variants: ["0", "120"],
  default: "0",
  preview: (variant: string) => <Box position="sticky" threshold={Number(variant)} />,
  code: (variant: string) => (variant === "0" ? headerCode(`position="sticky"`) : headerCode(`position="sticky"`, `threshold={${variant}}`)),
} satisfies ComponentExample

export const headerStopAt = {
  name: "stopAt",
  description:
    "Where the header stops sticking: a scroll distance in pixels, or an element (or ref) whose bottom edge pushes it up and out. Released, it scrolls away with the content; scrolling back brings it back.",
  variants: ["unset", "200", "element"],
  default: "unset",
  preview: (variant: string) => (
    <Box position="sticky" stopAt={variant === "unset" ? undefined : variant === "element" ? "section" : Number(variant)} />
  ),
  code: (variant: string) =>
    variant === "unset"
      ? headerCode(`position="sticky"`)
      : variant === "element"
        ? `const section = useRef(null)\n\n${headerCode(`position="sticky"`, `stopAt={section}`)}\n<section ref={section}>…</section>`
        : headerCode(`position="sticky"`, `stopAt={${variant}}`),
} satisfies ComponentExample

export const headerHideOnScroll = {
  name: "hideOnScroll",
  description:
    "While stuck, scrolling down hides the header and scrolling up reveals it. It is revealed at the end of the content and by focus inside it; in-page links, hashchanges and the on-screen keyboard pause it.",
  variants: ["false", "true"],
  default: "false",
  preview: (variant: string) => <Box position="sticky" hideOnScroll={variant === "true"} />,
  code: (variant: string) => (variant === "false" ? headerCode(`position="sticky"`) : headerCode(`position="sticky"`, `hideOnScroll`)),
} satisfies ComponentExample

/** tolerance per variant. */
const TOLERANCES: Record<string, HeaderProps["tolerance"]> = {
  "{ up: 8, down: 24 }": undefined,
  "0": 0,
  "{ up: 0, down: 120 }": { up: 0, down: 120 },
}

export const headerTolerance = {
  name: "tolerance",
  description:
    "How far one scroll direction must run before hideOnScroll hides (down) or reveals (up) the header, so short flicks and the rubber-band bounce do not toggle it. A number sets both; unset, { up: 8, down: 24 }.",
  variants: Object.keys(TOLERANCES),
  default: "{ up: 8, down: 24 }",
  preview: (variant: string) => <Box position="sticky" hideOnScroll tolerance={TOLERANCES[variant]} />,
  code: (variant: string) =>
    TOLERANCES[variant] === undefined
      ? headerCode(`position="sticky"`, `hideOnScroll`)
      : headerCode(`position="sticky"`, `hideOnScroll`, `tolerance={${variant}}`),
} satisfies ComponentExample

export const headerRoot = {
  name: "root",
  description:
    "The scroll container the header measures against, an element or a ref; unset, the window. Every preview on this page passes its own scroll box, so each header reacts to that box alone.",
  variants: ["scroll box"],
  default: "scroll box",
  preview: () => <Box position="sticky" hideOnScroll />,
  code: () =>
    `const scrollBox = useRef(null)\n\n<div ref={scrollBox} style={{ overflowY: "auto" }}>\n  <Header root={scrollBox} position="sticky" hideOnScroll>\n  ${LOGO.trim()}\n  </Header>\n  …\n</div>`,
} satisfies ComponentExample

export const headerState = {
  name: "state",
  description:
    "The scroll state, set as data-state: static, stuck, hidden (slid out by hideOnScroll) or released (past stopAt). Normally derived from scrolling; the state prop forces one.",
  variants: ["static", "stuck", "hidden", "released"],
  default: "static",
  preview: (variant: HeaderStateType) => <Box position="sticky" state={variant} />,
  code: (variant: string) => headerCode(`position="sticky"`, `state="${variant}"`),
} satisfies ComponentExample

export const headerOnStateChange = {
  name: "onStateChange",
  description: "Called with each new state. Scroll the box: the line below it shows what the header reported last.",
  variants: ["sticky", "sticky, hideOnScroll and stopAt"],
  default: "sticky",
  preview: (variant: string) =>
    variant === "sticky" ? <Reported position="sticky" /> : <Reported position="sticky" hideOnScroll stopAt={400} />,
  code: (variant: string) =>
    variant === "sticky"
      ? headerCode(`position="sticky"`, `onStateChange={setState}`)
      : headerCode(`position="sticky"`, `hideOnScroll`, `stopAt={400}`, `onStateChange={setState}`),
} satisfies ComponentExample

export const headerResetKey = {
  name: "resetKey",
  description:
    "Change it on a route change (a pathname, a page id): hideOnScroll forgets the last scroll run and the header shows, without the header knowing the router. Scroll down until the header hides, then press the button.",
  variants: ["route change"],
  default: "route change",
  preview: () => <Resettable />,
  code: () => headerCode(`position="sticky"`, `hideOnScroll`, `resetKey={pathname}`),
} satisfies ComponentExample

/** appearance per variant. */
const APPEARANCES: Record<string, HeaderProps["appearance"]> = {
  tokens: undefined,
  "stuck: raised, no border": { stuck: { backgroundColor: "raised", borderColor: "none" } },
  "stuck: overlay shadow": { stuck: { boxShadow: "overlay" } },
  "default and stuck": { default: { backgroundColor: "sunken", color: "light" }, stuck: { backgroundColor: "base", color: "base", fontSize: "small" } },
}

const APPEARANCE_CODE: Record<string, string> = {
  "stuck: raised, no border": `{ stuck: { backgroundColor: "raised", borderColor: "none" } }`,
  "stuck: overlay shadow": `{ stuck: { boxShadow: "overlay" } }`,
  "default and stuck": `{\n    default: { backgroundColor: "sunken", color: "light" },\n    stuck: { backgroundColor: "base", color: "base", fontSize: "small" },\n  }`,
}

export const headerAppearance = {
  name: "appearance",
  description:
    "Colours and font size per visual state: default while static, stuck while stuck, hidden or released. Each value is a core token variant; unset values take the header.* tokens (stuck adds the border colour and the raised shadow). Scroll each box to see the change.",
  variants: Object.keys(APPEARANCES),
  default: "tokens",
  preview: (variant: string) => <Box position="sticky" appearance={APPEARANCES[variant]} />,
  code: (variant: string) =>
    APPEARANCES[variant] === undefined
      ? headerCode(`position="sticky"`)
      : headerCode(`position="sticky"`, `appearance={${APPEARANCE_CODE[variant]}}`),
} satisfies ComponentExample

const DURATIONS = ["faster", "base", "slower"] as const satisfies readonly AnimationDurationType[]

export const headerTransitionDuration = {
  name: "transitionDuration",
  description: "Duration of the change between states (appearance and hide/reveal), from the motion tokens; unset, the header.transitionDuration token. Reduced motion turns it off.",
  variants: DURATIONS,
  default: "base",
  preview: (variant: AnimationDurationType) => <Box position="sticky" hideOnScroll transitionDuration={variant} />,
  code: (variant: string) =>
    variant === "base" ? headerCode(`position="sticky"`, `hideOnScroll`) : headerCode(`position="sticky"`, `hideOnScroll`, `transitionDuration="${variant}"`),
} satisfies ComponentExample

const EASINGS = ["base", "linear", "ease-in", "ease-out", "ease"] as const satisfies readonly AnimationEasingType[]

export const headerTransitionEasing = {
  name: "transitionEasing",
  description: "Easing of the change between states, from the motion tokens; unset, the header.transitionEasing token. Shown at the slower duration.",
  variants: EASINGS,
  default: "base",
  preview: (variant: AnimationEasingType) => <Box position="sticky" hideOnScroll transitionDuration="slower" transitionEasing={variant} />,
  code: (variant: string) =>
    headerCode(`position="sticky"`, `hideOnScroll`, `transitionDuration="slower"`, ...(variant === "base" ? [] : [`transitionEasing="${variant}"`])),
} satisfies ComponentExample

/** Combinations of the scroll behaviours. */
const COMBINATIONS: Record<string, Omit<BoxProps, "content">> = {
  "threshold and hideOnScroll": { position: "sticky", threshold: 120, hideOnScroll: true },
  "hideOnScroll and stopAt": { position: "sticky", hideOnScroll: true, stopAt: "section" },
  "threshold, hideOnScroll, stopAt and appearance": {
    position: "sticky",
    threshold: 60,
    hideOnScroll: true,
    stopAt: 500,
    appearance: { stuck: { backgroundColor: "raised", borderColor: "none" } },
  },
}

const COMBINATION_CODE: Record<string, string[]> = {
  "threshold and hideOnScroll": [`position="sticky"`, `threshold={120}`, `hideOnScroll`],
  "hideOnScroll and stopAt": [`position="sticky"`, `hideOnScroll`, `stopAt={section}`],
  "threshold, hideOnScroll, stopAt and appearance": [
    `position="sticky"`,
    `threshold={60}`,
    `hideOnScroll`,
    `stopAt={500}`,
    `appearance={{ stuck: { backgroundColor: "raised", borderColor: "none" } }}`,
  ],
}

export const headerCombinations = {
  name: "combinations",
  description: "The scroll behaviours together, as a page header uses them.",
  variants: Object.keys(COMBINATIONS),
  default: "threshold and hideOnScroll",
  preview: (variant: string) => <Box {...COMBINATIONS[variant]} />,
  code: (variant: string) => headerCode(...COMBINATION_CODE[variant]),
} satisfies ComponentExample

/** Every Header example facet — each one a section of the Header docs page. */
export const headerExamples = {
  children: headerChildren,
  position: headerPosition,
  offset: headerOffset,
  threshold: headerThreshold,
  stopAt: headerStopAt,
  hideOnScroll: headerHideOnScroll,
  tolerance: headerTolerance,
  root: headerRoot,
  appearance: headerAppearance,
  transitionDuration: headerTransitionDuration,
  transitionEasing: headerTransitionEasing,
  state: headerState,
  onStateChange: headerOnStateChange,
  resetKey: headerResetKey,
  combinations: headerCombinations,
} satisfies Record<string, ComponentExample>
