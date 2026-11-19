import styled from "styled-components"
import { getToken } from "@niceprototypes/styles"
import { tableFocusRing } from "../../utilities/tableStyles"

const paddingBlock = getToken("table.cell.paddingBlock:base")
const halfLine = `${getToken("table.cell.lineHeight")} * 0.5em`
const armOffset = getToken("tree.guide.armOffset", { as: "key" })

/**
 * A cell. Positioned, so a TreeGuide inside draws over the row's full height. Compact rows step
 * down to the compact padding. No gap: a guide sits flush against the content. Vertical alignment
 * comes from the grid's `data-align-items`, overridden by the row's; rows and cells stretch, so
 * the cell aligns its content. The grid puts TreeGuide in offset mode (`data-tree-guide-arm`) and
 * each cell sets `tree.guide.armOffset` to its first line's centre (or mid-height when centred),
 * so a guide's arm meets the first text line. Compact rows reassign the block padding variable,
 * so padding and arm offset follow it together.
 */
export const StyledTableCell = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  min-width: 0;
  padding: ${paddingBlock} ${getToken("table.cell.paddingInline")};

  [data-align-items="start"] > [role="row"] > &,
  [role="row"][data-align-items="start"] > & {
    align-items: flex-start;
    ${armOffset}: calc(${paddingBlock} + ${halfLine});
  }
  [data-align-items="center"] > [role="row"] > &,
  [role="row"][data-align-items="center"] > & {
    align-items: center;
    ${armOffset}: 50%;
  }
  [data-align-items="end"] > [role="row"] > &,
  [role="row"][data-align-items="end"] > & {
    align-items: flex-end;
    ${armOffset}: calc(100% - ${paddingBlock} - ${halfLine});
  }
  [data-density="compact"] > & {
    ${getToken("table.cell.paddingBlock", { as: "key" })}: ${getToken("table.cell.paddingBlock:compact")};
  }
  &[data-span="full"] {
    grid-column: 1 / -1;
    color: ${getToken("table.color:empty")};
  }
  &:focus-visible {
    ${tableFocusRing}
  }
`

/**
 * The cell's content after any guide: its items spaced by `table.cell.gap`. At least one line box
 * tall (`table.cell.lineHeight`), items centred in it, so a control no taller than a line (checkbox,
 * expander) centres on the first text line in every column.
 */
export const StyledTableCellContent = styled.div`
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  gap: ${getToken("table.cell.gap")};
  min-width: 0;
  min-height: 1lh;
  line-height: ${getToken("table.cell.lineHeight")};

  [data-align="end"] > & {
    justify-content: flex-end;
    text-align: end;
  }
`
