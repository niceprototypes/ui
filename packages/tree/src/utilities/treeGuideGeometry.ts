import { getToken } from "@niceprototypes/styles"

/* Geometry shared by Tree and TreeGuide. A row's icon sits at the start of its content; its
   sub-rows' guide hangs from the icon's centre line, runs an arm towards each sub-row and stops
   `iconGap` short of the sub-row's icon or label. `column` is one level's indent. */
const icon = getToken("tree.icon.size")
const arm = getToken("tree.guide.arm")
const stroke = getToken("tree.guide.width")

/** Space between a row's icon and its label, and between a guide's arm and the row content. */
export const iconGap = getToken("tree.icon.gap")

/** One nesting level's indent: one guide column. */
export const column = `calc(${icon} / 2 + ${arm} + ${iconGap})`

const axis = `calc(${icon} / 2 - ${stroke} / 2)`

/** The neutral guide colour. */
export const guideColor = getToken("tree.guide.color")

/** The active path's colour. */
export const activeColor = getToken("tree.activeColor")

/** The vertical line through a whole column, as a background layer in `color`. */
export const fullLine = (color: string) => `linear-gradient(${color}, ${color}) ${axis} 0 / ${stroke} 100% no-repeat`

/** The vertical line from the top of a column to its middle, where the arm leaves. */
export const upperLine = (color: string) =>
  `linear-gradient(${color}, ${color}) ${axis} 0 / ${stroke} calc(50% + ${stroke} / 2) no-repeat`

/** The horizontal arm from the line to the row content, at mid-height. */
export const armLine = (color: string) =>
  `linear-gradient(${color}, ${color}) ${axis} 50% / calc(${arm} + ${stroke} / 2) ${stroke} no-repeat`
