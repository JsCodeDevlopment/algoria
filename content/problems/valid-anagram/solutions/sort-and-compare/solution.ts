function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  const a = [...s].sort().join('');
  const b = [...t].sort().join('');
  return a === b;
}
