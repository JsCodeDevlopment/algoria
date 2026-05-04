function sortedSquares(nums: number[]): number[] {
  const ans = Array.from<number>({ length: nums.length });
  let left = 0;
  let right = nums.length - 1;
  for (let idx = nums.length - 1; idx >= 0; idx--) {
    const l2 = nums[left] * nums[left];
    const r2 = nums[right] * nums[right];
    if (l2 >= r2) {
      ans[idx] = l2;
      left++;
    } else {
      ans[idx] = r2;
      right--;
    }
  }
  return ans;
}
