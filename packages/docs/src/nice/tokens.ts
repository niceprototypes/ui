import { getToken as getCoreToken, setTokens } from "@niceprototypes/styles"
import { TOKENS as THEME_TOKENS } from "@niceprototypes/storybook-theme"

/**
 * Storybook-local token overrides.
 *
 * Imported by `.storybook/preview.tsx` and `.storybook/manager.js` for the side effect — `setTokens`
 * registers the overrides and injects the CSS at module load. The one call
 * includes @niceprototypes/storybook-theme's tokens; the app's own entries come last, so
 * they can override a theme value. Read storybook-local tokens through the
 * exported `getToken`, which is typed for this map.
 */
export const AppTokenMap = {
  // LifecycleStory step durations; a step picks a variant by name.
  lifecycleStep: {
    base: "1200ms",
    long: "2000ms",
  },
  docs: {
    // The docs text column (component docs sections, token tables), centred; Atlassian's measure.
    columnWidth: "756px",
    // The Contents column beside a component docs page (ComponentDocs) and the Contents story.
    contentsWidth: "200px",
    // The settings column right of Contents (DocsPage), holding the theme switch (ThemeToggle).
    settingsWidth: "80px",
    // The width a ScaledPreview lays its demo out at (a laptop screen), before scaling it to its column.
    previewWidth: "1440px",
    // A ScaledPreview's zoom under the pointer and on keyboard focus, hinting that it opens larger.
    previewHoverScale: "1.02",
    // The fixed storybook-navigation bar's height at laptop+ (its ReservedSpaceStyle): docs
    // sections scroll to just below it.
    barHeight: `calc(${getCoreToken("gap", "large")} * 2 + ${getCoreToken("size", "small")})`,
    // DocsColumns' gutter between the prose column and the code column (Stripe's API reference: 42px).
    gutter: getCoreToken("gap", "larger"),
    // A section tile's inset from the grid lines (DocsPage): its content, and every rule inside it,
    // sit this far in; the rules between tiles run line to line.
    tilePadding: { "phone+": getCoreToken("gap", "large"), "laptop+": getCoreToken("gap", "larger") },
    // A tile's text measure, as the tile sets it for what is inside (its full width unless capped).
    tileMeasure: "100cqi",
    // The page's grid lines: the nav's end edge, the Contents column's start edge, the band's bottom.
    gridLineWidth: getCoreToken("borderWidth", "small"),
    gridLineColor: getCoreToken("borderColor", "subtle"),
    // DocsRule (section and subsection rules) and the parameter list's rules.
    ruleWidth: getCoreToken("borderWidth", "small"),
    ruleColor: getCoreToken("borderColor"),
    // Every active or selected state on the docs site: the link purple of each theme.
    activeColor: getCoreToken("color", "link"),
    // A panel a step off the page (code, previews, callouts), Stripe's ladder: the sunken grey by
    // day, where base and raised are both white; the raised step at night, lighter than the page.
    panelBackgroundColor: {
      day: getCoreToken("backgroundColor", "sunken", { theme: "day" }),
      night: getCoreToken("backgroundColor", "raised", { theme: "night" }),
    },
    // A panel's header bar (a callout's title): the panel's grey by day, under its rule; the overlay step at night.
    panelHeaderBackgroundColor: {
      day: getCoreToken("backgroundColor", "sunken", { theme: "day" }),
      night: getCoreToken("backgroundColor", "overlay", { theme: "night" }),
    },
    // Selected text: the active colour, stronger than the sidebar tint so a selection reads on text.
    selectionColor: {
      day: getCoreToken("color", "link", { theme: "day", transform: [null, null, null, "*0.25"] }),
      night: getCoreToken("color", "link", { theme: "night", transform: [null, null, null, "*0.4"] }),
    },
  },
  // DocsColumns' column widths from laptop up, main then aside, by `split`: equal (Stripe's API
  // reference, 1:1), or the aside or the main column given the larger share (2:3).
  docsColumnsSplit: {
    even: "minmax(0, 1fr) minmax(0, 1fr)",
    wideAside: "minmax(0, 2fr) minmax(0, 3fr)",
    wideMain: "minmax(0, 3fr) minmax(0, 2fr)",
  },
  // Contents sticks a large gap below the navigation bar.
  contents: {
    top: `calc(${getCoreToken("gap", "large")} * 3 + ${getCoreToken("size", "small")})`,
  },
  backgroundColor: {
    dark: {
      day: getCoreToken("backgroundColor", "base", { theme: "day" }),
      night: getCoreToken("backgroundColor", "base", { theme: "night" }),
    }
  },
  fontFamily: {
    base: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif",
    heading:
      "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif",
    demo: "'Crimson Pro', serif",
  },
  fontSize: {
    larger: "40px",
    // large: "22px",
  },
  icon: {
    size: {
      // smaller: "12px",
      // small: "16px",
      // base: "11px",
      // larger: "32px",
    },
  },
  button: {
    // Component-token override (--np--button--icon--size). Resizes button icons
    // only, independent of the global --np--icon--size.
    icon: {
      size: "10px",
    },
  },
  color: {
    light: {
      day: "hsla(210, 5%, 25%, 1)",
      night: "hsla(210, 5%, 95%, 0.85)",
    },
    lighter: {
      day: "hsla(210, 5%, 50%, 1)",
      night: "hsla(210, 5%, 95%, 0.55)",
    },
  },
} as const

/** A LifecycleStory step duration — a `lifecycleStep` token variant. */
export type LifecycleStepVariant = keyof (typeof AppTokenMap)["lifecycleStep"]

export const getToken = setTokens({ ...THEME_TOKENS, ...AppTokenMap })
