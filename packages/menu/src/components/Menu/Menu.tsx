import * as React from "react"
import { Theme } from "@niceprototypes/styles"
import { getListboxTypeaheadIndex, useListboxTypeahead } from "@niceprototypes/listbox"
import { StyledMenu } from "./Menu.styles"
import { MenuContext, type MenuContextType } from "./Menu.context"
import type { MenuProps } from "./Menu.types"
import { getMenuItems } from "../../utilities/getMenuItems"
import { focusWhenVisible } from "../../utilities/focusWhenVisible"

/**
 * Menu
 *
 * A WAI-ARIA menu (`role="menu"`) of commands: MenuItem, MenuGroup (labelled) and MenuSeparator
 * children. Focus roves over the items, one of them in the tab order (the menu itself until an
 * item has had focus). Up and Down move to the previous and next enabled item, wrapping; Home and
 * End to the first and last; a printable key to the next item whose label starts with the typed
 * text (WAI-ARIA typeahead); Enter or Space activates the focused item. Disabled items are shown
 * but skipped. It needs no trigger, so it can be embedded in a page; with `onClose` it is transient
 * (a menu button's popup, a context menu) and asks to close on activation, Escape and Tab.
 *
 * @example
 * ```tsx
 * <Menu aria-label="File">
 *   <MenuItem icon="plus" onSelect={create}>New</MenuItem>
 *   <MenuSeparator />
 *   <MenuGroup label="Export">
 *     <MenuItem onSelect={exportPng}>PNG</MenuItem>
 *     <MenuItem disabled>PDF</MenuItem>
 *   </MenuGroup>
 * </Menu>
 * ```
 */
const Menu: React.FC<MenuProps> = ({
  children,
  autoFocus,
  onClose,
  size = "base",
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ref,
  theme,
}) => {
  const menuRef = React.useRef<HTMLDivElement | null>(null)
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const typeahead = useListboxTypeahead()

  // Latest onClose, so the context value does not change with an inline callback.
  const onCloseRef = React.useRef(onClose)
  React.useEffect(() => {
    onCloseRef.current = onClose
  })

  const setMenuNode = React.useCallback(
    (node: HTMLDivElement | null) => {
      menuRef.current = node
      if (typeof ref === "function") ref(node)
      else if (ref) ref.current = node
    },
    [ref]
  )

  // Focus the first or last enabled item once on mount; with none, the menu itself, so Escape
  // and Tab still reach it.
  const initialAutoFocus = React.useRef(autoFocus)
  React.useEffect(() => {
    const edge = initialAutoFocus.current
    const menu = menuRef.current
    if (!edge || !menu) return
    const items = getMenuItems(menu)
    return focusWhenVisible((edge === "first" ? items[0] : items[items.length - 1]) ?? menu)
  }, [])

  // An active item that left the menu or became disabled hands the tab stop back to the menu.
  React.useEffect(() => {
    if (activeId === null) return
    const item = document.getElementById(activeId)
    if (!item || !menuRef.current?.contains(item) || item.getAttribute("aria-disabled") === "true") setActiveId(null)
  })

  const context = React.useMemo<MenuContextType>(
    () => ({ activeId, size, onItemSelect: () => onCloseRef.current?.("select") }),
    [activeId, size]
  )

  const handleFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    const menu = menuRef.current
    if (!menu) return
    // Tabbing onto the menu itself passes focus to its first enabled item.
    if (event.target === menu) {
      getMenuItems(menu)[0]?.focus()
      return
    }
    if (getMenuItems(menu).includes(event.target)) setActiveId(event.target.id)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const menu = menuRef.current
    const target = event.target as HTMLElement
    // Keys inside a nested menu (a future submenu) are that menu's.
    if (!menu || target.closest('[role="menu"]') !== menu) return
    const items = getMenuItems(menu)
    const index = items.indexOf(target)
    const count = items.length
    const { key, altKey, ctrlKey, metaKey } = event

    const search = (character: string) => {
      const query = typeahead.type(character)
      const options = items.map((item, itemIndex) => ({ value: String(itemIndex), label: item.textContent?.trim() ?? "" }))
      const match = getListboxTypeaheadIndex(options, query, index)
      if (match !== -1) items[match].focus()
    }

    switch (key) {
      case "ArrowDown":
      case "ArrowUp":
        event.preventDefault()
        if (!count) return
        if (index < 0) items[key === "ArrowDown" ? 0 : count - 1].focus()
        else items[(index + (key === "ArrowDown" ? 1 : -1) + count) % count].focus()
        return
      case "Home":
      case "End":
        event.preventDefault()
        items[key === "Home" ? 0 : count - 1]?.focus()
        return
      case "Enter":
        if (index < 0) return
        event.preventDefault()
        target.click()
        return
      case " ":
        event.preventDefault()
        // A space inside a typeahead run ("save as") is part of the search.
        if (typeahead.isTyping()) search(key)
        else if (index >= 0) target.click()
        return
      case "Escape":
        if (!onClose) return
        event.preventDefault()
        event.stopPropagation()
        onClose("escape")
        return
      case "Tab":
        if (!onClose) return
        event.preventDefault()
        onClose("tab")
        return
      default:
        if (key.length === 1 && !ctrlKey && !metaKey && !altKey) {
          event.preventDefault()
          search(key)
        }
    }
  }

  const menu = (
    <MenuContext.Provider value={context}>
      <StyledMenu
        ref={setMenuNode}
        id={id}
        role="menu"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        tabIndex={activeId === null ? 0 : -1}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        // A press between items keeps focus where it is.
        onMouseDown={event => {
          if (event.target === event.currentTarget) event.preventDefault()
        }}
      >
        {children}
      </StyledMenu>
    </MenuContext.Provider>
  )

  return theme ? <Theme name={theme}>{menu}</Theme> : menu
}

export default Menu
