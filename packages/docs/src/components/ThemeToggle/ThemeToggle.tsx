import * as React from "react"
import Toggle from "@niceprototypes/toggle"
import { applyTheme, type ThemeName } from "@niceprototypes/styles"
import { StyledThemeToggleLabel } from "./ThemeToggle.styles"

/** The theme on `<html data-theme>`, which the site's theme bootstrap (config-vite niceThemeBootstrap) sets before first paint. */
const readTheme = (): ThemeName => (document.documentElement.getAttribute("data-theme") === "night" ? "night" : "day")

/**
 * ThemeToggle
 *
 * The day/night switch: on is night. It writes `<html data-theme>` through `applyTheme`, which
 * flips every token, and stores the choice under the key the theme bootstrap names on
 * `<html data-theme-storage>`, so it survives reloads (no key, no storing).
 */
const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = React.useState(readTheme)
  return (
    <Toggle
      size="small"
      checked={theme === "night"}
      onChange={checked => {
        const next = checked ? "night" : "day"
        applyTheme(next)
        setTheme(next)
        const storageKey = document.documentElement.getAttribute("data-theme-storage")
        if (!storageKey) return
        try {
          localStorage.setItem(storageKey, next)
        } catch {
          // Storage blocked: the choice lasts for this page only.
        }
      }}
    >
      <StyledThemeToggleLabel>Dark</StyledThemeToggleLabel>
    </Toggle>
  )
}

export default ThemeToggle
