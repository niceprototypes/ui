import * as React from "react"
import Toggle from "@niceprototypes/toggle"
import { applyTheme, type ThemeName } from "@niceprototypes/styles"
import { StyledThemeToggleLabel } from "./ThemeToggle.styles"

/** Where the reader's choice is kept; index.html reads it before first paint (night when absent). */
const STORAGE_KEY = "nice-docs-theme"

/** The theme on `<html data-theme>`, which index.html sets before first paint. */
const readTheme = (): ThemeName => (document.documentElement.getAttribute("data-theme") === "night" ? "night" : "day")

/**
 * ThemeToggle
 *
 * The day/night switch: on is night. It writes `<html data-theme>` through `applyTheme`, which
 * flips every token, and stores the choice so it survives reloads.
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
        try {
          localStorage.setItem(STORAGE_KEY, next)
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
