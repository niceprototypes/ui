import * as React from "react"
import Code from "@niceprototypes/code"
import type { AppContentsItemType } from "@niceprototypes/app"
import { docsHeadingsOfContent } from "@niceprototypes/docs/services"
import { ShikiPre } from "@niceprototypes/docs/components/ShikiPre"
import DocsPage from "../DocsPage"
import DocsContent from "@niceprototypes/docs/components/DocsContent"

/** Markdown inline code as the inline Code chip; fenced code goes through ShikiPre, which reads its own `<code>`. */
const InlineCode = ({ children }: { children?: React.ReactNode }) => <Code code={String(children)} inlined margin="none" />

/** An MDX page module: its default export takes the element overrides. */
export type MdxModuleType = { default: React.ComponentType<{ components?: Record<string, React.ComponentType<never>> }> }

/**
 * MdxPage
 *
 * One MDX page on the docs site: its content as the page's one section, fenced code through
 * Code (ShikiPre), inline code as Code chips, the docs rhythm (DocsContent), Contents listing
 * its own headings (docsHeadingsOfContent: the title and components' headings left out), the column capped
 * unless the page's data says `wrapped: false`.
 */
const MdxPage: React.FC<{ id: string; label: string; wrapped: boolean; Content: MdxModuleType["default"] }> = ({ id, label, wrapped, Content }) => {
  const content = React.useRef<HTMLDivElement>(null)
  const [contents, setContents] = React.useState<AppContentsItemType[]>()
  React.useLayoutEffect(() => {
    if (content.current) setContents(docsHeadingsOfContent(content.current, label))
  }, [Content, label])
  return (
    <DocsPage
      wrapped={wrapped}
      contents={contents?.length ? contents : undefined}
      sections={[
        {
          id,
          label,
          content: (
            <DocsContent ref={content}>
              <Content components={{ pre: ShikiPre, code: InlineCode }} />
            </DocsContent>
          ),
        },
      ]}
    />
  )
}

export default MdxPage
