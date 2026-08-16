export type LearningStageId =
  | 'instructions'
  | 'trainable-rule'
  | 'loss-and-learning'
  | 'neural-networks'
  | 'backprop'
  | 'real-data'
  | 'tokenization'
  | 'language-modeling'
  | 'embeddings'
  | 'attention'
  | 'transformer'
  | 'tiny-gpt'
  | 'my-gpt'
  | 'assistant'
  | 'knowledge-and-tools'
  | 'systems-and-defense';

export type StarterLessonId =
  | 'human-knows-rule'
  | 'rules-or-examples'
  | 'first-python-predictor'
  | 'trainable-parameters'
  | 'measure-error'
  | 'improve-parameter'
  | 'first-training-loop';

export type LocalizedText = {
  ru: string;
  en: string;
};

export type LearningStage = {
  id: LearningStageId;
  index: number;
  title: LocalizedText;
  question: LocalizedText;
  myAiArtifacts: string[];
};

export type StarterLesson = {
  id: StarterLessonId;
  index: number;
  slug: string;
  stage: LearningStageId;
  title: LocalizedText;
  question: LocalizedText;
  before: LocalizedText;
  after: LocalizedText;
  canDo: LocalizedText;
  artifact: string;
  artifactPurpose: LocalizedText;
  concept: LocalizedText;
  checkpoint: LocalizedText;
  nextId: StarterLessonId | null;
};

export const learningStages: readonly LearningStage[] = [
  {
    id: 'instructions',
    index: 0,
    title: {ru: 'Компьютер выполняет инструкции', en: 'Computers follow instructions'},
    question: {ru: 'Откуда программа знает, что делать?', en: 'How does a program know what to do?'},
    myAiArtifacts: ['01_rule.py', '02_predict.py'],
  },
  {
    id: 'trainable-rule',
    index: 1,
    title: {ru: 'Обучаемое правило', en: 'A trainable rule'},
    question: {ru: 'Можно ли подобрать правило по примерам?', en: 'Can a rule be discovered from examples?'},
    myAiArtifacts: ['03_parameters.py'],
  },
  {
    id: 'loss-and-learning',
    index: 2,
    title: {ru: 'Ошибка и обучение', en: 'Error and learning'},
    question: {ru: 'Как понять, что модель становится лучше?', en: 'How do we know the model is improving?'},
    myAiArtifacts: ['04_loss.py', '05_improve.py', '06_train.py'],
  },
  {
    id: 'neural-networks',
    index: 3,
    title: {ru: 'Первый нейрон и сеть', en: 'The first neuron and network'},
    question: {ru: 'Как из простых вычислений собрать сеть?', en: 'How do simple computations become a network?'},
    myAiArtifacts: ['07_neuron.py', '08_layer.py', '09_mlp.py'],
  },
  {
    id: 'backprop',
    index: 4,
    title: {ru: 'Backprop и autograd', en: 'Backprop and autograd'},
    question: {ru: 'Как обучать тысячи параметров?', en: 'How can we train thousands of parameters?'},
    myAiArtifacts: ['10_value.py', '11_backward.py', '12_autograd_mlp.py'],
  },
  {
    id: 'real-data',
    index: 5,
    title: {ru: 'Настоящие данные', en: 'Real data'},
    question: {ru: 'Как проверить, что модель действительно обобщает?', en: 'How do we know the model really generalizes?'},
    myAiArtifacts: ['13_dataset.py', '14_train_classifier.py', '15_eval.py'],
  },
  {
    id: 'tokenization',
    index: 6,
    title: {ru: 'Текст становится числами', en: 'Text becomes numbers'},
    question: {ru: 'Что видит компьютер вместо слов?', en: 'What does a computer see instead of words?'},
    myAiArtifacts: ['16_tokenizer.py'],
  },
  {
    id: 'language-modeling',
    index: 7,
    title: {ru: 'Первая языковая модель', en: 'The first language model'},
    question: {ru: 'Можно ли научиться предсказывать следующий токен?', en: 'Can we learn to predict the next token?'},
    myAiArtifacts: ['17_bigram.py', '18_generate.py'],
  },
  {
    id: 'embeddings',
    index: 8,
    title: {ru: 'Embeddings и контекст', en: 'Embeddings and context'},
    question: {ru: 'Как модель хранит смысл и порядок?', en: 'How does a model represent meaning and order?'},
    myAiArtifacts: ['19_embeddings.py', '20_context.py'],
  },
  {
    id: 'attention',
    index: 9,
    title: {ru: 'Attention', en: 'Attention'},
    question: {ru: 'Как модели выбирать, на что смотреть?', en: 'How does a model decide what to attend to?'},
    myAiArtifacts: ['21_attention.py', '22_multihead.py'],
  },
  {
    id: 'transformer',
    index: 10,
    title: {ru: 'Transformer', en: 'Transformer'},
    question: {ru: 'Как собрать блок современной языковой модели?', en: 'How do we assemble a modern language-model block?'},
    myAiArtifacts: ['23_block.py', '24_transformer.py'],
  },
  {
    id: 'tiny-gpt',
    index: 11,
    title: {ru: 'TinyGPT', en: 'TinyGPT'},
    question: {ru: 'Как соединить всё в работающую GPT?', en: 'How do we connect everything into a working GPT?'},
    myAiArtifacts: ['25_gpt.py', '26_train_gpt.py', '27_sample.py'],
  },
  {
    id: 'my-gpt',
    index: 12,
    title: {ru: 'MyGPT', en: 'MyGPT'},
    question: {ru: 'Как обучить свою модель на GPU и оценить её?', en: 'How do we train and evaluate our own model on a GPU?'},
    myAiArtifacts: ['mygpt/'],
  },
  {
    id: 'assistant',
    index: 13,
    title: {ru: 'Из модели в ассистента', en: 'From model to assistant'},
    question: {ru: 'Почему базовая языковая модель ещё не помощник?', en: 'Why is a base language model not yet an assistant?'},
    myAiArtifacts: ['assistant/'],
  },
  {
    id: 'knowledge-and-tools',
    index: 14,
    title: {ru: 'Знания и инструменты', en: 'Knowledge and tools'},
    question: {ru: 'Как дать модели внешние знания и действия?', en: 'How do we give a model external knowledge and actions?'},
    myAiArtifacts: ['rag.py', 'tools.py', 'agent.py'],
  },
  {
    id: 'systems-and-defense',
    index: 15,
    title: {ru: 'Systems + Research Defense', en: 'Systems + Research Defense'},
    question: {ru: 'Как запускать модель эффективно и честно оценивать ограничения?', en: 'How do we serve a model efficiently and evaluate its limitations honestly?'},
    myAiArtifacts: ['MODEL_CARD.md', 'evals/'],
  },
] as const;

