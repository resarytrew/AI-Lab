import {describe, expect, it} from 'vitest';
import {neuronOutput, neuronSeries} from './neuron';

describe('neuron math', () => {
  it('computes y = wx + b', () => {
    expect(neuronOutput(3, 2, 1)).toBe(7);
  });

  it('creates a stable visualization series', () => {
    const series = neuronSeries(2, 1);
    expect(series).toHaveLength(7);
    expect(series.at(-1)).toEqual({x: 4, y: 9});
  });
});
