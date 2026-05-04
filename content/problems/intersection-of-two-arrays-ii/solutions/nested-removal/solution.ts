function intersect(nums1: number[], nums2: number[]): number[] {
  const ans: number[] = [];
  const used = nums2.map(() => false);

  for (const x of nums1) {
    for (let j = 0; j < nums2.length; j++) {
      if (!used[j] && nums2[j] === x) {
        ans.push(x);
        used[j] = true;
        break;
      }
    }
  }
  return ans;
}
