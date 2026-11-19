import type { HeaderToleranceType } from "../components/Header/Header.types"

/**
 * The tolerance as separate up and down distances; a number sets both.
 *
 * @param tolerance - A number or `{ up, down }`
 * @returns `{ up, down }`
 */
export const normalizeTolerance = (tolerance: HeaderToleranceType): { up: number; down: number } =>
  typeof tolerance === "number" ? { up: tolerance, down: tolerance } : tolerance
