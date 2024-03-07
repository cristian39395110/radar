export const indexOfPoint = (
  point: { x: string; y: number },
  data: any[]
): number => {
  const i = data.map(({ x }) => x === point.x).indexOf(true);
  return i;
};
