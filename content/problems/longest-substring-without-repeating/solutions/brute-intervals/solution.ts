function lengthOfLongestSubstring(s: string): number {
  let best = 0;
  const n = s.length;
  for (let i = 0; i < n; i++) {
    const seen = new Set<string>();
    for (let j = i; j < n; j++) {
      const ch = s[j]!;
      if (seen.has(ch)) break;
      seen.add(ch);
      best = Math.max(best, j - i + 1);
    }
  }
  return best;
}
