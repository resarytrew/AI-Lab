export function neuronOutput(x: number, weight: number, bias: number) {
  return x * weight + bias;
}

export function neuronSeries(weight: number, bias: number) {
  return [-2, -1, 0, 1, 2, 3, 4].map((x) => ({
    x,
    y: neuronOutput(x, weight, bias)
  }));
}
