import {describe, expect, it} from 'vitest';
import {learningStages, starterLessons} from './learning-path';

describe('AI Lab learning path', () => {
  it('starts from intelligence and reaches a first language model in 15 lessons', () => {
    expect(starterLessons).toHaveLength(15);
    expect(starterLessons[0]?.id).toBe('smart-machine');
    expect(starterLessons[1]?.id).toBe('data-to-meaning');
    expect(starterLessons[2]?.id).toBe('knowledge-as-rules');
    expect(starterLessons[3]?.id).toBe('where-rules-break');
    expect(starterLessons[4]?.id).toBe('learn-from-examples');
    expect(starterLessons[10]?.id).toBe('first-neuron');
    expect(starterLessons[12]?.id).toBe('text-as-data');
    expect(starterLessons.at(-1)?.id).toBe('first-language-model');
  });

  it('does not introduce trainable parameters before rules fail and learning is motivated', () => {
    const rulesBreak = starterLessons.findIndex((lesson) => lesson.id === 'where-rules-break');
    const examples = starterLessons.findIndex((lesson) => lesson.id === 'learn-from-examples');
    const parameters = starterLessons.findIndex((lesson) => lesson.id === 'trainable-parameters');
    const neuron = starterLessons.findIndex((lesson) => lesson.id === 'first-neuron');

    expect(rulesBreak).toBeLessThan(examples);
    expect(examples).toBeLessThan(parameters);
    expect(parameters).toBeLessThan(neuron);
  });

  it('forms one ordered lesson chain', () => {
    starterLessons.slice(0, -1).forEach((lesson, index) => {
      expect(lesson.nextId).toBe(starterLessons[index + 1]?.id);
    });
    expect(starterLessons.at(-1)?.nextId).toBeNull();
  });

  it('gives every lesson transfer, depth and a real MyAI artifact', () => {
    for (const lesson of starterLessons) {
      expect(lesson.artifact.length).toBeGreaterThan(0);
      expect(lesson.canDo.ru.length).toBeGreaterThan(20);
      expect(lesson.checkpoint.ru.length).toBeGreaterThan(20);
      expect(lesson.deepDive.ru.length).toBeGreaterThan(20);
      expect(lesson.engineer.ru.length).toBeGreaterThan(20);
      expect(lesson.researcher.ru.length).toBeGreaterThan(20);
    }
  });

  it('keeps the complete course framed from intelligence to research defense', () => {
    expect(learningStages).toHaveLength(16);
    expect(learningStages[0]?.id).toBe('intelligence');
    expect(learningStages.at(-1)?.id).toBe('systems-and-defense');
    learningStages.forEach((stage, index) => {
      expect(stage.index).toBe(index);
    });
  });
});
