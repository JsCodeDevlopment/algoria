function moveZeroes(nums: number[]): void {
  const filtered = nums.filter((x) => x !== 0);
  nums.fill(0);
  filtered.forEach((value, idx) => {
    nums[idx] = value;
  });
}
