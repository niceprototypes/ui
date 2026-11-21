/**
 * Auto-generated from src/tokens/modules/*.json ($inverse) — do not edit by hand.
 * Regenerate: npm run build:tokens
 */

export type TokenDefinition = Record<string, string>

export type InverseTokensData = Record<string, { day: TokenDefinition; night: TokenDefinition }>

const inverseTokensData: InverseTokensData = {
  "backgroundColor": {
    "day": {
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
    "night": {
      "base": "hsla(212, 5%, 100%, 1)",
      "raised": "hsla(212, 5%, 100%, 1)",
      "sunken": "hsla(212, 5%, 95%, 1)",
      "overlay": "hsla(212, 5%, 100%, 1)",
      "success": "hsla(146, 60%, 92%, 1)",
      "highlight": "hsla(48, 100%, 80%, 1)",
      "warning": "hsla(29, 90%, 92%, 1)",
      "error": "hsla(10, 85%, 93%, 1)",
      "link": "hsla(245, 70%, 92%, 1)"
    }
  },
  "borderColor": {
    "day": {
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
    "night": {
      "base": "hsla(240, 5%, 91%, 1)",
      "subtle": "hsla(240, 5%, 95%, 1)",
      "strong": "hsla(210, 5%, 58%, 1)",
      "stronger": "hsla(210, 5%, 20%, 1)",
      "success": "hsla(146, 45%, 86%, 1)",
      "highlight": "hsla(48, 75%, 80%, 1)",
      "warning": "hsla(29, 90%, 80%, 1)",
      "error": "hsla(10, 85%, 83%, 1)",
      "link": "hsla(245, 70%, 83%, 1)"
    }
  },
  "color": {
    "day": {
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
    "night": {
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
    }
  },
  "focusRing": {
    "day": {
      "color": "var(--np--color--link--day--inverse)"
    },
    "night": {
      "color": "var(--np--color--link--night--inverse)"
    }
  }
} as const

export default inverseTokensData