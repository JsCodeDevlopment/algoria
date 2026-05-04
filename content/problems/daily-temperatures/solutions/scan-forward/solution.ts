function dailyTemperatures(temperatures: number[]): number[] {
  const ans = new Array<number>(temperatures.length).fill(0);
  for (let i = 0; i < temperatures.length; i++) {
    for (let j = i + 1; j < temperatures.length; j++) {
      if (temperatures[j]! > temperatures[i]!) {
        ans[i] = j - i;
        break;
      }
    }
  }
  return ans;
}
