import { getToken } from "@niceprototypes/styles"

/* Geometry shared by Tree, TreeGuide and TreeExpander. Each level is one column
   (`tree.guide.indent`): a rail on its axis (`tree.icon.size` / 2 in) and an arm from the axis to
   the column's end, where the label gap (`tree.guide.labelGap`) starts. A row's expander circle
   sits on its own column's junction, over the rail and the arm's start. */
const icon = getToken("tree.icon.size")
const arm = getToken("tree.guide.arm")
const stroke = getToken("tree.guide.width")

/** Space between a row's icon and its label. */
export const iconGap = getToken("tree.icon.gap")

/** One nesting level's indent: one guide column, its arm running to its end. */
export const column = getToken("tree.guide.indent")

/** The space between the guide (its arm's end) and the row's label. */
export const labelGap = getToken("tree.guide.labelGap")

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

/** The arm's distance from the top of the row in offset mode (`tree.guide.armOffset`). */
const armOffset = getToken("tree.guide.armOffset")

/**
 * Offset mode's vertical line from the top of a column to the arm at `armOffset`, so a last
 * child's rail ends at its arm.
 */
export const upperLineAtOffset = (color: string) =>
  `linear-gradient(${color}, ${color}) ${axis} 0 / ${stroke} calc(${armOffset} + ${stroke} / 2) no-repeat`

/**
 * Offset mode's horizontal arm, centred on `armOffset` from the top of the row: one column-high
 * layer whose hard colour stops place the stroke, so the offset may be a length or a percentage.
 */
export const armLineAtOffset = (color: string) =>
  `linear-gradient(transparent calc(${armOffset} - ${stroke} / 2), ${color} 0 calc(${armOffset} + ${stroke} / 2), transparent 0) ${axis} 0 / calc(${arm} + ${stroke} / 2) 100% no-repeat`
