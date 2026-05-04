function groupAnagrams(strs: string[]): string[][] {
  const buckets: string[][] = [];
  for (const word of strs) {
    const canon = [...word].sort().join('');
    let placed = false;
    for (let i = 0; i < buckets.length; i++) {
      const sample = buckets[i]![0]!;
      const sampleCanon = [...sample].sort().join('');
      if (sampleCanon === canon) {
        buckets[i]!.push(word);
        placed = true;
        break;
      }
    }
    if (!placed) buckets.push([word]);
  }
  return buckets;
}
