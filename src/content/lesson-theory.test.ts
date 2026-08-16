import {describe, expect, it} from 'vitest';
import {starterLessons} from './learning-path';
import {lessonTheory} from './lesson-theory';

describe('starter lesson theory layer', () => {
  it('provides theory for every starter lesson', () => {
    expect(Object.keys(lessonTheory)).toHaveLength(starterLessons.length);
    for (const lesson of starterLessons) {
      expect(lessonTheory[lesson.id]).toBeDefined();
    }
  });

  it('contains explanation, vocabulary, example, misconception, and takeaway', () => {
    for (const lesson of starterLessons) {
      const theory = lessonTheory[lesson.id];
      expect(theory.sections.length).toBeGreaterThanOrEqual(3);
      expect(theory.terms.length).toBeGreaterThanOrEqual(2);
      expect(theory.intro.ru.length).toBeGreaterThan(100);
      expect(theory.example.ru.length).toBeGreaterThan(80);
      expect(theory.misconception.ru.length).toBeGreaterThan(60);
      expect(theory.takeaway.ru.length).toBeGreaterThan(60);
      for (const section of theory.sections) {
        expect(section.body.ru.length).toBeGreaterThan(100);
      }
    }
  });
});
