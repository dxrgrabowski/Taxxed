export function hyperboleEq(v) {
    return v* (1 / (v * 0.46868) + 0.886797) ** 1.22426
}

export function transformArraySEC(arr, field) {
  let sum = arr.reduce((a, b) => a + b[field], 0);
  arr.forEach((value) => {
    value[field] =
      value[field] *
      (100 / sum) *
      (4 / Math.min(...arr.map((value) => value[field])));
  });
  if (arr.length === 1) {
    arr[0][field] += 100 - arr.reduce((a, b) => a + b[field], 0);
  }
  return arr;
}
