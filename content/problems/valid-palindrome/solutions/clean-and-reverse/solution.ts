function isPalindrome(s: string): boolean {
  const cleaned = [...s.toLowerCase()].filter((ch) =>
    /^[a-z0-9]$/u.test(ch),
  );
  const rev = [...cleaned].reverse();
  return cleaned.join('') === rev.join('');
}
