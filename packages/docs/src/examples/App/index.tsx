// App example configs: one ComponentExample per facet, keyed by prop name, plus the drawer's lifecycle.
// Every preview is a live App shell in a fixed-height frame, on its own in-memory router, so picking a
// page navigates inside the frame and leaves this page's URL alone.
import * as React from "react"
import App from "@niceprototypes/app"
import type { AppLocationType, AppNavigateType, AppProps, AppRouterType, AppSectionType, AppWrapperType } from "@niceprototypes/app"
import Flex from "@niceprototypes/flex"
import Ink from "@niceprototypes/ink"
import { setTokens } from "@niceprototypes/styles"
import LifecycleStory, { type LifecycleStep } from "../../components/LifecycleStory"
import type { ComponentExample } from "../../dataTables/components/demos/Components"

/** The frame each shell renders in, from a project token map: App fills the viewport's height, the frame clips it. */
const getToken = setTokens({ frame: { height: "480px", width: "100%" } }, "appExamples")
const FRAME = { height: getToken("appExamples.frame:height"), width: getToken("appExamples.frame:width"), overflow: "hidden" } as const

/** The examples' router: the location in React state, one per shell. */
const MemoryContext = React.createContext<{ location: AppLocationType; navigate: AppNavigateType } | null>(null)
const useMemory = () => React.useContext(MemoryContext)!

const memoryRouter: AppRouterType = {
  Provider: ({ children }) => {
    const [location, setLocation] = React.useState<AppLocationType>({ pathname: "/", search: "" })
    const navigate = React.useCallback<AppNavigateType>(to => {
      const [pathname, search = ""] = to.split("?")
      setLocation({ pathname, search: search && `?${search}` })
    }, [])
    return <MemoryContext.Provider value={{ location, navigate }}>{children}</MemoryContext.Provider>
  },
  useLocation: () => useMemory().location,
  useNavigate: () => useMemory().navigate,
  Link: ({ to, children }) => {
    const { navigate } = useMemory()
    return (
      <a
        href={to}
        onClick={event => {
          event.preventDefault()
          navigate(to)
        }}
      >
        {children}
      </a>
    )
  },
}

/** A page that shows its name. */
const page = (name: string) => () => Promise.resolve({ default: () => <Ink as="h1">{name}</Ink> })

const SCENES = {
  "./stories/1 Motion/1 Easing/index.tsx": page("Easing"),
  "./stories/1 Motion/2 Duration/index.tsx": page("Duration"),
}
const DOCS = {
  "./stories/1 Motion/Overview/Guide.md": () => Promise.resolve("# Guide\n\nMotion, in two scenes."),
}
const PAGES = {
  "./docs/1 Welcome/index.tsx": page("Welcome"),
  "./docs/2 Install/index.tsx": page("Install"),
  "./docs/3 Tokens/index.tsx": page("Tokens"),
}

/** A section after the stories or docs, at /store. */
const SECTIONS: AppSectionType[] = [{ id: "store", name: "Store", content: <Ink as="h1">Store</Ink> }]

/** A scene wrapper with the large gap around each scene. */
const Padded: AppWrapperType = ({ children }) => <Flex padding="large">{children}</Flex>

/** The end column's stand-in content. */
const END = (
  <Flex padding="large">
    <Ink color="lighter">End column</Ink>
  </Flex>
)

/** A shell with the examples' scenes and router in its frame; `props` add to or replace them. */
const DemoApp = (props: Partial<AppProps>) => (
  <div style={FRAME}>
    <App aria-label="Docs" scenes={SCENES} router={memoryRouter} {...props} />
  </div>
)

/** The glob setup every example starts from, as an app writes it. */
const GLOBS = `const scenes = import.meta.glob("./stories/**/index.tsx")
const docs = import.meta.glob("./stories/**/*.md", { query: "?raw", import: "default" })
const pages = import.meta.glob("./docs/**/index.tsx")`

const appCode = (props: string) => `<App router={router} scenes={scenes}${props} />`

export const appScenes = {
  name: "scenes",
  description:
    "The scenes: a lazy import.meta.glob of every index.tsx under stories/, keyed by path. Folder depth is the level (stories/<N Story>/<N Chapter>/index.tsx); the default export is the scene. Absent in a docs-only app.",
  variants: ["scenes"],
  default: "scenes",
  preview: () => <DemoApp />,
  code: () => `${GLOBS.split("\n")[0]}\n\n<App router={router} scenes={scenes} />`,
} satisfies ComponentExample

