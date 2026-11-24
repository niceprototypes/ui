import * as React from "react"
import Button from "@niceprototypes/button"
import { applyTheme, type ThemeName } from "@niceprototypes/styles"

/** The theme on `<html data-theme>`, which the site's theme bootstrap (config-vite niceThemeBootstrap) sets before first paint. */
const readTheme = (): ThemeName => (document.documentElement.getAttribute("data-theme") === "night" ? "night" : "day")

/**
 * ThemeToggle
 *
 * The day/night switch: one icon button showing the theme it switches to, a sun at night in the
 * primary text colour, a moon by day in the muted text colour that takes the primary colour under
 * the pointer and on focus. Named by its action ("Switch to light", "Switch to dark"), so it
 * carries no pressed state. It writes `<html data-theme>`
 * through `applyTheme`, which flips every token, and stores the choice under the key the theme
 * bootstrap names on `<html data-theme-storage>`, so it survives reloads (no key, no storing).
 */
const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = React.useState(readTheme)
  const night = theme === "night"
  return (
    <Button
      size="small"
      iconLeft={night ? "sun" : "moon"}
      iconColor={night ? "color" : { rest: "color:lighter", hover: "color", focus: "color", active: "color" }}
      ghost={{ rest: true, hover: true, active: true }}
      aria-label={night ? "Switch to light" : "Switch to dark"}
      onClick={() => {
        const next = night ? "day" : "night"
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
    />
  )
}

export default ThemeToggle
