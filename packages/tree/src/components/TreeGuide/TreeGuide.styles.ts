import styled from "styled-components"
import {
  activeColor,
  armLine,
  armLineAtOffset,
  column,
  fullLine,
  guideColor,
  upperLine,
  upperLineAtOffset,
} from "../../utilities/treeGuideGeometry"

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

/* Offset mode: the same shapes with the arm at `tree.guide.armOffset` instead of mid-height. */
const ownNeutralAtOffset = {
  tee: [armLineAtOffset(guideColor), fullLine(guideColor)],
  elbow: [armLineAtOffset(guideColor), upperLineAtOffset(guideColor)],
}
const onPathAtOffset = [armLineAtOffset(activeColor), upperLineAtOffset(activeColor)]

/**
 * One level's column: a fixed-width slot in the indent. Its drawing is absolutely positioned with
 * no inline offset, so it sits in the slot and runs the full height of the nearest positioned
 * ancestor (the row). Static rules keyed on `data-branch` and `data-path`: one class for every row.
 *
 * Offset mode: under an ancestor with `data-tree-guide-arm="offset"` (a top-aligned table row taller
 * than one line), each arm sits `tree.guide.armOffset` from the top of the row, on the first text
 * line, and a last child's rail ends there. Without it the arm stays at mid-height.
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

  [data-tree-guide-arm="offset"] &[data-branch="tee"]::before {
    background: ${layers(...ownNeutralAtOffset.tee)};
  }
  [data-tree-guide-arm="offset"] &[data-branch="tee"][data-path="through"]::before {
    background: ${layers(fullLine(activeColor), ...ownNeutralAtOffset.tee)};
  }
  [data-tree-guide-arm="offset"] &[data-branch="tee"][data-path="on"]::before {
    background: ${layers(...onPathAtOffset, ...ownNeutralAtOffset.tee)};
  }
  [data-tree-guide-arm="offset"] &[data-branch="elbow"]::before {
    background: ${layers(...ownNeutralAtOffset.elbow)};
  }
  [data-tree-guide-arm="offset"] &[data-branch="elbow"][data-path="on"]::before {
    background: ${layers(...onPathAtOffset, ...ownNeutralAtOffset.elbow)};
  }
`