export const appDocs = {
  name: "docs",
  description: "The markdown pages in stories: a lazy import.meta.glob of .md files as text (stories/<Story>/<Chapter>/<Page>.md), each one page of its chapter, named by the file.",
  variants: ["unset", "markdown page"],
  default: "unset",
  preview: (variant: string) => <DemoApp docs={variant === "unset" ? undefined : DOCS} />,
  code: (variant: string) => appCode(variant === "unset" ? "" : " docs={docs}"),
} satisfies ComponentExample

export const appPages = {
  name: "pages",
  description: "The docs section's pages: a lazy import.meta.glob of every index.tsx under docs/ (docs/<N Page>/index.tsx, or nested in folders). Without scenes the app is docs-only.",
  variants: ["unset", "docs pages", "docs only"],
  default: "unset",
  preview: (variant: string) => (
    <DemoApp pages={variant === "unset" ? undefined : PAGES} scenes={variant === "docs only" ? undefined : SCENES} />
  ),
  code: (variant: string) =>
    variant === "docs only" ? `<App router={router} pages={pages} />` : appCode(variant === "unset" ? "" : " pages={pages}"),
} satisfies ComponentExample

export const appRouter = {
  name: "router",
  description:
    "The router adapter: a Provider, useLocation, useNavigate and Link. @niceprototypes/app/adapters ships plain, react-router and tanstack-router; these examples keep the location in memory.",
  variants: ["memory"],
  default: "memory",
  preview: () => <DemoApp pages={PAGES} />,
  code: () => `import { plainRouter } from "@niceprototypes/app/adapters/plain"

<App router={plainRouter} scenes={scenes} pages={pages} />`,
} satisfies ComponentExample

export const appSections = {
  name: "sections",
  description: "Top-level sections after the stories or docs in the nav, each a row and its own page at /<id> showing its content.",
  variants: ["unset", "store"],
  default: "unset",
  preview: (variant: string) => <DemoApp sections={variant === "unset" ? undefined : SECTIONS} />,
  code: (variant: string) =>
    variant === "unset" ? appCode("") : `const sections = [{ id: "store", name: "Store", content: <Store /> }]\n\n${appCode(" sections={sections}")}`,
} satisfies ComponentExample

export const appWrapper = {
  name: "wrapper",
  description: "Wraps every scene (not markdown or docs section pages) inside the scene region, with the URL's query parameters: scene-only providers, styles and URL settings.",
  variants: ["unset", "padded"],
  default: "unset",
  preview: (variant: string) => <DemoApp wrapper={variant === "unset" ? undefined : Padded} />,
  code: (variant: string) =>
    variant === "unset" ? appCode("") : `const Padded = ({ children }) => <Flex padding="large">{children}</Flex>\n\n${appCode(" wrapper={Padded}")}`,
} satisfies ComponentExample

export const appSearch = {
  name: "search",
  description: "A search button in the sidebar's header row, right of the logo, that expands into a combobox over every page's name and opens the picked page.",
  variants: ["false", "true"],
  default: "false",
  preview: (variant: string) => <DemoApp pages={PAGES} search={variant === "true"} />,
  code: (variant: string) => appCode(` pages={pages}${variant === "true" ? " search" : ""}`),
} satisfies ComponentExample

export const appDocsLink = {
  name: "docsLink",
  description: "A book icon button after the search that opens the first docs section page in a new tab. Needs pages.",
  variants: ["false", "true"],
  default: "false",
  preview: (variant: string) => <DemoApp pages={PAGES} docsLink={variant === "true"} />,
  code: (variant: string) => appCode(` pages={pages}${variant === "true" ? " docsLink" : ""}`),
} satisfies ComponentExample

export const appPanelLabels = {
  name: "panelLabels",
  description: "Labels for the panels under the nav, the scene sidebar panel and its footer panel, at each panel's top left on its drag handle's line. A scene fills the panels with useSceneSidebar and useSceneSidebarFooter.",
  variants: ["unset", "labelled"],
  default: "unset",
  preview: (variant: string) => <DemoApp panelLabels={variant === "unset" ? undefined : { sidebar: "Properties", footer: "Timeline" }} />,
  code: (variant: string) => appCode(variant === "unset" ? "" : ` panelLabels={{ sidebar: "Properties", footer: "Timeline" }}`),
} satisfies ComponentExample

