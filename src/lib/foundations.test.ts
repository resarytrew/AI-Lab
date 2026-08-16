import {describe, expect, it} from 'vitest';
import {
  evaluateModel,
  linearFunction,
  linearSeries,
  modelRuleExpression,
  modelRulePython,
} from './foundations';

describe('foundation math', () => {
  it('evaluates the introductory model rules', () => {
    expect(evaluateModel(4, 'double')).toBe(8);
    expect(evaluateModel(4, 'plusThree')).toBe(7);
    expect(evaluateModel(4, 'square')).toBe(16);
  });

  it('keeps visual and code representations aligned', () => {
    expect(modelRuleExpression('double')).toBe('y = 2x');
    expect(modelRulePython('square')).toContain('x ** 2');
  });

  it('evaluates affine functions', () => {
    expect(linearFunction(3, 2, 1)).toBe(7);
    expect(linearFunction(-2, -3, 4)).toBe(10);
  });

  it('builds a deterministic graph series', () => {
    expect(linearSeries(2, 1)).toEqual([
      {x: -2, y: -3},
      {x: -1, y: -1},
      {x: 0, y: 1},
      {x: 1, y: 3},
      {x: 2, y: 5},
      {x: 3, y: 7},
      {x: 4, y: 9},
    ]);
  });
});
