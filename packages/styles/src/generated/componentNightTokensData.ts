/**
 * Auto-generated from src/tokens/components/*.json ($themes.night) — do not edit by hand.
 * Regenerate: npm run build:tokens
 */

import type { ComponentTokenNode } from './componentTokensData.js'

export type ComponentNightTokensData = Record<string, { [key: string]: ComponentTokenNode }>

const componentNightTokensData: ComponentNightTokensData = {
  "app": {
    "search": {
      "backgroundColor": {
        "base": "var(--np--background-color--raised)"
      }
    }
  },
  "badge": {
    "color": {
      "success": "color-mix(in oklab, var(--np--color--success), var(--np--color) 20%)",
      "warning": "color-mix(in oklab, var(--np--color--warning), var(--np--color) 20%)",
      "error": "color-mix(in oklab, var(--np--color--error), var(--np--color) 20%)"
    }
  },
  "button": {},
  "calendar": {},
  "card": {
    "filled": {
      "backgroundColor": {
        "base": "var(--np--background-color--raised)"
      }
    }
  },
  "chat": {
    "message": {
      "backgroundColor": {
        "user": "var(--np--background-color--raised)"
      }
    }
  },
  "checkbox": {},
  "code": {
    "syntaxColor": {
      "neutral": "hsla(225, 4%, 82%, 1)",
      "green": "hsla(155, 64%, 69%, 1)",
      "cyan": "hsla(195, 69%, 77%, 1)",
      "blue": "hsla(216, 85%, 76%, 1)",
      "purple": "hsla(278, 84%, 80%, 1)"
    }
  },
  "contents": {},
  "datatable": {},
  "dialog": {},
  "field": {},
  "icon": {},
  "image": {},
  "ink": {},
  "input": {
    "filled": {
      "backgroundColor": {
        "base": "var(--np--background-color--raised)"
      }
    }
  },
  "lightbox": {},
  "line": {},
  "list": {},
  "listbox": {},
  "logo": {
    "color": {
      "base": "var(--np--color--night)"
    }
  },
  "menu": {},
  "popover": {},
  "radio": {},
  "select": {},
  "table": {
    "borderColor": {
      "row": "var(--np--border-color--subtle)"
    }
  },
  "tabs": {},
  "tile": {},
  "toggle": {},
  "tooltip": {},
  "tree": {}
} as const

export default componentNightTokensData