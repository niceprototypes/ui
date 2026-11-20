import * as React from "react"
import type { GapType, TokenGroup, TokenVariants } from "@niceprototypes/styles"

/**
 * FlowAsType
 *
 * The container element.
 *
 * Values:
 * - "div": Generic column
 * - "section": Thematic section
 * - "article": Self-contained piece (a post, a docs page)
 * - "main": The page's main content
 * - "aside": Content beside the main flow
 */
export type FlowAsType = "div" | "section" | "article" | "main" | "aside"

/**
 * FlowDensityType
 *
 * Multiplier on the whole rhythm, from the `flow.density` tokens. Every role scales by the
 * same factor, so the heading hierarchy holds at each density. Unset inherits the nearest
 * Flow's density (the token default, "base", at the top).
 *
 * Values:
 * - "compact": Half the rhythm
 * - "base": The `flow` tokens as set
 * - "spacious": One and a half times the rhythm
 */
export type FlowDensityType = TokenVariants["flow.density"]

/**
 * FlowSettingGroupType
 *
 * The `flow` token groups that are settings, not child roles: the density and breakpoint-scale
 * multipliers, the bleed reach, and the reach inside a bleeding item.
 */
export type FlowSettingGroupType = "flow.density" | "flow.scale" | "flow.bleed" | "flow.itemBleed"

/**
 * FlowRoleType
 *
 * A child role with its own `flow.{role}` before/after tokens.
 *
 * Values:
 * - "h1" … "h6": Headings
 * - "text": p, and a span or link laid out as a block
 * - "list": ul, ol, dl
 * - "blockquote", "table": those elements
 * - "code": pre
 * - "media": figure, img, picture, video, iframe, canvas, svg
 * - "rule": hr
 * - "block": every other child (cards, components, wrappers)
 */
export type FlowRoleType = Exclude<Extract<TokenGroup, `flow.${string}`>, FlowSettingGroupType> extends `flow.${infer Role}` ? Role : never

/**
 * FlowRoleSpaceType
 *
 * One role's space override, each side a core `gap` token variant (multiplied by the density).
 */
export type FlowRoleSpaceType = {
  /** Space before the role's elements */
  before?: GapType
  /** Space after the role's elements */
  after?: GapType
}

/**
 * FlowSpaceType
 *
 * Per-instance overrides by role: `{ h2: { before: "large" }, code: { after: "base" } }`.
 * They apply inside this Flow and the Flows nested in it.
 */
export type FlowSpaceType = Partial<Record<FlowRoleType, FlowRoleSpaceType>>

/**
 * FlowRefType
 *
 * Ref to the container element.
 */
export type FlowRefType = React.Ref<HTMLElement>

/**
 * FlowProps
 *
 * Complete prop definition for the Flow component.
 */
export interface FlowProps {
  /** The content, each direct child spaced by its role */
  children?: React.ReactNode
  /** The container element. @default "div" */
  as?: FlowAsType
  /** Multiplier on the whole rhythm; unset inherits the nearest Flow's */
  density?: FlowDensityType
  /** Space overrides by role, as core gap tokens */
  space?: FlowSpaceType
  /** Element id, e.g. an anchor target */
  id?: string
  /** Ref to the container element */
  ref?: FlowRefType
}

// Declaration merging: const + namespace creates exportable type namespace
const FlowTypes = {} as const

namespace FlowTypes {
  export type As = FlowAsType
  export type Density = FlowDensityType
  export type Role = FlowRoleType
  export type RoleSpace = FlowRoleSpaceType
  export type Space = FlowSpaceType
  export type Ref = FlowRefType
  export type Props = FlowProps
}

export default FlowTypes
