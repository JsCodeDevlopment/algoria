function groupAnagrams(strs: string[]): string[][] {
  const map = new Map<string, string[]>();
  for (const word of strs) {
    const key = [...word].sort().join('');
    const pack = map.get(key);
    if (pack === undefined) map.set(key, [word]);
    else pack.push(word);
  }
  return [...map.values()];
}
