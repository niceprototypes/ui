import * as React from "react"
import Button from "@niceprototypes/button"
import Popover from "@niceprototypes/popover"
import { StyledMenuButtonTrigger } from "./MenuButton.styles"
import type { MenuButtonItemType, MenuButtonProps } from "./MenuButton.types"
import BaseMenu from "../Menu/Menu"
import BaseMenuItem from "../MenuItem/MenuItem"
import BaseMenuGroup from "../MenuGroup/MenuGroup"
import MenuSeparator from "../MenuSeparator/MenuSeparator"
import type { MenuAutoFocusType } from "../Menu/Menu.types"
import { getMenuItems } from "../../utilities/getMenuItems"

/**
 * MenuButton
 *
 * The WAI-ARIA menu button pattern: a Button (`aria-haspopup="menu"`, `aria-expanded`) that opens
 * a Menu of `items` in a Popover beside it, flipped and shifted to stay in the viewport. A press,
 * Enter, Space or ArrowDown opens it on the first enabled item; ArrowUp on the last. Choosing an
 * item closes the menu, returns focus to the trigger, then runs the item's `onSelect`; Escape and
 * Tab close it and return focus too, and a press outside closes it. Without a `label` the trigger
 * shows only its icon ("menu" by default) and takes its name from `aria-label`. With
 * `appearance="select"` it looks like a select field: label or placeholder, then a caret. Open
 * state is controlled (`open` + `onOpenChange`) or its own.
 *
 * @example
 * ```tsx
 * <MenuButton
 *   aria-label="Row actions"
 *   align="end"
 *   items={[
 *     { id: "edit", label: "Edit", icon: "edit", onSelect: edit },
 *     { type: "separator", id: "danger" },
 *     { id: "delete", label: "Delete", icon: "trash", onSelect: remove },
 *   ]}
 * />
 * ```
 */
const MenuButton: React.FC<MenuButtonProps> = props => {
  const {
    items,
    label,
    icon,
    appearance = "button",
    placeholder,
    ghost = false,
    size = "base",
    disabled = false,
    open: openProp,
    onOpenChange,
    position = "bottom",
    align = "start",
    ref,
    theme,
  } = props
  const ariaLabel = "aria-label" in props ? props["aria-label"] : undefined
  const triggerId = React.useId()
  const menuId = React.useId()
  const triggerRef = React.useRef<HTMLButtonElement | null>(null)

  const [internalOpen, setInternalOpen] = React.useState(false)
  const open = (openProp ?? internalOpen) && !disabled
  // The open state as last asked for, so two requests in one event (a choice, then the menu's own
  // close) report once.
  const openRef = React.useRef(open)
  openRef.current = open

  // The item focused when the menu mounts; unset when the `open` prop opened it, so a controlled
  // open does not take focus from the page.
  const [focusEdge, setFocusEdge] = React.useState<MenuAutoFocusType | undefined>(undefined)

  const setOpen = (next: boolean, edge?: MenuAutoFocusType) => {
    if (next === openRef.current) return
    openRef.current = next
    setFocusEdge(next ? edge : undefined)
    if (openProp === undefined) setInternalOpen(next)
    onOpenChange?.(next)
  }

  // Close and give focus back to the trigger (choice, Escape, Tab).
  const close = () => {
    setOpen(false)
    triggerRef.current?.focus()
  }

  const setTriggerNode = React.useCallback(
    (node: HTMLButtonElement | null) => {
      triggerRef.current = node
      if (typeof ref === "function") ref(node)
      else if (ref) ref.current = node
    },
    [ref]
  )

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (disabled || (event.key !== "ArrowDown" && event.key !== "ArrowUp")) return
    event.preventDefault()
    const edge: MenuAutoFocusType = event.key === "ArrowUp" ? "last" : "first"
    if (!open) {
      setOpen(true, edge)
      return
    }
    // Already open (by the `open` prop): move into it.
    const menuItems = getMenuItems(document.getElementById(menuId))
    menuItems[edge === "first" ? 0 : menuItems.length - 1]?.focus()
  }

  const renderItem = (item: MenuButtonItemType) => (
    <BaseMenuItem
      key={item.id}
      icon={item.icon}
      disabled={item.disabled}
      onSelect={() => {
        close()
        item.onSelect()
      }}
    >
      {item.label}
    </BaseMenuItem>
  )

  const select = appearance === "select"
  const showsPlaceholder = select && label === undefined && placeholder !== undefined

  return (
    <>
      <StyledMenuButtonTrigger onKeyDown={handleTriggerKeyDown}>
        <Button
          ref={setTriggerNode}
          id={triggerId}
          size={size}
          ghost={ghost}
          disabled={disabled}
          theme={theme}
          iconLeft={icon ?? (label === undefined && !select ? "menu" : undefined)}
          iconRight={select ? "carat-bottom" : undefined}
          justifyContent={select ? "space-between" : undefined}
          color={showsPlaceholder && !disabled ? "color:lighter" : undefined}
          aria-label={ariaLabel}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={open ? menuId : undefined}
          onClick={() => setOpen(!openRef.current, "first")}
        >
          {label ?? (select ? placeholder : undefined)}
        </Button>
      </StyledMenuButtonTrigger>
      <Popover
        open={open}
        onOpenChange={next => {
          if (!next) setOpen(false)
        }}
        anchorRef={triggerRef}
        position={position}
        align={align}
        role="none"
        theme={theme}
      >
        <BaseMenu id={menuId} aria-labelledby={triggerId} autoFocus={focusEdge} onClose={close}>
          {items.map(entry => {
            if (entry.type === "separator") return <MenuSeparator key={entry.id} />
            if (entry.type === "group") {
              return (
                <BaseMenuGroup key={entry.id} label={entry.label}>
                  {entry.items.map(renderItem)}
                </BaseMenuGroup>
              )
            }
            return renderItem(entry)
          })}
        </BaseMenu>
      </Popover>
    </>
  )
}

export default MenuButton
