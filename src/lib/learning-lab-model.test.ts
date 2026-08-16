import {describe, expect, it} from 'vitest';
import {readLearningLab, runLearningSteps, updateLearningLab} from './learning-lab-model';

const initial = {x: 3, target: 5, weight: 1.2, bias: 0, learningRate: 0.05};

describe('learning lab model', () => {
  it('computes prediction, error and squared loss', () => {
    const reading = readLearningLab(initial);
    expect(reading.prediction).toBeCloseTo(3.6);
    expect(reading.error).toBeCloseTo(-1.4);
    expect(reading.loss).toBeCloseTo(1.96);
  });

  it('takes a gradient step that reduces loss for a small learning rate', () => {
    const before = readLearningLab(initial).loss;
    const after = readLearningLab(updateLearningLab(initial)).loss;
    expect(after).toBeLessThan(before);
  });

  it('returns a loss history for repeated updates', () => {
    const result = runLearningSteps(initial, 4);
    expect(result.history).toHaveLength(5);
    expect(result.history.at(-1)).toBeLessThan(result.history[0]);
  });
});
