function trap(height: number[]): number {
  let water = 0;
  const n = height.length;
  for (let i = 1; i < n - 1; i++) {
    let leftPeak = 0;
    for (let a = 0; a < i; a++) leftPeak = Math.max(leftPeak, height[a]!);
    let rightPeak = 0;
    for (let b = i + 1; b < n; b++) rightPeak = Math.max(rightPeak, height[b]!);
    const level = Math.min(leftPeak, rightPeak) - height[i]!;
    if (level > 0) water += level;
  }
  return water;
}
