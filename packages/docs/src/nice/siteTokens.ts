import { getToken as getCoreToken } from "@niceprototypes/styles"
import { TOKENS as THEME_TOKENS } from "@niceprototypes/storybook-theme"
import { AppTokenMap } from "./tokens"

/**
 * A docs site's token map (DocsApp), for the site's one unprefixed `setTokens` call: the Storybook
 * theme's tokens, the docs tokens (AppTokenMap), then the docs shell's overrides. A second
 * unprefixed `setTokens` call replaces the first's stylesheet, so a site spreads this map into its
 * own call and adds its own entries last.
 */
export const DocsSiteTokenMap = {
  ...THEME_TOKENS,
  ...AppTokenMap,
  // Contents sticks one page padding below the top of the scrolling page (no navigation bar here);
  // its active row, like every active or selected state on the site, takes the docs active colour.
  contents: {
    top: getCoreToken("gap", "large"),
    // The Contents column takes the nav's colours and weights: muted rows, the label colour on
    // hover, the active colour (and indicator) for the section in view.
    color: {
      base: getCoreToken("tree.inactive.color"),
      hover: getCoreToken("tree.color", "base"),
      active: getCoreToken("tree.activeColor"),
    },
    fontWeight: { base: getCoreToken("tree.fontWeight", "base"), active: getCoreToken("tree.fontWeight", "active") },
    // Its rail lies on the column's grid line (DocsPage) and is the line's width, invisible, so the
    // indicator slides along the line; labels keep their offset from it.
    rail: { width: AppTokenMap.docs.gridLineWidth, color: "transparent" },
    indicator: { color: getCoreToken("tree.activeColor"), width: AppTokenMap.docs.gridLineWidth },
    item: { paddingInline: `calc(${getCoreToken("gap")} + ${getCoreToken("gap", "small")})` },
  },
  // The App screen: no inset across (each DocsPage tile insets itself); the nav's and the end
  // column's (Contents, settings) rules are the page's grid lines; the end column fits Contents
  // and the settings.
  app: {
    docs: { paddingInline: { base: getCoreToken("gap", "none") } },
    sidebar: { rule: { width: { base: AppTokenMap.docs.gridLineWidth }, color: { base: AppTokenMap.docs.gridLineColor } } },
    panel: { rule: { width: { base: AppTokenMap.docs.gridLineWidth }, color: { base: AppTokenMap.docs.gridLineColor } } },
    end: {
      width: { base: `calc(${AppTokenMap.docs.contentsWidth} + ${AppTokenMap.docs.settingsWidth} + ${getCoreToken("gap")} * 2)` },
    },
  },
  // The sidebar's active path, the selected tab and its indicator, and every focus ring: the docs active colour.
  // The sidebar's active page row: the active colour as text only, on no background.
  // The sidebar's rows: a line height of 2 (no core step is 2), labels at the normal weight, the
  // active row's at medium.
  tree: {
    activeColor: AppTokenMap.docs.activeColor,
    lineHeight: { base: "2" },
    fontWeight: { base: getCoreToken("fontWeight", "base"), active: getCoreToken("fontWeight", "medium") },
  },
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
}
