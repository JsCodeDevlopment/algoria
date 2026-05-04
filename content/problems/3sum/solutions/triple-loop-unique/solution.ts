function threeSum(nums: number[]): number[][] {
  const seen = new Set<string>();
  const res: number[][] = [];
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = j + 1; k < n; k++) {
        if (nums[i]! + nums[j]! + nums[k]! !== 0) continue;
        const trio = [nums[i]!, nums[j]!, nums[k]!].sort((a, b) => a - b);
        const key = `${trio[0]},${trio[1]},${trio[2]}`;
        if (seen.has(key)) continue;
        seen.add(key);
        res.push(trio);
      }
    }
  }
  return res;
}
