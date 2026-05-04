function intersect(nums1: number[], nums2: number[]): number[] {
  const count = new Map<number, number>();
  for (const x of nums1) {
    count.set(x, (count.get(x) ?? 0) + 1);
  }
  const ans: number[] = [];
  for (const x of nums2) {
    const remaining = count.get(x) ?? 0;
    if (remaining === 0) continue;
    ans.push(x);
    count.set(x, remaining - 1);
  }
  return ans;
}
