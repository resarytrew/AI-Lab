export type ModelRule = 'double' | 'plusThree' | 'square';

export function evaluateModel(input: number, rule: ModelRule) {
  switch (rule) {
    case 'double':
      return input * 2;
    case 'plusThree':
      return input + 3;
    case 'square':
      return input * input;
  }
}

export function modelRuleExpression(rule: ModelRule) {
  switch (rule) {
    case 'double':
      return 'y = 2x';
    case 'plusThree':
      return 'y = x + 3';
    case 'square':
      return 'y = x²';
  }
}

export function modelRulePython(rule: ModelRule) {
  switch (rule) {
    case 'double':
      return '    return x * 2';
    case 'plusThree':
      return '    return x + 3';
    case 'square':
      return '    return x ** 2';
  }
}

export function linearFunction(x: number, scale: number, shift: number) {
  return scale * x + shift;
}

export function linearSeries(scale: number, shift: number) {
  return Array.from({length: 7}, (_, index) => {
    const x = index - 2;
    return {x, y: linearFunction(x, scale, shift)};
  });
}
