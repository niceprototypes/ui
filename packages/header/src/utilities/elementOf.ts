import type * as React from "react"

/**
 * The element an element-or-ref prop names.
 *
 * @param value - An element, a ref to one, or undefined
 * @returns The element, or null
 */
export const elementOf = (value: HTMLElement | React.RefObject<HTMLElement | null> | undefined): HTMLElement | null => {
  if (!value) return null
  return "current" in value ? value.current : value
}
