function isPalindrome(s: string): boolean {
  let i = 0;
  let j = s.length - 1;

  while (i < j) {
    while (i < j && !/^[a-z0-9]$/iu.test(s[i])) i++;
    while (i < j && !/^[a-z0-9]$/iu.test(s[j])) j--;
    if (i >= j) break;
    if (s[i].toLowerCase() !== s[j].toLowerCase()) return false;
    i++;
    j--;
  }
  return true;
}
