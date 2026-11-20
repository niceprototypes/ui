import * as React from "react"
import Flex from "@niceprototypes/flex"
import Flow from "@niceprototypes/flow"
import Ink from "../../../nice/Ink"
import RepoLink from "../../RepoLink"
import PackageInstall from "../../PackageInstall"
import { reposOf } from "../../../data/repos"
import type { StoryHeaderProps } from "./StoryHeader.types"
import { StoryHeaderLevel } from "./StoryHeaderLevel"

/**
 * Story header — renders the `title` as an `<h1>` (`<h2>` inside a ComponentDocs section), an optional `description`
 * paragraph, an optional row of repo links for `packageName` (with `install`, its own repo as one PackageInstall row),
 * then any `children`, in a Flow column. Inserted at the top of every docs page.
 *
 * A page's first section heading is not part of the header: render it as an
 * `<Ink as="h2">` directly after `<StoryHeader />`.
 */
const StoryHeader: React.FC<StoryHeaderProps> = ({
  title,
  description,
  packageName,
  install = false,
  children,
}) => {
  const repos = packageName ? reposOf(packageName) : []
  const [own, ...related] = repos
  return (
    <Flow>
      <Ink as={React.useContext(StoryHeaderLevel)}>{title}</Ink>
      {description ? <Ink as="p">{description}</Ink> : null}
      {repos.length ? (
        <Flex
          gap="base"
          wrap="wrap"
          alignItems="center"
        >
          {install ? <PackageInstall repo={own} /> : null}
          {(install ? related : repos).map(repo => (
            <RepoLink
              key={repo.url}
              repo={repo}
            />
          ))}
        </Flex>
      ) : null}
      {children}
    </Flow>
  )
}

export default StoryHeader
