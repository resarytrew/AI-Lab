import {describe, expect, it} from 'vitest';
import {chapterEnrichment} from './chapter-enrichment';
import {starterLessons} from './learning-path';

describe('interactive textbook chapter enrichment', () => {
  it('covers every starter lesson', () => {
    expect(Object.keys(chapterEnrichment)).toHaveLength(starterLessons.length);
    for (const lesson of starterLessons) {
      expect(chapterEnrichment[lesson.id]).toBeDefined();
    }
  });

  it('gives every chapter a visual model and worked example', () => {
    for (const lesson of starterLessons) {
      const chapter = chapterEnrichment[lesson.id];
      expect(chapter.visualNodes.length).toBeGreaterThanOrEqual(4);
      expect(chapter.workedSteps.length).toBeGreaterThanOrEqual(3);
      expect(chapter.workedScenario.ru.length).toBeGreaterThan(35);
    }
  });

  it('makes Open the hood a real math/mechanism layer', () => {
    for (const lesson of starterLessons) {
      const math = chapterEnrichment[lesson.id].math;
      expect(math.formula?.length ?? 0).toBeGreaterThan(4);
      expect(math.symbols.length).toBeGreaterThan(0);
      expect(math.byHand.length).toBeGreaterThanOrEqual(2);
      expect(math.mechanism.ru.length).toBeGreaterThan(90);
    }
  });

  it('makes Engineer a code task rather than a paragraph', () => {
    for (const lesson of starterLessons) {
      const engineer = chapterEnrichment[lesson.id].engineer;
      expect(engineer.starterCode.length).toBeGreaterThan(45);
      expect(engineer.checkpoints.length).toBeGreaterThanOrEqual(2);
      expect(engineer.expected.length).toBeGreaterThan(0);
      expect(engineer.solution.length).toBeGreaterThan(0);
    }
  });

  it('makes Researcher a hypothesis-driven experiment', () => {
    for (const lesson of starterLessons) {
      const researcher = chapterEnrichment[lesson.id].researcher;
      expect(researcher.hypotheses.length).toBeGreaterThanOrEqual(2);
      expect(researcher.variables.length).toBeGreaterThanOrEqual(2);
      expect(researcher.procedure.length).toBeGreaterThanOrEqual(2);
      expect(researcher.observations.length).toBeGreaterThan(0);
      expect(researcher.conclusion.ru.length).toBeGreaterThan(70);
    }
  });
});
