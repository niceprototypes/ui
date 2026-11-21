import { getToken as getCoreToken, setTokens } from "@niceprototypes/styles"
import { TOKENS as THEME_TOKENS } from "@niceprototypes/storybook-theme"
import { AppTokenMap } from "@niceprototypes/docs/nice/tokens"

/**
 * The site's one unprefixed token map. A second unprefixed `setTokens` call replaces the first's
 * stylesheet, so this map is the Storybook's (which the reused Storybook modules read, and which
 * their own module registers on import) plus the site's overrides, registered last.
 */
export const getToken = setTokens({
  ...THEME_TOKENS,
  ...AppTokenMap,
  // DocsPage's columns: the gap between them, and the settings column right of Contents, as wide as its Dark toggle.
  docs: { ...AppTokenMap.docs, columnGap: getCoreToken("gap", "larger"), settingsWidth: "80px" },
  // Scroll / Page behaviour: the room each fade line has, so it enters and leaves the view.
  pageBehaviour: { room: "60vh" },
  // Contents sticks one page padding below the top of the scrolling page (no navigation bar here);
  // its active row, like every active or selected state on the site, takes the docs active colour.
  contents: {
    top: getCoreToken("gap", "large"),
    color: { active: AppTokenMap.docs.activeColor },
    indicator: { color: AppTokenMap.docs.activeColor },
  },
  // The sidebar's active path, the selected tab and its indicator, and every focus ring: the docs active colour.
  // The sidebar's active page row: the active colour as text only, on no background.
  tree: { activeColor: AppTokenMap.docs.activeColor },
  tabs: { color: { selected: AppTokenMap.docs.activeColor }, indicator: { color: AppTokenMap.docs.activeColor } },
  focusRing: { color: AppTokenMap.docs.activeColor },
  // One scale at every breakpoint, base 14 to larger 48: base to larger grows by one ratio each
  // step (√(48/14) ≈ 1.85, large rounded to 26), and below base the steps go down 1px each, since
  // the same ratio downward would make them unreadable.
  fontSize: { smaller: "12px", small: "13px", base: "14px", large: "26px", larger: "48px" },
  // Code blocks: a docs panel (a step off the page in both themes) ruled like the docs rules, no shadow.
  code: {
    backgroundColor: { base: AppTokenMap.docs.panelBackgroundColor },
    borderColor: { base: AppTokenMap.docs.ruleColor },
    boxShadow: { base: "none" },
  },
  // Code takes Adobe Fonts' Antarctican Mono (its kit is linked in index.html).
  fontFamily: { ...AppTokenMap.fontFamily, code: '"antarctican-mono", sans-serif' },
})
