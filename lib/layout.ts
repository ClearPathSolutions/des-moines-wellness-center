/** Shared grid helpers so every row of boxes lays out evenly, whatever the count.
 *  Container centers wrapped rows; the last (partial) row is centered instead of
 *  left-aligned, so nothing ever looks lopsided. Widths subtract the 1.5rem (gap-6)
 *  gutters so full rows fill edge-to-edge exactly. */
export const GRID_WRAP = 'flex flex-wrap justify-center gap-6'

export function gridItem(count: number): string {
  if (count <= 1) return 'w-full max-w-md'
  // Multiples of 4 read best 4-up (e.g. 4 or 8 boxes -> even rows).
  if (count % 4 === 0) return 'w-full sm:w-[calc(50%_-_0.75rem)] lg:w-[calc(25%_-_1.125rem)]'
  if (count === 2) return 'w-full sm:w-[calc(50%_-_0.75rem)]'
  // Default 3-up; a leftover 1–2 boxes center under the row above.
  return 'w-full sm:w-[calc(50%_-_0.75rem)] lg:w-[calc(33.333%_-_1rem)]'
}
