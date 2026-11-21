/**
 * Minimal DOM stub for runtime CSS injection tests.
 *
 * `injectTokenCSS` and `injectBreakpointCss` look up `<style data-…>` elements
 * with `document.querySelector`, create them with `document.createElement`, and
 * append or insert them into `document.head`. This stub records each element by
 * its data attribute and its `<head>` position so tests can read the injected
 * stylesheet text and order.
 */

/**
 * Stand-in for a `<style>` element: only the members the injectors touch.
 * Installed as the global `HTMLStyleElement` so the breakpoint injector's
 * `instanceof HTMLStyleElement` check accepts it.
 */
class StubStyleElement {
  /** Name of the data attribute set on it (`data-nice-tokens`); the value is ignored */
  attribute: string | null = null
  /** The injected CSS, read back by `stylesheetText` */
  textContent = ''
  /**
   * Record the attribute name — the only part the lookup uses.
   *
   * @param name - Attribute name
   */
  setAttribute(name: string): void {
    this.attribute = name
  }
}

/** Injected `<style>` elements keyed by data attribute (e.g. `data-nice-tokens`). */
const elements = new Map<string, StubStyleElement>()

/** The `<head>` children in document order, read by `stylesheetOrder`. */
const headChildren: StubStyleElement[] = []

/**
 * Place an element in `headChildren` before `reference` (at the end when null), moving it if it
 * is already there, and register it under its data attribute — as `insertBefore` does.
 *
 * @param element - Element to place
 * @param reference - Element to place it before, or null to append
 */
function place(element: StubStyleElement, reference: StubStyleElement | null): void {
  const current = headChildren.indexOf(element)
  if (current !== -1) headChildren.splice(current, 1)
  const index = reference ? headChildren.indexOf(reference) : -1
  headChildren.splice(index === -1 ? headChildren.length : index, 0, element)
  elements.set(element.attribute ?? '', element)
}

/**
 * Install the stub on `globalThis`. Call before any injection runs: the
 * injectors check `typeof document` and cache their element on first use.
 */
export function installDomStub(): void {
  const globals = globalThis as Record<string, unknown>
  globals.HTMLStyleElement = StubStyleElement
  globals.document = {
    // Appending or inserting registers the element under its data attribute and records its position
    head: {
      appendChild: (element: StubStyleElement) => place(element, null),
      insertBefore: (element: StubStyleElement, reference: StubStyleElement | null) => place(element, reference),
    },
    // `style[data-nice-tokens]` → look up by the name inside the brackets
    querySelector: (selector: string) => elements.get(selector.match(/\[([^\]]+)\]/)?.[1] ?? '') ?? null,
    createElement: () => new StubStyleElement(),
  }
}

/**
 * Text of an injected stylesheet.
 *
 * @param attribute - Data attribute of the `<style>` element (e.g. `data-nice-breakpoints`)
 * @returns Its CSS text, or `''` when nothing was injected
 */
export function stylesheetText(attribute: string): string {
  return elements.get(attribute)?.textContent ?? ''
}

/**
 * Data attributes of the injected `<style>` elements in `<head>` order.
 *
 * @returns e.g. `['data-nice-breakpoints', 'data-nice-tokens']`
 */
export function stylesheetOrder(): string[] {
  return headChildren.map((element) => element.attribute ?? '')
}
