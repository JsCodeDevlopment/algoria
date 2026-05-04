function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  const count = Array.from({ length: 26 }, () => 0);
  const base = 'a'.charCodeAt(0);
  for (let i = 0; i < s.length; i++) {
    count[s.charCodeAt(i) - base]++;
    count[t.charCodeAt(i) - base]--;
  }
  return count.every((x) => x === 0);
}
