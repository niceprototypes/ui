import * as React from "react"
import Flex from "@niceprototypes/flex"
import Icon from "@niceprototypes/icon"
import Install from "../Install"
import type { Repo } from "../RepoLink"
import { Anchor, LicenseFlex, LicenseInk } from "../RepoLink/RepoLink.styles"

/**
 * PackageInstall
 *
 * A package's source and install in one row: the GitHub icon linking to its repo, the
 * install command as the copyable Code chip (the one place the package name shows), and
 * its license tag. Wraps at phone width.
 */
const PackageInstall: React.FC<{ repo: Repo }> = ({ repo }) => (
  <Flex gap="small" alignItems="center" wrap="wrap">
    <Anchor href={repo.url} target="_blank" rel="noopener noreferrer" aria-label={`${repo.name} on GitHub`}>
      <Icon name="github" size="base" color="link" />
    </Anchor>
    <Install package={repo.name.replace("@niceprototypes/", "")} />
    <LicenseFlex padding="none smaller">
      <LicenseInk code size="small" color="lighter">
        {repo.license}
      </LicenseInk>
    </LicenseFlex>
  </Flex>
)

export default PackageInstall
