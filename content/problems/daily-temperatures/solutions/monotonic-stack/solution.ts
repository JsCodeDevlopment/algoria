function dailyTemperatures(temperatures: number[]): number[] {
  const ans = new Array<number>(temperatures.length).fill(0);
  const pending: number[] = [];
  for (let day = 0; day < temperatures.length; day++) {
    while (pending.length && temperatures[day]! > temperatures[pending[pending.length - 1]!]!) {
      const colder = pending.pop()!;
      ans[colder] = day - colder;
    }
    pending.push(day);
  }
  return ans;
}
