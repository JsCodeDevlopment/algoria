function minWindow(s: string, t: string): string {
  const need = new Map<string, number>();
  for (const ch of t) need.set(ch, (need.get(ch) ?? 0) + 1);
  let buckets = need.size;
  let filled = 0;
  const have = new Map<string, number>();
  let lo = 0;
  let bestIdx = -1;
  let bestLen = Infinity;
  for (let hi = 0; hi < s.length; hi++) {
    const c = s[hi]!;
    if (need.has(c)) {
      have.set(c, (have.get(c) ?? 0) + 1);
      if (have.get(c) === need.get(c)) filled++;
    }
    while (filled === buckets) {
      if (hi - lo + 1 < bestLen) {
        bestLen = hi - lo + 1;
        bestIdx = lo;
      }
      const lc = s[lo]!;
      lo++;
      if (need.has(lc)) {
        if (have.get(lc) === need.get(lc)) filled--;
        have.set(lc, have.get(lc)! - 1);
      }
    }
  }
  return bestIdx === -1 ? '' : s.slice(bestIdx, bestIdx + bestLen);
}
