/**
 * @param {{ unitPriceBase: number; qty: number }[]} lines
 */
export function sumLines(lines) {
  return lines.reduce((a, l) => a + l.unitPriceBase * l.qty, 0);
}
