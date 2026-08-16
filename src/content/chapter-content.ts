import {chapterEnrichment, type ChapterEnrichment} from './chapter-enrichment';
import type {StarterLessonId} from './learning-path';

const chapterOverrides: Partial<Record<StarterLessonId, Partial<ChapterEnrichment>>> = {
  'measure-error': {
    workedScenario: {
      ru: 'Цель y=7. Два предсказания — 5 и 9. Они одинаково далеко от правильного ответа, но сырые ошибки имеют разные знаки. Нужна функция, которая сравнит такие промахи честно и даст одно число качества.',
      en: 'The target is y=7. Two predictions are 5 and 9. They are equally far from the correct answer, but their raw errors have opposite signs. We need a function that compares such misses fairly and produces one quality number.',
    },
  },
  'first-neuron': {
    workedScenario: {
      ru: 'Возьмём нейрон с двумя входами: x=[2,3], w=[0.5,−1], b=1 и ReLU. Пройдём весь путь вычисления — от отдельных входных признаков до итогового выходного сигнала.',
      en: 'Take a neuron with two inputs: x=[2,3], w=[0.5,−1], b=1, and ReLU. We will trace the full computation from individual input features to the final output signal.',
    },
  },
  'trainable-parameters': {
    researcher: {
      ...chapterEnrichment['trainable-parameters'].researcher,
      conclusion: {
        ru: 'Разные параметры отвечают за разные геометрические свойства модели: вес w меняет чувствительность предсказания к входу, а bias b сдвигает базовый уровень всей зависимости.',
        en: 'Different parameters control different geometric properties of the model: weight w changes prediction sensitivity to the input, while bias b shifts the baseline of the whole relationship.',
      },
    },
  },
};

export function getChapterContent(id: StarterLessonId): ChapterEnrichment {
  const base = chapterEnrichment[id];
  const override = chapterOverrides[id];
  if (!override) return base;

  return {
    ...base,
    ...override,
    math: override.math ?? base.math,
    engineer: override.engineer ?? base.engineer,
    researcher: override.researcher ?? base.researcher,
  };
}
