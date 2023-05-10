export function getRandomFloat(leftBound: number, rightBound: number): number {
  return Math.random() * (rightBound - leftBound) + leftBound;
}
