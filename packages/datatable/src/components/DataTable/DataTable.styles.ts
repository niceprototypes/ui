import styled from "styled-components"
import { getToken } from "@niceprototypes/styles"
import { tableBorderToken } from "../../utilities/tableBorderToken"

/* The data layer's own pieces; the grid, rows and cells are @niceprototypes/table. Static rules:
   state comes from ARIA and data-* attributes. */

const focusRing = `
  &:focus-visible {
    outline: ${getToken("datatable.focusRing.width")} solid ${getToken("datatable.focusRing.color")};
    outline-offset: ${getToken("datatable.focusRing.width")};
  }
`

/** A hit area of at least `datatable.touchTarget` on coarse pointers, without taller rows. */
const touchTarget = `
  @media (pointer: coarse) {
    &::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      height: 100%;
      min-width: ${getToken("datatable.touchTarget")};
      min-height: ${getToken("datatable.touchTarget")};
      transform: translate(-50%, -50%);
    }
  }
`

/** The bar above the grid, always present: the bulk actions control. The surface is the table's own in every state. */
export const StyledDataTableToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: ${getToken("datatable.toolbar.gap")};
  padding: ${getToken("datatable.toolbar.paddingBlock")} ${getToken("datatable.toolbar.paddingInline")};
  border-bottom: ${tableBorderToken};
  font-size: ${getToken("datatable.toolbar.fontSize")};
`

/** A sortable column header: the header text and the sort direction icon. */
export const StyledDataTableSortButton = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: ${getToken("datatable.toolbar.gap")};
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
  ${getToken("icon.color", { as: "key" })}: currentColor;
  ${focusRing}
  ${touchTarget}
`

/** Wraps a checkbox so its hit area grows on coarse pointers. */
export const StyledDataTableCheckbox = styled.span`
  position: relative;
  display: inline-flex;
  ${touchTarget}
`

/**
 * Wraps a row's actions menu button: negative block margins fold its touch-target height into
 * one line box, so it centres on the row's first text line and never makes the row taller.
 */
export const StyledDataTableActions = styled.span`
  display: inline-flex;
  margin-block: calc((1lh - ${getToken("datatable.touchTarget")}) / 2);
`
