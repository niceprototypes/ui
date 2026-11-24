import * as React from "react"
import { RuleType, type MarkdownToJSX } from "markdown-to-jsx/react"
import Ink from "@niceprototypes/ink"
import Code from "@niceprototypes/code"
import type { MarkdownProps } from "../components/Markdown/Markdown.types"

type Children = { children?: React.ReactNode }
type Heading = Children & { id?: string }

/** A real top-level domain: letters, or an IDN `xn--` label. Never digits, as in `1.0.0`. */
const TOP_LEVEL_DOMAIN = /^(?:[a-z]{2,}|xn--[a-z0-9-]+)$/i

/**
 * The address when `node` is an email autolink whose domain has no real top-level domain, so a
 * versioned id like `nice/chat@1.0.0` stays text; otherwise null.
 */
const getVersionedId = (node: MarkdownToJSX.ASTNode): string | null => {
  if (node.type !== RuleType.link || !node.target?.startsWith("mailto:")) return null
  const address = node.target.slice("mailto:".length)
  const [text] = node.children
  if (node.children.length !== 1 || text.type !== RuleType.text || text.text !== address) return null
  return TOP_LEVEL_DOMAIN.test(address.slice(address.lastIndexOf(".") + 1)) ? null : address
}

/**
 * The markdown-to-jsx options for Markdown's props: headings, paragraphs and list items through
 * Ink, links through `linkComponent` or an anchor, `overrides` over those; fenced code as a Code
 * block and inline code as `Code inlined`, unless `overrides` replaces `pre` or `code`; an email
 * autolink without a real top-level domain (`nice/chat@1.0.0`) as plain text.
 */
export const getMarkdownOptions = ({
  linkComponent: Link,
  size,
  overrides,
}: Omit<MarkdownProps, "children">): MarkdownToJSX.Options => ({
  // Top-level blocks render one by one, so none needs a wrapper.
  wrapper: null,
  overrides: {
    h1: ({ children, id }: Heading) => <Ink as="h1" id={id} size="larger" weight="semibold">{children}</Ink>,
    h2: ({ children, id }: Heading) => <Ink as="h2" id={id} size="large" weight="semibold">{children}</Ink>,
    h3: ({ children, id }: Heading) => <Ink as="h3" id={id} weight="semibold">{children}</Ink>,
    p: ({ children }: Children) => <Ink as="p" size={size}>{children}</Ink>,
    // Lists keep their list role (their markers are drawn, not list-style, which some screen readers read as no list).
    ul: ({ children }: Children) => <ul role="list">{children}</ul>,
    ol: ({ children, start }: Children & { start?: number }) => (
      // The drawn numbers count from `start` (counter-reset below the first number).
      <ol role="list" start={start} style={start === undefined ? undefined : { counterReset: `markdown-list ${start - 1}` }}>
        {children}
      </ol>
    ),
    li: ({ children }: Children) => (
      <li>
        <Ink size={size}>{children}</Ink>
      </li>
    ),
    a: ({ children, href = "" }: Children & { href?: string }) =>
      Link ? <Link href={href}>{children}</Link> : <a href={href}>{children}</a>,
    ...overrides,
  },
  renderRule: (next, node, _renderChildren, state) => {
    // Fenced code: a Code block, its spacing left to markdown.gap.
    if (node.type === RuleType.codeBlock && !overrides?.pre && !overrides?.code)
      return <Code key={state.key} code={node.text} language={node.lang} margin="none" />
    if (node.type === RuleType.codeInline && !overrides?.code) return <Code key={state.key} code={node.text} inlined />
    const versionedId = getVersionedId(node)
    if (versionedId !== null) return versionedId
    return next()
  },
})
