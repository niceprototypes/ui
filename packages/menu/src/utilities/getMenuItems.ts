/** Every item role a menu owns; checkbox and radio items join keyboard travel when added. */
const ITEM_SELECTOR = '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]'

/**
 * The enabled items of `menu`, in DOM order: the list keyboard travel, typeahead and autofocus
 * count in. Items of a menu nested inside it (a future submenu) belong to that menu and are left out.
 *
 * @param menu - The `role="menu"` element
 * @returns Its enabled items
 */
export function getMenuItems(menu: HTMLElement | null): HTMLElement[] {
  if (!menu) return []
  return Array.from(menu.querySelectorAll<HTMLElement>(ITEM_SELECTOR)).filter(
    item => item.getAttribute("aria-disabled") !== "true" && item.closest('[role="menu"]') === menu
  )
}
