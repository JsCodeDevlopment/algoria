function merge(nums1: number[], m: number, nums2: number[], n: number): void {
  for (let k = 0; k < n; k++) {
    nums1[m + k] = nums2[k];
  }
  const sorted = [...nums1.slice(0, m + n)].sort((a, b) => a - b);
  for (let i = 0; i < m + n; i++) {
    nums1[i] = sorted[i];
  }
}
