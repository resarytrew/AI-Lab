import {describe, expect, it} from 'vitest';
import {chapterEnrichment} from './chapter-enrichment';
import {getChapterContent} from './chapter-content';
import {starterLessons} from './learning-path';

describe('interactive textbook chapter enrichment', () => {
  it('covers every starter lesson', () => {
    expect(Object.keys(chapterEnrichment)).toHaveLength(starterLessons.length);
    for (const lesson of starterLessons) {
      expect(getChapterContent(lesson.id), lesson.id).toBeDefined();
    }
  });

  it('gives every chapter a visual model and worked example', () => {
    for (const lesson of starterLessons) {
      const chapter = getChapterContent(lesson.id);
      expect(chapter.visualNodes.length, lesson.id).toBeGreaterThanOrEqual(4);
      expect(chapter.workedSteps.length, lesson.id).toBeGreaterThanOrEqual(3);
      expect(chapter.workedScenario.ru.length, lesson.id).toBeGreaterThan(35);
    }
  });

  it('makes Open the hood a real math/mechanism layer', () => {
    for (const lesson of starterLessons) {
      const math = getChapterContent(lesson.id).math;
      expect(math.formula?.length ?? 0, lesson.id).toBeGreaterThan(4);
      expect(math.symbols.length, lesson.id).toBeGreaterThan(0);
      expect(math.byHand.length, lesson.id).toBeGreaterThanOrEqual(2);
      expect(math.mechanism.ru.length, lesson.id).toBeGreaterThan(90);
    }
  });

  it('makes Engineer a code task rather than a paragraph', () => {
    for (const lesson of starterLessons) {
      const engineer = getChapterContent(lesson.id).engineer;
      expect(engineer.starterCode.length, lesson.id).toBeGreaterThan(45);
      expect(engineer.checkpoints.length, lesson.id).toBeGreaterThanOrEqual(2);
      expect(engineer.expected.length, lesson.id).toBeGreaterThan(0);
      expect(engineer.solution.length, lesson.id).toBeGreaterThan(0);
    }
  });

  it('makes Researcher a hypothesis-driven experiment', () => {
    for (const lesson of starterLessons) {
      const researcher = getChapterContent(lesson.id).researcher;
      expect(researcher.hypotheses.length, lesson.id).toBeGreaterThanOrEqual(2);
      expect(researcher.variables.length, lesson.id).toBeGreaterThanOrEqual(2);
      expect(researcher.procedure.length, lesson.id).toBeGreaterThanOrEqual(2);
      expect(researcher.observations.length, lesson.id).toBeGreaterThan(0);
      expect(researcher.conclusion.ru.length, lesson.id).toBeGreaterThan(70);
    }
  });
});
