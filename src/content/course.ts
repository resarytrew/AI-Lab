export type FoundationLessonId =
  | 'what-is-model'
  | 'variables-and-functions'
  | 'first-neuron'
  | 'loss'
  | 'gradient-descent'
  | 'backpropagation';

export type CourseMessageKey =
  | 'whatIsModel'
  | 'variables'
  | 'firstNeuron'
  | 'loss'
  | 'gradient'
  | 'backprop';

export type FoundationLesson = {
  id: FoundationLessonId;
  slug: string;
  messageKey: CourseMessageKey;
  prerequisites: FoundationLessonId[];
  implemented: boolean;
};

export const foundationLessons: readonly FoundationLesson[] = [
  {
    id: 'what-is-model',
    slug: 'what-is-model',
    messageKey: 'whatIsModel',
    prerequisites: [],
    implemented: true,
  },
  {
    id: 'variables-and-functions',
    slug: 'variables-and-functions',
    messageKey: 'variables',
    prerequisites: ['what-is-model'],
    implemented: true,
  },
  {
    id: 'first-neuron',
    slug: 'first-neuron',
    messageKey: 'firstNeuron',
    prerequisites: ['what-is-model', 'variables-and-functions'],
    implemented: true,
  },
  {
    id: 'loss',
    slug: 'loss',
    messageKey: 'loss',
    prerequisites: ['first-neuron'],
    implemented: false,
  },
  {
    id: 'gradient-descent',
    slug: 'gradient-descent',
    messageKey: 'gradient',
    prerequisites: ['loss'],
    implemented: false,
  },
  {
    id: 'backpropagation',
    slug: 'backpropagation',
    messageKey: 'backprop',
    prerequisites: ['gradient-descent'],
    implemented: false,
  },
] as const;

export const courseModules = [
  { messageKey: 'tokenization', total: 4 },
  { messageKey: 'attention', total: 6 },
  { messageKey: 'transformer', total: 6 },
  { messageKey: 'myGpt', total: 5 },
] as const;

export const buildMilestones = [
  { messageKey: 'model', lessonIndex: 0 },
  { messageKey: 'function', lessonIndex: 1 },
  { messageKey: 'neuron', lessonIndex: 2 },
  { messageKey: 'loss', lessonIndex: 3 },
  { messageKey: 'gradient', lessonIndex: 4 },
  { messageKey: 'attention', lessonIndex: 9 },
] as const;

export function getFoundationLesson(id: FoundationLessonId) {
  const lesson = foundationLessons.find((candidate) => candidate.id === id);
  if (!lesson) throw new Error(`Unknown foundation lesson: ${id}`);
  return lesson;
}

export function getFoundationHref(id: FoundationLessonId) {
  const lesson = getFoundationLesson(id);
  return `/learn/foundations/${lesson.slug}`;
}
