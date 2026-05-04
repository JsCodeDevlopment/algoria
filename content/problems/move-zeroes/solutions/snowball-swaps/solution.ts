function moveZeroes(nums: number[]): void {
  let write = 0;
  for (let read = 0; read < nums.length; read++) {
    if (nums[read] !== 0) {
      nums[write++] = nums[read];
    }
  }
  while (write < nums.length) {
    nums[write++] = 0;
  }
}
