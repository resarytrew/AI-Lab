import {describe, expect, it} from 'vitest';
import {learningStages, starterLessons} from './learning-path';

describe('AI Lab learning path', () => {
  it('starts with seven beginner lessons before the neuron reveal', () => {
    expect(starterLessons).toHaveLength(7);
    expect(starterLessons[0]?.id).toBe('human-knows-rule');
    expect(starterLessons.at(-1)?.id).toBe('first-training-loop');
  });

  it('forms one ordered starter chain', () => {
    starterLessons.slice(0, -1).forEach((lesson, index) => {
      expect(lesson.nextId).toBe(starterLessons[index + 1]?.id);
    });
    expect(starterLessons.at(-1)?.nextId).toBeNull();
  });

  it('gives every starter lesson a real MyAI artifact', () => {
    for (const lesson of starterLessons) {
      expect(lesson.artifact.length).toBeGreaterThan(0);
      expect(lesson.canDo.ru.length).toBeGreaterThan(20);
      expect(lesson.checkpoint.ru.length).toBeGreaterThan(20);
    }
  });

  it('keeps the complete course ordered from instructions to systems defense', () => {
    expect(learningStages).toHaveLength(16);
    expect(learningStages[0]?.id).toBe('instructions');
    expect(learningStages.at(-1)?.id).toBe('systems-and-defense');
    learningStages.forEach((stage, index) => {
      expect(stage.index).toBe(index);
    });
  });
});
