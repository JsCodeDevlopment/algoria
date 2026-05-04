function minWindow(s: string, t: string): string {
  const template = new Map<string, number>();
  for (const ch of t) template.set(ch, (template.get(ch) ?? 0) + 1);
  let answer = '';
  for (let a = 0; a < s.length; a++) {
    for (let b = a; b < s.length; b++) {
      const bag = new Map(template);
      for (let idx = a; idx <= b; idx++) {
        const ch = s[idx]!;
        if (!bag.has(ch)) continue;
        bag.set(ch, (bag.get(ch) ?? 0) - 1);
      }
      let good = true;
      for (const need of bag.values()) if (need > 0) good = false;
      if (!good) continue;
      const cand = s.slice(a, b + 1);
      if (answer === '' || cand.length < answer.length) answer = cand;
    }
  }
  return answer;
}
