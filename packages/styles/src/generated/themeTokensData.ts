/**
 * Auto-generated from src/tokens/modules/*.json ($themes) — do not edit by hand.
 * Regenerate: npm run build:tokens
 */

export type TokenDefinition = Record<string, string>

export type ThemeTokensData = Record<string, Record<string, TokenDefinition>>

const themeTokensData: ThemeTokensData = {
  "day": {
    "backgroundColor": {
      "base": "hsla(212, 10%, 100%, 1)",
      "raised": "hsla(212, 10%, 100%, 1)",
      "sunken": "hsla(212, 10%, 95%, 1)",
      "overlay": "hsla(212, 10%, 100%, 1)",
      "success": "hsla(146, 60%, 97%, 1)",
      "highlight": "hsla(55, 100%, 97%, 1)",
      "warning": "hsla(29, 100%, 94%, 1)",
      "error": "hsla(10, 100%, 95%, 1)",
      "link": "hsla(245, 100%, 95%, 1)"
    },
    "borderColor": {
      "base": "hsla(240, 9%, 91%, 1)",
      "subtle": "hsla(240, 9%, 95%, 1)",
      "strong": "hsla(210, 8%, 58%, 1)",
      "stronger": "hsla(210, 10%, 20%, 1)",
      "success": "hsla(146, 55%, 88%, 1)",
      "highlight": "hsla(48, 90%, 83%, 1)",
      "warning": "hsla(29, 100%, 82%, 1)",
      "error": "hsla(10, 100%, 85%, 1)",
      "link": "hsla(245, 100%, 85%, 1)"
    },
    "color": {
      "base": "hsla(210, 5%, 5%, 1)",
      "light": "hsla(210, 5%, 25%, 1)",
      "lighter": "hsla(210, 5%, 50%, 1)",
      "lightest": "hsla(210, 5%, 75%, 1)",
      "disabled": "hsla(210, 5%, 5%, 0.6)",
      "link": "hsla(245, 100%, 59.8%, 1)",
      "success": "hsla(146, 68%, 44%, 1)",
      "highlight": "hsla(48, 95%, 50%, 1)",
      "warning": "hsla(29, 98%, 62%, 1)",
      "error": "hsla(10, 92%, 63%, 1)"
    },
    "focusRing": {
      "width": "var(--np--border-width--large)",
      "color": "var(--np--color--link--day)",
      "offset": "var(--np--gap--smaller)"
    },
    "strokeWidthScale": {
      "base": "1"
    }
  },
  "night": {
    "backgroundColor": {
      "base": "hsla(260, 12.5%, 9.4%, 1)",
      "raised": "hsla(260, 9.5%, 13%, 1)",
      "sunken": "hsla(260, 22.3%, 4.9%, 1)",
      "overlay": "hsla(260, 8%, 15.9%, 1)",
      "success": "hsla(146, 45%, 18%, 1)",
      "highlight": "hsla(48, 55%, 22%, 1)",
      "warning": "hsla(29, 60%, 18%, 1)",
      "error": "hsla(10, 55%, 20%, 1)",
      "link": "hsla(245, 50%, 18%, 1)"
    },
    "borderColor": {
      "base": "hsla(259, 5.9%, 22.9%, 1)",
      "subtle": "hsla(260, 7.4%, 17.3%, 1)",
      "strong": "hsla(259, 3.3%, 46.5%, 1)",
      "stronger": "hsla(240, 5%, 100%, 1)",
      "success": "hsla(146, 50%, 32%, 1)",
      "highlight": "hsla(48, 60%, 40%, 1)",
      "warning": "hsla(29, 65%, 32%, 1)",
      "error": "hsla(10, 60%, 34%, 1)",
      "link": "hsla(245, 60%, 32%, 1)"
    },
    "color": {
      "base": "hsla(210, 5%, 95%, 1)",
      "light": "hsla(210, 5%, 95%, 0.85)",
      "lighter": "hsla(210, 5%, 95%, 0.55)",
      "lightest": "hsla(210, 5%, 95%, 0.25)",
      "disabled": "hsla(210, 5%, 95%, 0.6)",
      "link": "hsla(245, 91.4%, 77.3%, 1)",
      "success": "hsla(146, 59%, 48%, 1)",
      "highlight": "hsla(48, 90%, 65%, 1)",
      "warning": "hsla(29, 100%, 63%, 1)",
      "error": "hsla(10, 89%, 61%, 1)"
    },
    "focusRing": {
      "color": "var(--np--color--link--night)"
    },
    "strokeWidthScale": {
      "base": "0.9"
    }
  }
} as const

export default themeTokensData