export const starterLessons: readonly StarterLesson[] = [
  {
    id: 'human-knows-rule',
    index: 0,
    slug: 'human-knows-rule',
    stage: 'instructions',
    title: {ru: 'Ты знаешь правило. Компьютер — нет.', en: 'You know the rule. The computer does not.'},
    question: {ru: 'Откуда программа берёт правило?', en: 'Where does a program get its rule?'},
    before: {ru: 'Кажется, что умная программа сама знает, что делать.', en: 'A smart program can seem to know what to do by itself.'},
    after: {ru: 'Различаю вход, пример, правило и предсказание.', en: 'I can distinguish an input, example, rule, and prediction.'},
    canDo: {ru: 'Нахожу закономерность и применяю её к новому входу.', en: 'I can find a pattern and apply it to a new input.'},
    artifact: 'predict-spec.md',
    artifactPurpose: {ru: 'Спецификация первой функции предсказания.', en: 'Specification for the first prediction function.'},
    concept: {ru: 'Человек может увидеть правило в примерах. Компьютеру правило нужно либо явно запрограммировать, либо научиться находить его по данным.', en: 'A human can notice a rule in examples. A computer needs the rule to be programmed explicitly or learned from data.'},
    checkpoint: {ru: 'Объясни, чем пример отличается от правила.', en: 'Explain how an example differs from a rule.'},
    nextId: 'rules-or-examples',
  },
  {
    id: 'rules-or-examples',
    index: 1,
    slug: 'rules-or-examples',
    stage: 'instructions',
    title: {ru: 'Правила или примеры?', en: 'Rules or examples?'},
    question: {ru: 'Всегда ли человеку удобно писать все правила вручную?', en: 'Is it always practical to write every rule by hand?'},
    before: {ru: 'Любую задачу можно просто описать большим набором ЕСЛИ → ТО.', en: 'Any task can be solved by writing enough IF → THEN rules.'},
    after: {ru: 'Понимаю разницу между программированием правил и обучением по примерам.', en: 'I understand the difference between programming rules and learning from examples.'},
    canDo: {ru: 'Определяю, где лучше правило, а где — данные и обучение.', en: 'I can decide when a rule is better and when examples are better.'},
    artifact: '01_rule.py',
    artifactPurpose: {ru: 'Первая обычная программа с явным правилом.', en: 'The first ordinary program with an explicit rule.'},
    concept: {ru: 'В обычной программе правило формулирует человек. В машинном обучении мы показываем примеры, а параметры модели подстраиваются так, чтобы предсказания становились лучше.', en: 'In an ordinary program, a human writes the rule. In machine learning, we show examples and adjust model parameters so predictions improve.'},
    checkpoint: {ru: 'Для новой задачи выбери: написать правило или собирать примеры — и объясни почему.', en: 'For a new task, choose between writing rules and collecting examples, and explain why.'},
    nextId: 'first-python-predictor',
  },
  {
    id: 'first-python-predictor',
    index: 2,
    slug: 'first-python-predictor',
    stage: 'instructions',
    title: {ru: 'Первое правило на Python', en: 'Your first rule in Python'},
    question: {ru: 'Как превратить понятное правило в работающую программу?', en: 'How do we turn a clear rule into a working program?'},
    before: {ru: 'Python-код выглядит как чужой язык.', en: 'Python code looks like a foreign language.'},
    after: {ru: 'Понимаю переменную, арифметику, функцию, return и вызов функции.', en: 'I understand variables, arithmetic, functions, return, and function calls.'},
    canDo: {ru: 'Дописываю простую функцию predict(x) и проверяю её на новых входах.', en: 'I can complete a simple predict(x) function and test it on new inputs.'},
    artifact: '02_predict.py',
    artifactPurpose: {ru: 'Первая функция предсказания, написанная учеником.', en: 'The first prediction function written by the learner.'},
    concept: {ru: 'Функция принимает вход x, применяет правило и возвращает результат. Пока правило полностью написал человек.', en: 'A function receives x, applies a rule, and returns a result. For now, the human wrote the entire rule.'},
    checkpoint: {ru: 'Измени правило так, чтобы функция работала на новой последовательности.', en: 'Change the rule so the function works for a new sequence.'},
    nextId: 'trainable-parameters',
  },
  {
    id: 'trainable-parameters',
    index: 3,
    slug: 'trainable-parameters',
    stage: 'trainable-rule',
    title: {ru: 'Модель можно настраивать числами', en: 'A model can be tuned with numbers'},
    question: {ru: 'Что если часть правила не писать, а оставить изменяемой?', en: 'What if part of the rule is left adjustable?'},
    before: {ru: 'Правило функции фиксировано программистом.', en: 'The function rule is fixed by the programmer.'},
    after: {ru: 'Понимаю w и b как параметры — числа, которые можно менять.', en: 'I understand w and b as adjustable parameters.'},
    canDo: {ru: 'Вручную подбираю w и b под несколько примеров.', en: 'I can manually tune w and b to fit several examples.'},
    artifact: '03_parameters.py',
    artifactPurpose: {ru: 'Первая параметризованная модель prediction = x*w + b.', en: 'The first parameterized model: prediction = x*w + b.'},
    concept: {ru: 'Параметр — часть правила, значение которой можно изменять. Обучение позже будет означать автоматический подбор этих значений.', en: 'A parameter is an adjustable part of a rule. Later, training will mean choosing these values automatically.'},
    checkpoint: {ru: 'Подбери w и b для нового набора примеров.', en: 'Tune w and b for a new set of examples.'},
    nextId: 'measure-error',
  },
  {
    id: 'measure-error',
    index: 4,
    slug: 'measure-error',
    stage: 'loss-and-learning',
    title: {ru: 'Насколько модель ошиблась?', en: 'How wrong was the model?'},
    question: {ru: 'Как сравнить две почти правильные модели?', en: 'How do we compare two almost-correct models?'},
    before: {ru: 'Результат либо правильный, либо неправильный.', en: 'A result is either right or wrong.'},
    after: {ru: 'Понимаю error и loss как числовую меру качества.', en: 'I understand error and loss as numerical measures of quality.'},
    canDo: {ru: 'Считаю ошибку на новом примере и выбираю лучшую модель.', en: 'I can calculate error on a new example and choose the better model.'},
    artifact: '04_loss.py',
    artifactPurpose: {ru: 'Функция, которая измеряет качество предсказания.', en: 'A function that measures prediction quality.'},
    concept: {ru: 'Чтобы модель могла улучшаться, нам нужно число, которое становится меньше, когда предсказания становятся лучше. Такое число называют loss.', en: 'For a model to improve, we need a number that gets smaller as predictions improve. That number is called loss.'},
    checkpoint: {ru: 'Сравни две модели на одинаковых данных по loss, а не на глаз.', en: 'Compare two models on the same data using loss rather than intuition.'},
    nextId: 'improve-parameter',
  },
  {
    id: 'improve-parameter',
    index: 5,
    slug: 'improve-parameter',
    stage: 'loss-and-learning',
    title: {ru: 'В какую сторону менять параметр?', en: 'Which way should a parameter move?'},
    question: {ru: 'Как перестать подбирать w наугад?', en: 'How do we stop guessing w at random?'},
    before: {ru: 'Чтобы улучшить модель, приходится угадывать новое значение параметра.', en: 'Improving the model means guessing a new parameter value.'},
    after: {ru: 'Понимаю идею чувствительности loss к небольшому изменению параметра.', en: 'I understand how loss responds to a small parameter change.'},
    canDo: {ru: 'Сравниваю loss(w−ε) и loss(w+ε) и выбираю направление улучшения.', en: 'I can compare loss(w−ε) and loss(w+ε) and choose an improving direction.'},
    artifact: '05_improve.py',
    artifactPurpose: {ru: 'Первый автоматический выбор направления изменения параметра.', en: 'The first automatic choice of parameter-update direction.'},
    concept: {ru: 'Если маленькое увеличение параметра уменьшает loss, двигаться стоит туда. Это ещё не полноценный градиент, но уже идея направления спуска.', en: 'If a small increase in a parameter reduces loss, that is the useful direction. This is not full gradient descent yet, but it captures the idea.'},
    checkpoint: {ru: 'По трём значениям loss определи, куда двигать параметр.', en: 'Given three loss values, decide which way to move the parameter.'},
    nextId: 'first-training-loop',
  },
  {
    id: 'first-training-loop',
    index: 6,
    slug: 'first-training-loop',
    stage: 'loss-and-learning',
    title: {ru: 'Первое настоящее обучение', en: 'Your first real training loop'},
    question: {ru: 'Может ли машина сама повторять улучшение?', en: 'Can the machine repeat improvement by itself?'},
    before: {ru: 'Человек вручную проверяет и меняет параметр.', en: 'A human manually checks and changes the parameter.'},
    after: {ru: 'Могу объяснить цикл prediction → loss → update → repeat.', en: 'I can explain prediction → loss → update → repeat.'},
    canDo: {ru: 'Запускаю несколько шагов обучения и вижу, как loss уменьшается.', en: 'I can run several training steps and watch loss decrease.'},
    artifact: '06_train.py',
    artifactPurpose: {ru: 'Первый training loop в MyAI.', en: 'The first training loop in MyAI.'},
    concept: {ru: 'Обучение — не магическая кнопка. Это повторяющийся процесс: сделать предсказание, измерить ошибку, изменить параметры и повторить.', en: 'Training is not a magic button. It is a repeated process: predict, measure error, update parameters, repeat.'},
    checkpoint: {ru: 'Объясни каждую строку мини-цикла обучения и предскажи, что произойдёт с loss.', en: 'Explain every line of a tiny training loop and predict what will happen to loss.'},
    nextId: null,
  },
] as const;

export function getStarterLesson(idOrSlug: string) {
  return starterLessons.find((lesson) => lesson.id === idOrSlug || lesson.slug === idOrSlug) ?? null;
}

export function localize(text: LocalizedText, locale: string) {
  return locale === 'en' ? text.en : text.ru;
}

export function starterLessonHref(locale: string, id: StarterLessonId) {
  const lesson = starterLessons.find((candidate) => candidate.id === id);
  if (!lesson) throw new Error(`Unknown starter lesson: ${id}`);
  return `/${locale}/journey/${lesson.slug}/`;
}
