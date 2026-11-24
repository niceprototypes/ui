import styled from "styled-components"
import { getFlowStyle } from "@niceprototypes/flow"
import { getBreakpoint, getConstantKey, getToken as getCoreToken } from "@niceprototypes/styles"
import { DOCS_TILE_ATTRIBUTE } from "../DocsRule"
import { getToken } from "../../nice/tokens"

/** The region's padding above and below the page (the App screen's `app.docs.padding`). */
const regionPadding = getCoreToken("app.docs.padding")

/** Two prose columns and the gutter between them: a two-column page's text measure (Stripe's API reference: 1540px). */
const splitWidth = `calc(${getToken("docs", "columnWidth")} * 2 + ${getToken("docs", "gutter")})`

/**
 * The page's columns side by side, touching: the sections, the Contents column (its start edge a
 * grid line) and the settings; the settings row wraps above the sections below laptop.
 */
export const StyledDocsPage = styled.div`
  display: flex;
  flex-wrap: wrap;

  ${getBreakpoint("laptop+")} {
    flex-wrap: nowrap;
  }
`

/**
 * The sections column: the whole width between the grid lines. Not a scroll container: the App's
 * region scrolls the page both ways (a wider table scrolls the region sideways), so a sticky
 * story column inside sticks to the region, the element that scrolls.
 */
export const StyledDocsPageMain = styled.div`
  /* Sized by the row, not its content (the sections column is a size container): a line of its
     own below laptop, under the settings row; the room the settings leave from laptop up. */
  flex: 1 1 100%;
  min-width: 0;

  ${getBreakpoint("laptop+")} {
    flex-basis: 0;
  }
`

/**
 * The sections, a Flow column; section rules between tiles are its own children, so they run line
 * to line. A size container (the tiles' width), so an edge rule inside a tile reaches the grid
 * lines (HEADING_RULES); the tiles themselves stay plain blocks, so margins collapse across them.
 */
export const StyledDocsPageColumn = styled.div`
  ${getFlowStyle()}
  container-type: inline-size;
`

/**
 * A section tile (a top-level section, or the page's header): edge to edge between the grid lines,
 * its content inset by `docs.tilePadding`, or more where the column is wider than the text measure
 * (`docs.columnWidth`, two of them and the gutter on a two-column page; none when not `$wrapped`),
 * so the text keeps its measure, centred. Every rule inside sits in that inset. On phone a bleeding
 * FlowItem (a preview) reaches past the inset to the screen's edges (`flow.bleed`).
 */
export const StyledDocsPageTile = styled.section.attrs({ [DOCS_TILE_ATTRIBUTE]: "" } as Record<string, string>)<{ $measure?: "column" | "split" }>`
  ${getFlowStyle()}
  scroll-margin-top: ${getToken("contents.top")};
  ${getToken("docs", "tileMeasure", { as: "key" })}: ${({ $measure }) =>
    $measure === "split" ? splitWidth : $measure === "column" ? getToken("docs", "columnWidth") : "100cqi"};
  padding-inline: ${({ $measure }) =>
    $measure
      ? `max(${getToken("docs", "tilePadding")}, calc((100% - ${$measure === "split" ? splitWidth : getToken("docs", "columnWidth")}) / 2))`
      : getToken("docs", "tilePadding")};
  ${getConstantKey("flow.bleed")}: ${getToken("docs", "tilePadding")};

  ${getBreakpoint("tablet+")} {
    ${getConstantKey("flow.bleed")}: ${getCoreToken("gap", "none")};
  }
`

/** A nested section, a Flow column inside its tile: scrolled to where Contents sticks. */
export const StyledDocsPageSection = styled.section`
  ${getFlowStyle()}
  scroll-margin-top: ${getToken("contents.top")};
`

/**
 * Contents in the end column, pulled back over the column's rule (the grid line) by the line's
 * width: its rail (transparent, the line's width) lies on the line, so its active indicator
 * slides along the line.
 */
export const StyledDocsPageContents = styled.div`
  flex: 1 1 auto;
  min-width: 0;
  margin-inline-start: calc(-1 * ${getToken("docs", "gridLineWidth")});
`

/**
 * The settings column, rightmost, `docs.settingsWidth` wide, its content sticky with Contents and
 * the region's padding from the screen's edge. Below laptop it is a row above the sections, at
 * their right.
 */
export const StyledDocsPageSettings = styled.aside`
  order: -1;
  flex: 1 0 100%;
  display: flex;
  justify-content: flex-end;
  padding-inline: ${getToken("docs", "tilePadding")};

  ${getBreakpoint("laptop+")} {
    order: 0;
    flex: none;
    width: ${getToken("docs", "settingsWidth")};
    padding-inline: 0 ${regionPadding};
  }
`

/** The settings in the end column, at its top right. */
export const StyledDocsPageEndSettings = styled.aside`
  flex: none;
`

/** The settings, sticky at the height Contents sticks at. */
export const StyledDocsPageSettingsContent = styled.div`
  position: sticky;
  top: ${getToken("contents.top")};
`
