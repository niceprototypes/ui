import { getToken } from "@niceprototypes/styles"
import type { HeaderAppearanceType } from "../components/Header/Header.types"
import type { HeaderResolvedAppearanceType } from "../components/Header/Header.styles"

/**
 * One visual state's CSS values: each set value as its core token, each unset one as the header
 * token for that state (`header.backgroundColor:stuck`, …). "none" reads `header.borderColor:none`
 * and `header.boxShadow:none`.
 *
 * @param variant - The header token variant for unset values: "base" (default state) or "stuck"
 * @param values - The consumer's appearance for this state
 * @returns The CSS values
 */
export const resolveAppearance = (variant: "base" | "stuck", values: HeaderAppearanceType = {}): HeaderResolvedAppearanceType => {
  const { backgroundColor, color, borderColor, boxShadow, fontSize } = values
  return {
    backgroundColor: backgroundColor ? getToken("backgroundColor", backgroundColor) : getToken(`header.backgroundColor:${variant}`),
    color: color ? getToken("color", color) : getToken(`header.color:${variant}`),
    borderColor:
      borderColor === "none"
        ? getToken("header.borderColor:none")
        : borderColor
          ? getToken("borderColor", borderColor)
          : getToken(`header.borderColor:${variant}`),
    boxShadow:
      boxShadow === "none" ? getToken("header.boxShadow:none") : boxShadow ? getToken("boxShadow", boxShadow) : getToken(`header.boxShadow:${variant}`),
    fontSize: fontSize ? getToken("fontSize", fontSize) : getToken(`header.fontSize:${variant}`),
  }
}
