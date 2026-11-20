import * as React from "react"

export interface StoryHeaderProps {
  /** The page title text rendered as the `<h1>`. */
  title: React.ReactNode
  /** Optional lead paragraph rendered under the title, above the rule. */
  description?: React.ReactNode
  /** The package this page documents; its repo links (reposOf) render under the description. */
  packageName?: string
  /** Render the package's own repo link, install command and license as one PackageInstall row. @default false */
  install?: boolean
  /** Optional content rendered between the description and the horizontal rule. */
  children?: React.ReactNode
}