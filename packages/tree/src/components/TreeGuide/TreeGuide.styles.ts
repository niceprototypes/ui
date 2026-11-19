import styled from "styled-components"
import { activeColor, armLine, column, fullLine, guideColor, upperLine } from "../../utilities/treeGuideGeometry"

/** The in-flow indent: one column per level, so the content after it starts past the guide. */
export const StyledTreeGuide = styled.span`
  display: inline-flex;
  flex: none;
  vertical-align: top;
`

/* Background layers per column shape, topmost first: the active path's line on top, then the
   row's active arm, its neutral arm, and the neutral line at the bottom, so a neutral arm never
   cuts through an active line. */
const layers = (...pieces: string[]) => pieces.join(", ")
const ownNeutral = {
  tee: [armLine(guideColor), fullLine(guideColor)],
  elbow: [armLine(guideColor), upperLine(guideColor)],
}
const onPath = [armLine(activeColor), upperLine(activeColor)]

/**
 * One level's column: a fixed-width slot in the indent. Its drawing is absolutely positioned with
 * no inline offset, so it sits in the slot and runs the full height of the nearest positioned
 * ancestor (the row). Static rules keyed on `data-branch` and `data-path`: one class for every row.
 */
export const StyledTreeGuideColumn = styled.span`
  display: block;
  flex: none;
  width: ${column};

  &::before {
    content: "";
    position: absolute;
    inset-block: 0;
    width: ${column};
    pointer-events: none;
  }

  &[data-branch="line"]::before {
    background: ${fullLine(guideColor)};
  }
  &[data-branch="line"][data-path="through"]::before {
    background: ${layers(fullLine(activeColor), fullLine(guideColor))};
  }
  &[data-branch="tee"]::before {
    background: ${layers(...ownNeutral.tee)};
  }
  &[data-branch="tee"][data-path="through"]::before {
    background: ${layers(fullLine(activeColor), ...ownNeutral.tee)};
  }
  &[data-branch="tee"][data-path="on"]::before {
    background: ${layers(...onPath, ...ownNeutral.tee)};
  }
  &[data-branch="elbow"]::before {
    background: ${layers(...ownNeutral.elbow)};
  }
  &[data-branch="elbow"][data-path="on"]::before {
    background: ${layers(...onPath, ...ownNeutral.elbow)};
  }
`
