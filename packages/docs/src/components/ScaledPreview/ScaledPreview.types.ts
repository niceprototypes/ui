import type * as React from "react"

/**
 * ScaledPreviewProps
 *
 * Complete prop definition for the ScaledPreview component.
 */
export interface ScaledPreviewProps {
  /** Accessible name of the preview's button and of the lightbox it opens */
  label: string
  /** The demo, designed for a full screen (`docs.previewWidth`); rendered twice from laptop up, scaled and inert, then at real size in the lightbox */
  children: React.ReactNode
}
