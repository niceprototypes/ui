// Markdown example configs: one ComponentExample per facet, keyed by prop name, plus a streaming reply's
// lifecycle. Every preview is the live Markdown component.
import type * as React from "react"
import Markdown from "@niceprototypes/markdown"
import type { MarkdownLinkComponentType, MarkdownOverridesType, MarkdownProps } from "@niceprototypes/markdown"
import LifecycleStory, { type LifecycleStep } from "../../components/LifecycleStory"
import type { ComponentExample } from "../../dataTables/components/demos/Components"

/** An assistant reply using every default: a heading, paragraphs, a list, inline and fenced code, a link. */
const REPLY = `## Easing the slide

The slide reads stiff because it starts and stops at full speed. Give it an \`ease-out\` curve:

- shorten the duration to 240ms
- ease out, so it settles into place
- keep the fade on the same timing

\`\`\`css
.slide {
  transition: transform 240ms ease-out;
}
\`\`\`

The [overview](#overview) has the install line.`

/** The `children` variants: the reply, and one line with inline code. */
const CHILDREN: Record<string, string> = {
  reply: REPLY,
  "inline code": "A paragraph with `inline code`.",
}

/** A link component standing in for a router link: it marks each link with a trailing arrow. */
const RouterLink: MarkdownLinkComponentType = ({ href, children }) => (
  <a href={href} onClick={event => event.preventDefault()}>
    {children} →
  </a>
)

/** An override replacing the Ink paragraph with a plain, italic one. */
const PLAIN_PARAGRAPHS: MarkdownOverridesType = { p: ({ children }: { children?: React.ReactNode }) => <p><em>{children}</em></p> }

/** The source as a JS string literal, for the code column. */
const sourceOf = (text: string) => JSON.stringify(text)

export const markdownChildren = {
  name: "children",
  description:
    "The markdown source. Headings, paragraphs and list items render as Ink, fenced code as Code, inline code as Code inlined. Only the blocks that change re-render, so a streaming reply re-renders its last block.",
  variants: Object.keys(CHILDREN),
  default: "reply",
  preview: (variant: string) => <Markdown>{CHILDREN[variant]}</Markdown>,
  code: (variant: string) => `<Markdown>{${sourceOf(CHILDREN[variant])}}</Markdown>`,
} satisfies ComponentExample

export const markdownLinkComponent = {
  name: "linkComponent",
  description: "Renders every link in place of an anchor: pass the router's link so in-app links navigate without a reload.",
  variants: ["unset", "router link"],
  default: "unset",
  preview: (variant: string) => (
    <Markdown linkComponent={variant === "unset" ? undefined : RouterLink}>{"The [overview](#overview) has the install line."}</Markdown>
  ),
  code: (variant: string) =>
    variant === "unset"
      ? `<Markdown>{"The [timing guide](/docs/timing) lists the other curves."}</Markdown>`
      : `<Markdown linkComponent={({ href, children }) => <Link to={href}>{children}</Link>}>
  {"The [timing guide](/docs/timing) lists the other curves."}
</Markdown>`,
} satisfies ComponentExample

export const markdownSize = {
  name: "size",
  description: "Font size of paragraphs and list items; headings keep theirs.",
  variants: ["unset", "smaller", "small", "base", "large", "larger"],
  default: "unset",
  preview: (variant: string) => (
    <Markdown size={variant === "unset" ? undefined : (variant as MarkdownProps["size"])}>{REPLY.split("\n\n").slice(0, 3).join("\n\n")}</Markdown>
  ),
  code: (variant: string) => `<Markdown${variant === "unset" ? "" : ` size="${variant}"`}>{reply}</Markdown>`,
} satisfies ComponentExample

export const markdownOverrides = {
  name: "overrides",
  description: "markdown-to-jsx overrides, merged over the Nice defaults: replace any element, here the paragraph.",
  variants: ["unset", "plain paragraphs"],
  default: "unset",
  preview: (variant: string) => (
    <Markdown overrides={variant === "unset" ? undefined : PLAIN_PARAGRAPHS}>{"The slide reads stiff.\n\nGive it an `ease-out` curve."}</Markdown>
  ),
  code: (variant: string) =>
    variant === "unset"
      ? `<Markdown>{reply}</Markdown>`
      : `<Markdown overrides={{ p: ({ children }) => <p><em>{children}</em></p> }}>{reply}</Markdown>`,
} satisfies ComponentExample

/** The reply as it streams: each step adds the next few words. */
const STREAM = (() => {
  const words = REPLY.split(/(?<=\s)/)
  const chunk = Math.ceil(words.length / 8)
  return Array.from({ length: 8 }, (_, index) => words.slice(0, (index + 1) * chunk).join(""))
})()

const STREAM_STEPS: ReadonlyArray<LifecycleStep<{ text: string }>> = STREAM.map((text, index) => ({
  label: index === STREAM.length - 1 ? "complete" : "streaming",
  props: { text },
  duration: index === STREAM.length - 1 ? "long" : "base",
}))

export const markdownLifecycle = {
  name: "lifecycle",
  description: "A reply streaming in, a few words per step, then held complete. Each step re-renders only the last block.",
  variants: ["streaming"],
  default: "streaming",
  preview: () => <LifecycleStory steps={STREAM_STEPS} render={({ text }) => <Markdown>{text}</Markdown>} />,
  code: () => `<Markdown>{streamedText}</Markdown>`,
} satisfies ComponentExample

/** Every Markdown example facet, each one a section of the Markdown docs page. */
export const markdownExamples = {
  children: markdownChildren,
  linkComponent: markdownLinkComponent,
  size: markdownSize,
  overrides: markdownOverrides,
  lifecycle: markdownLifecycle,
} satisfies Record<string, ComponentExample>
