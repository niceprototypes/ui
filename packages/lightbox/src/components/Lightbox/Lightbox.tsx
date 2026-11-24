import React, { useState, useEffect, useCallback, useRef } from "react"
import { createPortal } from "react-dom"
import Button from "@niceprototypes/button"
import LightboxCaption from "../LightboxCaption"
import { Trigger, Overlay, Image, Content, Close } from "./Lightbox.styles"
import type { LightboxProps } from "./Lightbox.types"

/**
 * Lightbox
 *
 * Wraps a trigger that opens `imageUrl` in a fullscreen modal dialog: a native `<dialog>` shown
 * with `showModal()`, so the page behind it is inert and focus stays inside. Escape and a click
 * outside the image and caption close it; focus then returns to the trigger. `open` controls it,
 * `onOpenChange` receives every requested change; without `open` it manages its own state.
 *
 * With `content` in place of an image, the overlay shows it at its real size, never scaled to the
 * viewport: larger than the screen, the overlay scrolls in both directions; a Close button sits in
 * its corner. The overlay fades in and out over the animation tokens (none under reduced motion).
 */
const Lightbox: React.FC<LightboxProps> = ({
  children,
  imageUrl,
  content,
  label,
  alt = "",
  title,
  description,
  open,
  onOpenChange,
  className,
  style,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : uncontrolledOpen
  const triggerRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  // The overlay stays rendered while it fades out after a close, then unmounts.
  const [rendered, setRendered] = useState(isOpen)
  const [leaving, setLeaving] = useState(false)
  useEffect(() => {
    if (isOpen) {
      setRendered(true)
      setLeaving(false)
      return
    }
    const overlay = dialogRef.current
    // No fade (reduced motion, or no animation applied): unmount at once.
    const fades = overlay !== null && parseFloat(getComputedStyle(overlay).animationDuration) > 0
    if (fades) setLeaving(true)
    else setRendered(false)
  }, [isOpen])

  // Controlled: only report the request; uncontrolled: also apply it.
  const requestOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next)
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange]
  )

  // Latest requestOpen, read by the native listeners so they subscribe once per open.
  const requestOpenRef = useRef(requestOpen)
  useEffect(() => {
    requestOpenRef.current = requestOpen
  })

  const openOverlay = () => requestOpen(true)
  const closeOverlay = () => requestOpen(false)

  // Children are arbitrary nodes, so the trigger stays a <div> (a <button> may
  // not contain interactive content) and gets button keyboard activation here;
  // Space is prevented from scrolling the page.
  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      openOverlay()
    }
  }

  // Escape requests the close; preventing it stops the native `cancel`, so the open state stays the
  // single source.
  const handleOverlayKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "Escape") {
      event.preventDefault()
      closeOverlay()
    }
  }

  // Modal show / hide, scroll lock and focus return. A platform close request (the native
  // `cancel`) is prevented and reported like Escape; a native close that was not requested is
  // reported too. The listeners are removed before the cleanup's own close(), so that close is
  // not reported.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!rendered || !dialog) return
    const trigger = triggerRef.current

    const handleCancel = (event: Event) => {
      event.preventDefault()
      requestOpenRef.current(false)
    }
    const handleNativeClose = () => {
      if (dialog.open) return
      requestOpenRef.current(false)
    }

    dialog.addEventListener("cancel", handleCancel)
    dialog.addEventListener("close", handleNativeClose)
    document.body.style.overflow = "hidden"
    if (!dialog.open) dialog.showModal()
    dialog.focus()

    return () => {
      dialog.removeEventListener("cancel", handleCancel)
      dialog.removeEventListener("close", handleNativeClose)
      if (dialog.open) dialog.close()
      document.body.style.overflow = ""
      trigger?.focus()
    }
  }, [rendered])

  return (
    <>
      <Trigger
        ref={triggerRef}
        role="button"
        tabIndex={0}
        onClick={openOverlay}
        onKeyDown={handleTriggerKeyDown}
        aria-label={label}
        className={className}
        style={style}
      >
        {children}
      </Trigger>
      {rendered &&
        createPortal(
          <Overlay
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={title || alt || label || undefined}
            tabIndex={-1}
            onClick={closeOverlay}
            onKeyDown={handleOverlayKeyDown}
            onAnimationEnd={() => {
              if (!leaving) return
              setLeaving(false)
              setRendered(false)
            }}
            $content={content !== undefined}
            $leaving={leaving}
          >
            {content !== undefined ? (
              <>
                {/* The Close button first, so the first Tab in the overlay reaches it before the content. */}
                <Close onClick={(event) => event.stopPropagation()}>
                  <Button size="small" onClick={closeOverlay}>
                    Close
                  </Button>
                </Close>
                <Content onClick={(event) => event.stopPropagation()}>{content}</Content>
              </>
            ) : (
              <Image src={imageUrl} alt={alt} onClick={(event) => event.stopPropagation()} />
            )}
            <LightboxCaption title={title} description={description} />
          </Overlay>,
          document.body
        )}
    </>
  )
}

export default Lightbox
