export const calculateWilsonScore = (
  averageRating: number,
  totalRatings: number,
): number => {
  if (totalRatings === 0) return 0;

  const p = averageRating / 5;
  const z = 1.95996; // z-score for 95% confidence
  const n = totalRatings;
  const z2 = z * z;

  const denominator = 1 + z2 / n;
  const center = p + z2 / (2 * n);
  const spread = z * Math.sqrt((p * (1 - p) + z2 / (4 * n)) / n);

  return (center - spread) / denominator;
};
