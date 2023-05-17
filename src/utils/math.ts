export function roundToPlaces(number: number, decimalPlaces: number) {
  const factor = 10 ** decimalPlaces;
  return Math.round(number * factor) / factor;
}
