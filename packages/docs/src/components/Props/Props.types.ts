import type * as React from "react"

/**
 * PropsStoryType
 *
 * One story of a Props list: its anchor `id` (unique on the page), the `label` its contents entry
 * shows, its `content` (the text column: name, description) and an optional `aside` (the demo).
 */
export type PropsStoryType = {
  id: string
  label: string
  content: React.ReactNode
  aside?: React.ReactNode
}

/**
 * PropsProps
 *
 * Complete prop definition for the Props component.
 */
export interface PropsProps {
  /** The stories, in order */
  stories: ReadonlyArray<PropsStoryType>
  /** The accessible name of its list of stories. @default "Props" */
  "aria-label"?: string
}
