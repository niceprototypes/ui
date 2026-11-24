import { setTokens } from "@niceprototypes/styles"
import { DocsSiteTokenMap } from "@niceprototypes/docs/nice/siteTokens"

/**
 * The site's one unprefixed token map: the docs site map (Storybook theme, docs tokens, docs shell
 * overrides), then this site's own entries, registered last.
 */
export const getToken = setTokens({
  ...DocsSiteTokenMap,
  // Scroll / Page behaviour: the room each fade line has, so it enters and leaves the view.
  pageBehaviour: { room: "60vh" },
  // Code takes Adobe Fonts' Antarctican Mono (its kit is linked in index.html).
  fontFamily: { ...DocsSiteTokenMap.fontFamily, code: '"antarctican-mono", sans-serif' },
})
