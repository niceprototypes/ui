import * as React from "react"
import Button from "@niceprototypes/button"
import Popover from "@niceprototypes/popover"
import { StyledDataTableMenu } from "./DataTable.styles"
import type { DataTableActionType } from "./DataTable.types"

/**
 * An actions menu on the WAI-ARIA menu button pattern: a Button (`aria-haspopup="menu"`) opens a
 * Popover with `role="menu"` holding one `menuitem` Button per action. Opening focuses the first
 * enabled item; Up/Down/Home/End move between items; Enter or Space runs one and closes the menu;
 * Escape, Tab or a click outside closes it, and focus returns to the button. With `label`, the
 * button shows it as text; without, the menu icon.
 */
const DataTableMenu = ({
  actions,
  "aria-label": ariaLabel,
  label,
}: {
  actions: ReadonlyArray<DataTableActionType>
  "aria-label": string
  label?: string
}) => {
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLButtonElement>(null)
  const menuRef = React.useRef<HTMLDivElement>(null)
  const menuId = React.useId()

  const items = () => Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not(:disabled)') ?? [])

  // Focus the first enabled item on open. Popover shows itself after placing, and the items fade
  // in with it, so focus is retried each frame until it lands (a hidden element cannot take it).
  React.useEffect(() => {
    if (!open) return
    let frame = 0
    let tries = 0
    const focusFirst = () => {
      const first = items()[0]
      first?.focus()
      if (first && document.activeElement !== first && ++tries < 60) frame = requestAnimationFrame(focusFirst)
    }
    frame = requestAnimationFrame(focusFirst)
    return () => cancelAnimationFrame(frame)
  }, [open])

  const close = () => {
    setOpen(false)
    anchorRef.current?.focus()
  }

  const choose = (action: DataTableActionType) => {
    if (action.disabled) return
    close()
    action.onSelect()
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const list = items()
    const index = list.indexOf(document.activeElement as HTMLElement)
    const next = {
      ArrowDown: list[(index + 1) % list.length],
      ArrowUp: list[(index - 1 + list.length) % list.length],
      Home: list[0],
      End: list[list.length - 1],
    }[event.key]
    if (next) {
      event.preventDefault()
      next.focus()
    } else if (event.key === "Tab") {
      event.preventDefault()
      close()
    }
  }

  return (
    <>
      <Button
        ref={anchorRef}
        size="smaller"
        ghost
        iconLeft={label ? undefined : "menu"}
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen(current => !current)}
      >
        {label}
      </Button>
      <Popover
        open={open}
        onOpenChange={setOpen}
        anchorRef={anchorRef}
        align="end"
        role="menu"
        id={menuId}
        aria-label={ariaLabel}
        ref={menuRef}
      >
        <StyledDataTableMenu role="none" onKeyDown={onKeyDown}>
          {actions.map(action => (
            <Button
              key={action.id}
              role="menuitem"
              tabIndex={-1}
              size="small"
              ghost
              justifyContent="flex-start"
              disabled={action.disabled}
              onClick={() => choose(action)}
            >
              {action.label}
            </Button>
          ))}
        </StyledDataTableMenu>
      </Popover>
    </>
  )
}

export default DataTableMenu
