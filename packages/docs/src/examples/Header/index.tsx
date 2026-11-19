// Header example configs — one ComponentExample per facet, shaped like Scroll's. Each preview is a
// bordered scroll box passed as the header's `root`, so the scroll behaviours work inside the cell:
// scroll the box to see them. The header holds only the logo, to give it height.
import * as React from "react"
import Header from "@niceprototypes/header"
import type { HeaderProps, HeaderStateType } from "@niceprototypes/header"
import Flex from "@niceprototypes/flex"
import Ink from "@niceprototypes/ink"
import Logo from "@niceprototypes/logo"
import { getToken } from "@niceprototypes/styles"
import type { ComponentExample } from "../../dataTables/components/demos/Components"

/** The box: seven rows tall, six wide. */
const BOX = {
  blockSize: `calc(${getToken("size", "larger")} * 7)`,
  inlineSize: `calc(${getToken("size", "larger")} * 6)`,
  overflowY: "auto",
  border: `${getToken("borderWidth", "small")} solid ${getToken("borderColor", "base")}`,
  borderRadius: getToken("borderRadius", "base"),
} as const

const LINES = Array.from({ length: 16 }, (_, index) => `Line ${index + 1}`)

/** A scroll box with a header (`props` over the defaults) above lines of text. */
const Box = (props: Omit<HeaderProps, "children" | "root">) => {
  const root = React.useRef<HTMLDivElement>(null)
  return (
    <div ref={root} style={BOX}>
      <Header {...props} root={root}>
        <Flex padding="small">
          <Logo />
        </Flex>
      </Header>
      <Flex direction="column" gap="small" padding="small">
        {LINES.map(line => (
          <Ink key={line}>{line}</Ink>
        ))}
      </Flex>
    </div>
  )
}

const LOGO = `  <Logo />`

export const headerPosition = {
  name: "position",
  description:
    "How the header sits. static (default) scrolls away; sticky (recommended) stays in the flow and sticks at the offset inside its containing block, and is released at that block's end; fixed is pinned to the viewport with a placeholder of its height in the flow, for layouts where an ancestor's overflow defeats sticky. In a scroll container (these previews) fixed renders sticky.",
  variants: ["static", "sticky"],
  default: "static",
  preview: variant => <Box position={variant} />,
  code: variant => (variant === "static" ? `<Header>\n${LOGO}\n</Header>` : `<Header position="${variant}">\n${LOGO}\n</Header>`),
} satisfies ComponentExample

export const headerThreshold = {
  name: "threshold",
  description: "Pixels scrolled past the header's place before it sticks. With a threshold it scrolls away first, then slides back in, stuck.",
  variants: ["0", "120"],
  default: "0",
  preview: variant => <Box position="sticky" threshold={Number(variant)} />,
  code: variant => (variant === "0" ? `<Header position="sticky">\n${LOGO}\n</Header>` : `<Header position="sticky" threshold={${variant}}>\n${LOGO}\n</Header>`),
} satisfies ComponentExample

export const headerStopAt = {
  name: "stopAt",
  description:
    "Where the header stops sticking: a scroll distance in pixels, or an element (or ref) whose bottom edge pushes it up and out. Released, it scrolls away with the content; scrolling back brings it back.",
  variants: ["unset", "200"],
  default: "unset",
  preview: variant => <Box position="sticky" stopAt={variant === "unset" ? undefined : Number(variant)} />,
  code: variant => (variant === "unset" ? `<Header position="sticky">\n${LOGO}\n</Header>` : `<Header position="sticky" stopAt={${variant}}>\n${LOGO}\n</Header>`),
} satisfies ComponentExample

export const headerHideOnScroll = {
  name: "hideOnScroll",
  description:
    "While stuck, scrolling down hides the header and scrolling up reveals it. tolerance sets how far one direction must run first ({ up: 8, down: 24 } by default), so short flicks and the rubber-band bounce do not toggle it. It is revealed at the end of the content and by focus inside it; in-page links, hashchanges and the on-screen keyboard pause it.",
  variants: ["false", "true"],
  default: "false",
  preview: variant => <Box position="sticky" hideOnScroll={variant === "true"} />,
  code: variant => (variant === "false" ? `<Header position="sticky">\n${LOGO}\n</Header>` : `<Header position="sticky" hideOnScroll>\n${LOGO}\n</Header>`),
} satisfies ComponentExample

export const headerState = {
  name: "state",
  description:
    "The scroll state, set as data-state: static, stuck, hidden (slid out by hideOnScroll) or released (past stopAt). Normally derived from scrolling; the state prop forces one. onStateChange reports each change.",
  variants: ["static", "stuck", "hidden"],
  default: "static",
  preview: variant => <Box position="sticky" state={variant as HeaderStateType} />,
  code: variant => `<Header position="sticky" state="${variant}">\n${LOGO}\n</Header>`,
} satisfies ComponentExample

export const headerAppearance = {
  name: "appearance",
  description:
    "Colours and font size per visual state: default while static, stuck while stuck, hidden or released. Each value is a core token variant; unset values take the header.* tokens (stuck adds the border colour and the raised shadow). transitionDuration and transitionEasing set the change between states, from the motion tokens; reduced motion turns it off.",
  variants: ["tokens", "raised"],
  default: "tokens",
  preview: variant => (
    <Box position="sticky" state="stuck" appearance={variant === "raised" ? { stuck: { backgroundColor: "raised", borderColor: "none" } } : undefined} />
  ),
  code: variant =>
    variant === "tokens"
      ? `<Header position="sticky">\n${LOGO}\n</Header>`
      : `<Header\n  position="sticky"\n  appearance={{ stuck: { backgroundColor: "raised", borderColor: "none" } }}\n>\n${LOGO}\n</Header>`,
} satisfies ComponentExample

/** Every Header example facet — each one a section of the Header docs page. */
export const headerExamples = {
  position: headerPosition,
  threshold: headerThreshold,
  stopAt: headerStopAt,
  hideOnScroll: headerHideOnScroll,
  state: headerState,
  appearance: headerAppearance,
} satisfies Record<string, ComponentExample>