export const appEnd = {
  name: "end",
  description: "A column right of the scene region, outside it, app.end.width wide; it stays mounted across page changes. Laptop and up only.",
  variants: ["unset", "end column"],
  default: "unset",
  preview: (variant: string) => <DemoApp end={variant === "unset" ? undefined : END} />,
  code: (variant: string) => appCode(variant === "unset" ? "" : " end={<Inspector />}"),
} satisfies ComponentExample

export const appNavSize = {
  name: "navSize",
  description: "The nav's label size; unset, the Tree's own (base below laptop, small from it up).",
  variants: ["unset", "small", "base"],
  default: "unset",
  preview: (variant: string) => <DemoApp pages={PAGES} navSize={variant === "unset" ? undefined : (variant as AppProps["navSize"])} />,
  code: (variant: string) => appCode(variant === "unset" ? "" : ` navSize="${variant}"`),
} satisfies ComponentExample

export const appSidebarOpen = {
  name: "sidebarOpen",
  description:
    "Below laptop, whether the sidebar drawer is open over the scene region. Set, it is controlled; unset, the shell keeps it, closed at first. From laptop up the sidebar always shows, so narrow the window to see the drawer.",
  variants: ["unset", "true", "false"],
  default: "unset",
  preview: (variant: string) => <DemoApp sidebarOpen={variant === "unset" ? undefined : variant === "true"} />,
  code: (variant: string) => appCode(variant === "unset" ? "" : ` sidebarOpen={${variant}}`),
} satisfies ComponentExample

/** A shell whose drawer state is kept outside it, reported by onSidebarOpenChange. */
const ReportingApp = () => {
  const [open, setOpen] = React.useState(false)
  return (
    <Flex direction="column" gap="small">
      <Ink code>{`sidebarOpen: ${open}`}</Ink>
      <DemoApp sidebarOpen={open} onSidebarOpenChange={setOpen} />
    </Flex>
  )
}

export const appOnSidebarOpenChange = {
  name: "onSidebarOpenChange",
  description: "Below laptop, called with the drawer's next open state: the menu button, Escape, or a picked page. Narrow the window to try it.",
  variants: ["handler"],
  default: "handler",
  preview: () => <ReportingApp />,
  code: () => `const [open, setOpen] = useState(false)

${appCode(" sidebarOpen={open} onSidebarOpenChange={setOpen}")}`,
} satisfies ComponentExample

export const appAriaLabel = {
  name: "aria-label",
  description: "Accessible name of the nav landmark.",
  variants: ["Docs"],
  default: "Docs",
  preview: (variant: string) => <DemoApp aria-label={variant} />,
  code: (variant: string) => appCode(` aria-label="${variant}"`),
} satisfies ComponentExample

type DrawerStepType = { sidebarOpen: boolean; withSections: boolean }

const DRAWER_STEPS: ReadonlyArray<LifecycleStep<DrawerStepType>> = [
  { label: "drawer closed", props: { sidebarOpen: false, withSections: false } },
  { label: "drawer open", props: { sidebarOpen: true, withSections: false } },
  { label: "with a section", props: { sidebarOpen: true, withSections: true } },
]

export const appLifecycle = {
  name: "lifecycle",
  description: "The drawer looping: closed, open over the page, then open with a section row after the pages. The drawer shows below laptop only.",
  variants: ["drawer"],
  default: "drawer",
  preview: () => (
    <LifecycleStory
      steps={DRAWER_STEPS}
      render={({ sidebarOpen, withSections }) => (
        <DemoApp pages={PAGES} sidebarOpen={sidebarOpen} sections={withSections ? SECTIONS : undefined} />
      )}
    />
  ),
  code: () => appCode(" pages={pages} sections={sections} sidebarOpen={open} onSidebarOpenChange={setOpen}"),
} satisfies ComponentExample

/** Every App example facet, each one a section of the App docs page. */
export const appExamples = {
  scenes: appScenes,
  docs: appDocs,
  pages: appPages,
  router: appRouter,
  sections: appSections,
  wrapper: appWrapper,
  search: appSearch,
  docsLink: appDocsLink,
  panelLabels: appPanelLabels,
  end: appEnd,
  navSize: appNavSize,
  sidebarOpen: appSidebarOpen,
  onSidebarOpenChange: appOnSidebarOpenChange,
  "aria-label": appAriaLabel,
  lifecycle: appLifecycle,
} satisfies Record<string, ComponentExample>
