/**
 * breakpointStyleSheet — Singleton style element for runtime breakpoint overrides.
 *
 * `setTokens({ breakpoints })` re-emits the breakpoint-token @media cascade with new thresholds.
 * The resulting CSS is injected into a single `<style data-nice-breakpoints>`
 * element in `<head>`. Subsequent calls replace its contents, so the
 * stylesheet always reflects the most recent override set.
 *
 * The cascade redeclares component aliases of breakpointed core tokens
 * (`--np--ink--font-size--large: var(--np--font-size--large)` at each floor), so
 * the element sits before `<style data-nice-tokens>`: a `setTokens` map's
 * overrides of those aliases win at every breakpoint, whichever call came first.
 *
 * SSR-safe: no-ops when `document` is unavailable.
 * HMR-safe: reuses any pre-existing element with the same data attribute.
 */

const STYLE_ATTR = 'data-nice-breakpoints'

/** The runtime token sheet (tokenStyleSheet.ts), which must come after this one. */
const TOKENS_ATTR = 'data-nice-tokens'

let styleElement: HTMLStyleElement | null = null

/**
 * Returns the shared breakpoint style element, creating it on first use.
 * Returns null in non-browser environments.
 */
function getStyleElement(): HTMLStyleElement | null {
  if (typeof document === 'undefined') return null

  if (!styleElement) {
    const existing = document.querySelector(`style[${STYLE_ATTR}]`)
    if (existing instanceof HTMLStyleElement) {
      styleElement = existing
    } else {
      const el = document.createElement('style')
      el.setAttribute(STYLE_ATTR, '')
      document.head.appendChild(el)
      styleElement = el
    }
  }

  return styleElement
}

/**
 * Replace the contents of the breakpoint override stylesheet.
 *
 * @param css - Complete CSS string (full @media blocks). Pass an empty string
 *   to clear any prior override.
 */
export function injectBreakpointCss(css: string): void {
  const el = getStyleElement()
  if (!el) return
  el.textContent = css
  // Before the token sheet when one exists (created by an earlier setTokens call, or reused across HMR)
  const tokens = document.querySelector(`style[${TOKENS_ATTR}]`)
  if (tokens) document.head.insertBefore(el, tokens)
}
