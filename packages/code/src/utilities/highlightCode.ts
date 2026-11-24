/**
 * Shiki highlighting for the Code component.
 *
 * One sync singleton highlighter for every block. The theme is built from the
 * `code.syntaxColor` component tokens: every scope's colour is a `var()` from
 * getToken, so the palette and its day/night values live in nice-styles and the
 * cascade (prefers-color-scheme, `[data-theme]` pins) picks the theme. The `tsx`
 * grammar covers JS/TS/JSX.
 *
 * Internal utility — not exported from the package.
 */
import { createHighlighterCoreSync, type ThemeRegistration } from "@shikijs/core"
import { createJavaScriptRegexEngine } from "@shikijs/engine-javascript"
import tsx from "@shikijs/langs/tsx"
import css from "@shikijs/langs/css"
import bash from "@shikijs/langs/bash"
import html from "@shikijs/langs/html"
import json from "@shikijs/langs/json"
import { getToken, type TokenVariants } from "@niceprototypes/styles"

const syntaxColor = (variant: TokenVariants["code.syntaxColor"]) => getToken("code.syntaxColor", variant)

/**
 * TextMate scopes per palette colour, the `code.syntaxColor` variants named by hue in
 * spectrum order (green, cyan, blue, purple) plus neutral, after Atlassian's code palette:
 * strings green; JSX attribute names and their values, constants and CSS/JSON property
 * names cyan; keywords (bold), numbers and booleans blue; JSX/HTML tags purple; text,
 * identifiers, operators, arrows and punctuation (tag brackets included) neutral; comments
 * neutral in italic. The
 * more specific scope wins, so `keyword.operator` reads neutral under `keyword`, a JSX
 * attribute's string value reads cyan under `string`, and a `const` declaration's name
 * reads neutral while an UPPER_CASE constant reads cyan.
 */
const theme: ThemeRegistration = {
  name: "nice",
  type: "light",
  colors: {
    "editor.foreground": syntaxColor("neutral"),
    "editor.background": "transparent",
  },
  tokenColors: [
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: syntaxColor("neutral"), fontStyle: "italic" },
    },
    {
      scope: ["string", "punctuation.definition.string", "string.template"],
      settings: { foreground: syntaxColor("green") },
    },
    {
      scope: ["keyword", "storage"],
      settings: { foreground: syntaxColor("blue"), fontStyle: "bold" },
    },
    {
      scope: ["constant.numeric", "constant.language", "variable.language", "support.type.primitive"],
      settings: { foreground: syntaxColor("blue") },
    },
    {
      scope: [
        "keyword.operator",
        "punctuation.definition.template-expression",
        "meta.embedded",
        "meta.definition.variable variable.other.constant",
        "storage.type.function.arrow",
      ],
      settings: { foreground: syntaxColor("neutral"), fontStyle: "" },
    },
    {
      scope: ["entity.name.tag", "support.class.component"],
      settings: { foreground: syntaxColor("purple") },
    },
    {
      scope: [
        "entity.other.attribute-name",
        "meta.tag.attributes string",
        "meta.tag.attributes punctuation.definition.string",
        "variable.other.constant",
        "variable.other.enummember",
        "support.constant",
        "constant.other",
        "support.type.property-name",
      ],
      settings: { foreground: syntaxColor("cyan") },
    },
  ],
}

const highlighter = createHighlighterCoreSync({
  engine: createJavaScriptRegexEngine({ forgiving: true }),
  themes: [theme],
  langs: [tsx, css, bash, html, json],
})

// Fence language → registered grammar. Anything unmapped falls back to "text".
export const ALIASES: Record<string, string> = {
  tsx: "tsx",
  ts: "tsx",
  typescript: "tsx",
  jsx: "tsx",
  js: "tsx",
  javascript: "tsx",
  css: "css",
  bash: "bash",
  sh: "bash",
  shell: "bash",
  html: "html",
  xml: "html",
  json: "json",
}

const resolveLang = (language?: string): string =>
  ALIASES[(language ?? "").toLowerCase()] ?? "text"

/** Text as HTML text. */
const escapeHtml = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

/** A highlighted token as a span, with Shiki's own colour and italic/bold. */
const tokenSpan = (content: string, color?: string, fontStyle = 0) => {
  const style = [
    color ? `color:${color}` : "",
    fontStyle & 1 ? "font-style:italic" : "",
    fontStyle & 2 ? "font-weight:bold" : "",
  ].filter(Boolean).join(";")
  return `<span${style ? ` style="${style}"` : ""}>${escapeHtml(content)}</span>`
}

/**
 * Highlight `code` as Shiki HTML in the token theme. The trailing newline is
 * stripped so single-line snippets don't render a blank last line. `inline`
 * gives the token spans alone (no `<pre>`/`<code>`), for code inside a line of text.
 * With `context`, the code is highlighted inside `before + code + after` (a JSX attribute in a
 * tag) and only its own characters are drawn, in the colours that context gives them.
 */
export function highlightCode(code: string, language?: string, inline = false, context?: { before: string; after: string }): string {
  const source = code.replace(/\n$/, "")
  if (!context)
    return highlighter.codeToHtml(source, {
      lang: resolveLang(language),
      theme: theme.name!,
      structure: inline ? "inline" : "classic",
    })
  const { tokens } = highlighter.codeToTokens(`${context.before}${source}${context.after}`, { lang: resolveLang(language), theme: theme.name! })
  const start = context.before.length
  const end = start + source.length
  let offset = 0
  const lines: string[] = [""]
  tokens.forEach((line, index) => {
    if (index > 0) {
      if (offset >= start && offset < end) lines.push("")
      offset += 1
    }
    for (const token of line) {
      const from = Math.max(offset, start)
      const to = Math.min(offset + token.content.length, end)
      if (from < to) lines[lines.length - 1] += tokenSpan(token.content.slice(from - offset, to - offset), token.color, token.fontStyle)
      offset += token.content.length
    }
  })
  if (inline) return lines.join("<br>")
  return `<pre class="shiki ${theme.name}" tabindex="0"><code>${lines.map(line => `<span class="line">${line}</span>`).join("\n")}</code></pre>`
}
