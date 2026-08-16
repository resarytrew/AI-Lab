export type LearningStageId =
  | 'intelligence'
  | 'data-and-knowledge'
  | 'rules-and-reasoning'
  | 'learning'
  | 'neural-networks'
  | 'backprop-and-generalization'
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
  | 'smart-machine'
  | 'data-to-meaning'
  | 'knowledge-as-rules'
  | 'where-rules-break'
  | 'learn-from-examples'
  | 'trainable-parameters'
  | 'measure-error'
  | 'automatic-improvement'
  | 'gradient-direction'
  | 'first-training-loop'
  | 'first-neuron'
  | 'neuron-layer'
  | 'text-as-data'
  | 'next-token'
  | 'first-language-model';

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
  deepDive: LocalizedText;
  engineer: LocalizedText;
  researcher: LocalizedText;
  nextId: StarterLessonId | null;
};

export const learningStages: readonly LearningStage[] = [
  {
    id: 'intelligence',
    index: 0,
    title: {ru: 'Что значит быть умным?', en: 'What does it mean to be intelligent?'},
    question: {ru: 'Какие способности делают систему интеллектуальной?', en: 'Which abilities make a system intelligent?'},
    myAiArtifacts: ['01_intelligence_criteria.md'],
  },
  {
    id: 'data-and-knowledge',
    index: 1,
    title: {ru: 'Данные, информация и знания', en: 'Data, information, and knowledge'},
    question: {ru: 'Как числа превращаются в смысл и полезное знание?', en: 'How do numbers become meaning and useful knowledge?'},
    myAiArtifacts: ['02_meaning_map.json'],
  },
  {
    id: 'rules-and-reasoning',
    index: 2,
    title: {ru: 'Правила и их пределы', en: 'Rules and their limits'},
    question: {ru: 'Можно ли сделать интеллект, записав все правила вручную?', en: 'Can intelligence be built by writing every rule by hand?'},
    myAiArtifacts: ['03_rule_engine.py', '04_rule_limits.md'],
  },
  {
    id: 'learning',
    index: 3,
    title: {ru: 'Обучение по примерам', en: 'Learning from examples'},
    question: {ru: 'Может ли машина сама найти полезное правило?', en: 'Can a machine discover a useful rule by itself?'},
    myAiArtifacts: ['05_examples.csv', '06_parameters.py', '07_loss.py', '08_search_update.py', '09_gradient_direction.py', '10_train.py'],
  },
  {
    id: 'neural-networks',
    index: 4,
    title: {ru: 'Нейрон и сеть', en: 'Neuron and network'},
    question: {ru: 'Как из простых обучаемых вычислений собрать сеть?', en: 'How do simple trainable computations become a network?'},
    myAiArtifacts: ['11_neuron.py', '12_layer.py'],
  },
  {
    id: 'backprop-and-generalization',
    index: 5,
    title: {ru: 'Глубокие сети и обобщение', en: 'Deep networks and generalization'},
    question: {ru: 'Как обучать много параметров и не просто запоминать данные?', en: 'How do we train many parameters without merely memorizing data?'},
    myAiArtifacts: ['16_mlp.py', '17_autograd.py', '18_eval.py'],
  },
  {
    id: 'tokenization',
    index: 6,
    title: {ru: 'Текст становится данными', en: 'Text becomes data'},
    question: {ru: 'Что видит компьютер вместо слов?', en: 'What does a computer see instead of words?'},
    myAiArtifacts: ['13_tokenizer.py'],
  },
  {
    id: 'language-modeling',
    index: 7,
    title: {ru: 'Первая языковая модель', en: 'The first language model'},
    question: {ru: 'Можно ли учиться предсказывать следующий токен?', en: 'Can a model learn to predict the next token?'},
    myAiArtifacts: ['14_next_token.py', '15_bigram_lm.py'],
  },
  {
    id: 'embeddings',
    index: 8,
    title: {ru: 'Embeddings и контекст', en: 'Embeddings and context'},
    question: {ru: 'Как представить смысл и порядок обучаемыми числами?', en: 'How can meaning and order be represented with trainable numbers?'},
    myAiArtifacts: ['19_embeddings.py', '20_context.py'],
  },
  {
    id: 'attention',
    index: 9,
    title: {ru: 'Attention', en: 'Attention'},
    question: {ru: 'Как модели выбирать, на какие части контекста смотреть?', en: 'How does a model choose which context to attend to?'},
    myAiArtifacts: ['21_attention.py', '22_multihead.py'],
  },
  {
    id: 'transformer',
    index: 10,
    title: {ru: 'Transformer', en: 'Transformer'},
    question: {ru: 'Как собрать главный блок современной языковой модели?', en: 'How do we assemble the core block of a modern language model?'},
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
    question: {ru: 'Как обучить и честно оценить собственную модель?', en: 'How do we train and honestly evaluate our own model?'},
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
    title: {ru: 'RAG, инструменты и агенты', en: 'RAG, tools, and agents'},
    question: {ru: 'Как дать модели внешние знания и возможность действовать?', en: 'How do we give a model external knowledge and the ability to act?'},
    myAiArtifacts: ['rag.py', 'tools.py', 'agent.py'],
  },
  {
    id: 'systems-and-defense',
    index: 15,
    title: {ru: 'Systems + Research Defense', en: 'Systems + Research Defense'},
    question: {ru: 'Как эффективно запускать модель и честно защищать результаты?', en: 'How do we serve a model efficiently and defend the results honestly?'},
    myAiArtifacts: ['MODEL_CARD.md', 'evals/'],
  },
] as const;

export const starterLessons: readonly StarterLesson[] = [
  {
    id: 'smart-machine',
    index: 0,
    slug: 'smart-machine',
    stage: 'intelligence',
    title: {ru: 'Умная ли машина?', en: 'Is the machine intelligent?'},
    question: {ru: 'Если машина считает быстрее человека, значит ли это, что она умнее?', en: 'If a machine calculates faster than a human, does that make it more intelligent?'},
    before: {ru: 'Скорость и сложность программы легко принять за интеллект.', en: 'It is easy to mistake speed and complexity for intelligence.'},
    after: {ru: 'Различаю вычислительную мощность и интеллектуальные способности.', en: 'I can distinguish computational power from intelligent abilities.'},
    canDo: {ru: 'Сравниваю системы по способности учиться, понимать контекст, рассуждать и планировать.', en: 'I can compare systems by learning, context, reasoning, and planning.'},
    artifact: '01_intelligence_criteria.md',
    artifactPurpose: {ru: 'Твои собственные критерии интеллектуальной системы.', en: 'Your own criteria for an intelligent system.'},
    concept: {ru: 'Интеллект нельзя свести к скорости. Нас интересует набор способностей: использовать знания, понимать контекст, учиться, рассуждать и планировать действия.', en: 'Intelligence is not just speed. We care about abilities such as using knowledge, understanding context, learning, reasoning, and planning.'},
    checkpoint: {ru: 'Сравни калькулятор и навигатор: какая способность делает их разными, кроме скорости?', en: 'Compare a calculator and a navigator: which ability makes them different besides speed?'},
    deepDive: {ru: 'Попробуй разделить интеллект на наблюдаемые способности вместо одного абстрактного «ума».', en: 'Try decomposing intelligence into observable abilities instead of one abstract notion of smartness.'},
    engineer: {ru: 'Опиши критерии как структуру данных, которую позже сможет использовать evaluator.', en: 'Represent the criteria as data that an evaluator could later use.'},
    researcher: {ru: 'Придумай систему, которая выглядит умной по одному критерию и проваливается по другому.', en: 'Invent a system that looks intelligent by one criterion and fails another.'},
    nextId: 'data-to-meaning',
  },
  {
    id: 'data-to-meaning',
    index: 1,
    slug: 'data-to-meaning',
    stage: 'data-and-knowledge',
    title: {ru: 'От данных к смыслу', en: 'From data to meaning'},
    question: {ru: 'Почему одинаковые числа могут означать совершенно разные вещи?', en: 'Why can the same numbers mean completely different things?'},
    before: {ru: 'Кажется, что данные уже содержат понятный смысл.', en: 'It can seem that data already contains obvious meaning.'},
    after: {ru: 'Различаю данные, информацию и знание.', en: 'I can distinguish data, information, and knowledge.'},
    canDo: {ru: 'Добавляю контекст к сырым значениям и формулирую вывод, который из них следует.', en: 'I can add context to raw values and formulate a conclusion from them.'},
    artifact: '02_meaning_map.json',
    artifactPurpose: {ru: 'Первая схема «данные → контекст → информация → знание».', en: 'Your first data → context → information → knowledge map.'},
    concept: {ru: 'Данные — зафиксированные значения. Контекст превращает их в информацию. Знание появляется, когда информацию можно использовать для вывода или действия.', en: 'Data is recorded values. Context turns it into information. Knowledge appears when information can support a conclusion or action.'},
    checkpoint: {ru: 'Что нужно добавить к числу 42, чтобы оно стало полезной информацией?', en: 'What must be added to the number 42 to make it useful information?'},
    deepDive: {ru: 'Исследуй, почему один и тот же сигнал может нести разную информацию при разном контексте.', en: 'Explore why the same signal can carry different information in different contexts.'},
    engineer: {ru: 'Спроектируй JSON-запись, где значение хранится вместе с единицами, источником и временем.', en: 'Design a JSON record that stores a value with units, source, and timestamp.'},
    researcher: {ru: 'Найди пример, где больше данных не приводит к большему знанию.', en: 'Find an example where more data does not create more knowledge.'},
    nextId: 'knowledge-as-rules',
  },
  {
    id: 'knowledge-as-rules',
    index: 2,
    slug: 'knowledge-as-rules',
    stage: 'rules-and-reasoning',
    title: {ru: 'Как дать машине правило?', en: 'How do we give a machine a rule?'},
    question: {ru: 'Можно ли превратить человеческое знание в точные инструкции?', en: 'Can human knowledge be turned into precise instructions?'},
    before: {ru: 'Знание кажется чем-то, что программа просто «имеет».', en: 'Knowledge can seem like something a program simply has.'},
    after: {ru: 'Понимаю продукционное правило ЕСЛИ → ТО и цепочку простого вывода.', en: 'I understand IF → THEN production rules and simple inference.'},
    canDo: {ru: 'Собираю маленькую систему правил и применяю её к новой ситуации.', en: 'I can build a small rule system and apply it to a new situation.'},
    artifact: '03_rule_engine.py',
    artifactPurpose: {ru: 'Первая система MyAI, которая выводит решение из явных правил.', en: 'The first MyAI system that derives a decision from explicit rules.'},
    concept: {ru: 'Часть знаний можно представить как правила: если выполнено условие, сделать вывод или действие. Так работают простые rule-based системы.', en: 'Some knowledge can be represented as rules: if a condition holds, derive a conclusion or action. This is the basis of simple rule-based systems.'},
    checkpoint: {ru: 'Придумай два правила для умной лампы так, чтобы они не противоречили друг другу.', en: 'Invent two non-conflicting rules for a smart lamp.'},
    deepDive: {ru: 'Открой разницу между фактом, условием и выводом.', en: 'Explore the difference between a fact, condition, and conclusion.'},
    engineer: {ru: 'Запиши rule engine с функцией, которая принимает состояние мира и возвращает действие.', en: 'Write a rule engine function that receives world state and returns an action.'},
    researcher: {ru: 'Создай пару правил, которая приводит к конфликту, и предложи стратегию разрешения.', en: 'Create two conflicting rules and propose a conflict-resolution strategy.'},
    nextId: 'where-rules-break',
  },
  {
    id: 'where-rules-break',
    index: 3,
    slug: 'where-rules-break',
    stage: 'rules-and-reasoning',
    title: {ru: 'Где правила ломаются?', en: 'Where do rules break?'},
    question: {ru: 'Что произойдёт, если у задачи тысячи исключений и неоднозначных случаев?', en: 'What happens when a task has thousands of exceptions and ambiguous cases?'},
    before: {ru: 'Кажется, что достаточно написать ещё одно правило для каждого исключения.', en: 'It can seem that every exception just needs one more rule.'},
    after: {ru: 'Вижу предел ручного программирования правил для сложных распознающих задач.', en: 'I can see the limits of hand-written rules for complex recognition tasks.'},
    canDo: {ru: 'Нахожу контрпример, который ломает слишком простое правило.', en: 'I can find a counterexample that breaks an oversimplified rule.'},
    artifact: '04_rule_limits.md',
    artifactPurpose: {ru: 'Каталог провалов rule-based подхода, который объясняет, зачем понадобится обучение.', en: 'A catalog of rule-based failures that motivates learning.'},
    concept: {ru: 'Правила сильны, когда условия можно точно перечислить. Но в задачах с огромным разнообразием примеров ручной список правил становится хрупким и практически бесконечным.', en: 'Rules are powerful when conditions can be enumerated precisely. With huge variation, hand-written rule lists become brittle and effectively endless.'},
    checkpoint: {ru: 'Почему правило «у кошки есть шерсть» не годится как универсальный распознаватель кошек?', en: 'Why is “a cat has fur” not a universal cat-recognition rule?'},
    deepDive: {ru: 'Подумай о combinatorial explosion: сколько сочетаний признаков нужно обработать вручную?', en: 'Think about combinatorial explosion: how many feature combinations would need manual handling?'},
    engineer: {ru: 'Напиши тесты, которые намеренно ломают простую rule-based систему.', en: 'Write tests designed to break a simple rule-based system.'},
    researcher: {ru: 'Сформулируй критерий: когда правила всё ещё лучше машинного обучения?', en: 'Formulate a criterion for when rules are still better than machine learning.'},
    nextId: 'learn-from-examples',
  },
  {
    id: 'learn-from-examples',
    index: 4,
    slug: 'learn-from-examples',
    stage: 'learning',
    title: {ru: 'Может ли машина найти правило сама?', en: 'Can a machine discover the rule?'},
    question: {ru: 'Если показать системе примеры, как отличить обучение от простого запоминания?', en: 'If we show examples, how do we distinguish learning from memorization?'},
    before: {ru: 'Запомнить все ответы и научиться кажется одним и тем же.', en: 'Memorizing all answers and learning can seem identical.'},
    after: {ru: 'Понимаю обучение как обнаружение закономерности, которая работает на новом примере.', en: 'I understand learning as finding a pattern that works on a new example.'},
    canDo: {ru: 'Проверяю систему на примере, которого не было среди обучающих данных.', en: 'I can test a system on an example that was not in the training data.'},
    artifact: '05_examples.csv',
    artifactPurpose: {ru: 'Первый набор обучающих примеров и отдельный пример для проверки обобщения.', en: 'Your first training examples plus a held-out example for checking generalization.'},
    concept: {ru: 'Обучение ценнее запоминания, когда найденная закономерность переносится на новые случаи. Это называется обобщением.', en: 'Learning is more than memorization when the discovered pattern transfers to new cases. This is generalization.'},
    checkpoint: {ru: 'Если система правильно отвечает только на те примеры, которые видела раньше, чему она научилась?', en: 'If a system is correct only on examples it has already seen, what has it actually learned?'},
    deepDive: {ru: 'Раздели примеры на train и test и объясни, почему test нельзя показывать при обучении.', en: 'Split examples into train and test and explain why test examples must remain unseen during training.'},
    engineer: {ru: 'Сохрани обучающие пары в CSV и напиши функцию проверки на held-out примере.', en: 'Store training pairs in CSV and write a held-out evaluation function.'},
    researcher: {ru: 'Придумай пример, где правило идеально запоминает train, но проваливает test.', en: 'Construct a case where a rule memorizes train perfectly but fails test.'},
    nextId: 'trainable-parameters',
  },
  {
    id: 'trainable-parameters',
    index: 5,
    slug: 'trainable-parameters',
    stage: 'learning',
    title: {ru: 'Что именно машина может менять?', en: 'What can the machine change?'},
    question: {ru: 'Как оставить часть правила изменяемой, чтобы её можно было подобрать по примерам?', en: 'How can part of a rule remain adjustable so examples can determine it?'},
    before: {ru: 'Правило либо написано программистом, либо кажется магически найденным.', en: 'A rule seems either fully hand-written or magically discovered.'},
    after: {ru: 'Понимаю параметры w и b как изменяемые числа внутри модели.', en: 'I understand w and b as adjustable numbers inside a model.'},
    canDo: {ru: 'Вручную подбираю параметры под несколько обучающих примеров.', en: 'I can manually tune parameters to fit several training examples.'},
    artifact: '06_parameters.py',
    artifactPurpose: {ru: 'Первая обучаемая формула prediction = x*w + b.', en: 'Your first trainable formula: prediction = x*w + b.'},
    concept: {ru: 'Параметры — числа внутри модели, которые определяют её поведение и могут изменяться в процессе обучения.', en: 'Parameters are numbers inside a model that determine its behavior and can change during training.'},
    checkpoint: {ru: 'Подбери w и b для нового набора примеров, а затем объясни роль каждого числа.', en: 'Tune w and b for a new set of examples, then explain each number’s role.'},
    deepDive: {ru: 'Посмотри на y = wx + b как на прямую: w меняет наклон, b — сдвиг.', en: 'View y = wx + b as a line: w changes slope and b changes offset.'},
    engineer: {ru: 'Реализуй predict(x, w, b) и тесты на трёх известных примерах.', en: 'Implement predict(x, w, b) and tests on three known examples.'},
    researcher: {ru: 'Найди набор примеров, который невозможно идеально описать одной прямой.', en: 'Find a dataset that cannot be fit perfectly by one line.'},
    nextId: 'measure-error',
  },
  {
    id: 'measure-error',
    index: 6,
    slug: 'measure-error',
    stage: 'learning',
    title: {ru: 'Насколько модель ошиблась?', en: 'How wrong is the model?'},
    question: {ru: 'Как сравнить две несовершенные модели одним числом?', en: 'How can we compare two imperfect models with one number?'},
    before: {ru: 'Модель кажется просто правильной или неправильной.', en: 'A model can seem simply right or wrong.'},
    after: {ru: 'Понимаю loss как числовую меру ошибки модели на примерах.', en: 'I understand loss as a numeric measure of model error.'},
    canDo: {ru: 'Считаю ошибку на нескольких примерах и выбираю лучшую модель.', en: 'I can calculate error across examples and choose the better model.'},
    artifact: '07_loss.py',
    artifactPurpose: {ru: 'Функция, которая измеряет качество предсказаний MyAI.', en: 'A function that measures MyAI prediction quality.'},
    concept: {ru: 'Loss превращает качество предсказаний в число. Чем меньше loss, тем лучше параметры соответствуют данным по выбранной мере ошибки.', en: 'Loss turns prediction quality into a number. Lower loss means the parameters fit the data better under the chosen error measure.'},
    checkpoint: {ru: 'Почему нельзя оценивать модель только по одному удобному примеру?', en: 'Why should a model not be judged using only one convenient example?'},
    deepDive: {ru: 'Сравни absolute error и squared error и найди, где они по-разному штрафуют большие промахи.', en: 'Compare absolute and squared error and see how they penalize large misses differently.'},
    engineer: {ru: 'Напиши loss(dataset, w, b), который усредняет ошибку по набору.', en: 'Write loss(dataset, w, b) that averages error across a dataset.'},
    researcher: {ru: 'Придумай ситуацию, где выбранный loss поощряет нежелательное поведение.', en: 'Invent a situation where a chosen loss rewards undesirable behavior.'},
    nextId: 'automatic-improvement',
  },
  {
    id: 'automatic-improvement',
    index: 7,
    slug: 'automatic-improvement',
    stage: 'learning',
    title: {ru: 'Можно ли улучшать модель автоматически?', en: 'Can the model improve automatically?'},
    question: {ru: 'Если мы умеем измерять ошибку, может ли программа сама искать лучшие параметры?', en: 'If we can measure error, can a program search for better parameters by itself?'},
    before: {ru: 'Параметры приходится подбирать только вручную.', en: 'Parameters seem to require manual tuning.'},
    after: {ru: 'Понимаю идею поиска параметров по значению loss.', en: 'I understand parameter search guided by loss.'},
    canDo: {ru: 'Перебираю несколько кандидатов и автоматически выбираю параметр с меньшей ошибкой.', en: 'I can evaluate several candidates and automatically select the one with lower error.'},
    artifact: '08_search_update.py',
    artifactPurpose: {ru: 'Первый автоматический механизм улучшения параметра.', en: 'Your first automatic parameter-improvement mechanism.'},
    concept: {ru: 'Как только есть числовая цель, программа может сравнивать варианты параметров и сохранять тот, который уменьшает loss.', en: 'Once there is a numeric objective, a program can compare parameter candidates and keep the one that reduces loss.'},
    checkpoint: {ru: 'Почему полный перебор перестанет быть удобным, когда параметров станет миллион?', en: 'Why does brute-force search become impractical with a million parameters?'},
    deepDive: {ru: 'Оцени, сколько комбинаций получится для 10 параметров, если каждому разрешить 100 значений.', en: 'Estimate the combinations for 10 parameters with 100 values each.'},
    engineer: {ru: 'Напиши функцию search_best_w(candidates), которая выбирает кандидата по loss.', en: 'Write search_best_w(candidates) that selects a candidate by loss.'},
    researcher: {ru: 'Сравни grid search и случайный поиск на маленькой игрушечной задаче.', en: 'Compare grid search and random search on a small toy task.'},
    nextId: 'gradient-direction',
  },
  {
    id: 'gradient-direction',
    index: 8,
    slug: 'gradient-direction',
    stage: 'learning',
    title: {ru: 'Куда менять параметр?', en: 'Which way should the parameter move?'},
    question: {ru: 'Можно ли понять полезное направление, не перебирая все возможные значения?', en: 'Can we find a useful direction without trying every possible value?'},
    before: {ru: 'Чтобы улучшить параметр, нужно перебирать много кандидатов.', en: 'Improvement seems to require trying many candidates.'},
    after: {ru: 'Понимаю чувствительность loss к небольшому изменению параметра.', en: 'I understand the sensitivity of loss to a small parameter change.'},
    canDo: {ru: 'Сравниваю loss(w−ε) и loss(w+ε) и выбираю направление уменьшения ошибки.', en: 'I can compare loss(w−ε) and loss(w+ε) and choose the direction that lowers error.'},
    artifact: '09_gradient_direction.py',
    artifactPurpose: {ru: 'Механизм оценки направления улучшения параметра.', en: 'A mechanism for estimating a useful parameter direction.'},
    concept: {ru: 'Если маленький шаг в одну сторону уменьшает loss, это подсказывает направление изменения параметра. Позже производная и градиент дадут строгий и эффективный способ делать это.', en: 'If a small step in one direction lowers loss, that reveals a useful update direction. Later derivatives and gradients make this precise and efficient.'},
    checkpoint: {ru: 'Что означает ситуация, когда loss растёт и при w−ε, и при w+ε?', en: 'What might it mean if loss increases for both w−ε and w+ε?'},
    deepDive: {ru: 'Открой конечную разность как приближение производной.', en: 'Explore finite differences as an approximation to a derivative.'},
    engineer: {ru: 'Реализуй estimate_slope(w, eps) через два вызова loss.', en: 'Implement estimate_slope(w, eps) using two loss evaluations.'},
    researcher: {ru: 'Проверь, как слишком большое и слишком маленькое ε искажают оценку направления.', en: 'Test how overly large and tiny ε values distort the direction estimate.'},
    nextId: 'first-training-loop',
  },
  {
    id: 'first-training-loop',
    index: 9,
    slug: 'first-training-loop',
    stage: 'learning',
    title: {ru: 'Первое настоящее обучение', en: 'Your first real training loop'},
    question: {ru: 'Что получится, если повторять prediction → loss → update много раз?', en: 'What happens if we repeat prediction → loss → update many times?'},
    before: {ru: 'Умею сделать один полезный шаг параметра.', en: 'I can make one useful parameter update.'},
    after: {ru: 'Понимаю обучение как повторяющийся цикл улучшения параметров.', en: 'I understand training as a repeated parameter-improvement loop.'},
    canDo: {ru: 'Запускаю несколько шагов и наблюдаю, как prediction приближается к target, а loss уменьшается.', en: 'I can run several steps and watch prediction approach the target while loss decreases.'},
    artifact: '10_train.py',
    artifactPurpose: {ru: 'Первый настоящий training loop MyAI.', en: 'MyAI’s first real training loop.'},
    concept: {ru: 'Обучение — это не один удачный подбор числа, а процесс: сделать предсказание, измерить ошибку, изменить параметры и повторить.', en: 'Training is not one lucky guess. It is a process: predict, measure error, update parameters, and repeat.'},
    checkpoint: {ru: 'Почему слишком большой шаг обновления может сделать loss хуже?', en: 'Why can an update step that is too large make loss worse?'},
    deepDive: {ru: 'Исследуй learning rate как размер шага и посмотри на устойчивость обучения.', en: 'Explore learning rate as step size and observe training stability.'},
    engineer: {ru: 'Собери train() с логом step, parameter, prediction и loss.', en: 'Build train() that logs step, parameter, prediction, and loss.'},
    researcher: {ru: 'Сравни две скорости обучения и объясни разные кривые loss.', en: 'Compare two learning rates and explain their different loss curves.'},
    nextId: 'first-neuron',
  },
  {
    id: 'first-neuron',
    index: 10,
    slug: 'first-neuron',
    stage: 'neural-networks',
    title: {ru: 'Что мы только что построили? Первый нейрон', en: 'What did we just build? The first neuron'},
    question: {ru: 'Как знакомая обучаемая формула превращается в искусственный нейрон?', en: 'How does our familiar trainable formula become an artificial neuron?'},
    before: {ru: 'Обучаемая формула существует отдельно от идеи нейросети.', en: 'The trainable formula feels separate from neural networks.'},
    after: {ru: 'Связываю inputs, weights, bias и activation с устройством искусственного нейрона.', en: 'I can connect inputs, weights, bias, and activation to an artificial neuron.'},
    canDo: {ru: 'Считаю выход простого нейрона вручную и объясняю роль каждой части.', en: 'I can calculate a simple neuron output by hand and explain each part.'},
    artifact: '11_neuron.py',
    artifactPurpose: {ru: 'Обучаемая формула оформлена как настоящий класс/функция нейрона.', en: 'The trainable formula is now expressed as a real neuron function/class.'},
    concept: {ru: 'Искусственный нейрон получает входы, умножает их на веса, добавляет bias и может пропускать сумму через нелинейную activation. Его параметры обучаются тем же принципом уменьшения loss.', en: 'An artificial neuron combines inputs with weights and bias and may pass the result through a nonlinear activation. Its parameters are trained by the same loss-reduction principle.'},
    checkpoint: {ru: 'Что изменится в поведении нейрона, если увеличить только один вес?', en: 'What changes if only one neuron weight is increased?'},
    deepDive: {ru: 'Разбери формулу z = Σxᵢwᵢ + b и роль нелинейной activation.', en: 'Study z = Σxᵢwᵢ + b and the role of nonlinear activation.'},
    engineer: {ru: 'Реализуй neuron(inputs, weights, bias) без NumPy.', en: 'Implement neuron(inputs, weights, bias) without NumPy.'},
    researcher: {ru: 'Проверь, какие задачи один линейный нейрон принципиально не может решить.', en: 'Investigate which tasks one linear neuron cannot solve.'},
    nextId: 'neuron-layer',
  },
  {
    id: 'neuron-layer',
    index: 11,
    slug: 'neuron-layer',
    stage: 'neural-networks',
    title: {ru: 'Одного нейрона мало', en: 'One neuron is not enough'},
    question: {ru: 'Что меняется, когда одни и те же входы анализируют несколько нейронов?', en: 'What changes when several neurons analyze the same inputs?'},
    before: {ru: 'Один нейрон кажется универсальным вычислителем.', en: 'One neuron can seem like a universal computation unit.'},
    after: {ru: 'Понимаю слой как несколько нейронов с разными параметрами и выходами.', en: 'I understand a layer as several neurons with different parameters and outputs.'},
    canDo: {ru: 'Вычисляю два разных нейрона на одних входах и собираю их выходы в вектор.', en: 'I can compute two neurons on the same inputs and collect their outputs into a vector.'},
    artifact: '12_layer.py',
    artifactPurpose: {ru: 'Первый слой MyAI из нескольких нейронов.', en: 'MyAI’s first layer made of multiple neurons.'},
    concept: {ru: 'Разные нейроны могут реагировать на разные сочетания входных признаков. Слой вычисляет несколько таких представлений параллельно.', en: 'Different neurons can respond to different combinations of input features. A layer computes several such representations in parallel.'},
    checkpoint: {ru: 'Почему два нейрона с одинаковыми весами не дают слою двух разных способностей?', en: 'Why do two neurons with identical weights not give the layer two different abilities?'},
    deepDive: {ru: 'Посмотри на слой как на умножение вектора на матрицу весов плюс bias.', en: 'View a layer as vector–matrix multiplication plus bias.'},
    engineer: {ru: 'Реализуй dense_layer(inputs, weights, biases) сначала обычными циклами.', en: 'Implement dense_layer(inputs, weights, biases) with ordinary loops first.'},
    researcher: {ru: 'Исследуй, зачем сети нужна нелинейность между слоями.', en: 'Investigate why networks need nonlinearity between layers.'},
    nextId: 'text-as-data',
  },
  {
    id: 'text-as-data',
    index: 12,
    slug: 'text-as-data',
    stage: 'tokenization',
    title: {ru: 'Как нейросети увидеть текст?', en: 'How can a neural network see text?'},
    question: {ru: 'Что нужно сделать со словами, прежде чем модель сможет считать их входами?', en: 'What must happen to words before a model can use them as inputs?'},
    before: {ru: 'Текст кажется естественным входом для компьютера.', en: 'Text can seem like a natural numeric input for a computer.'},
    after: {ru: 'Понимаю цепочку текст → токены → идентификаторы.', en: 'I understand text → tokens → identifiers.'},
    canDo: {ru: 'Создаю маленький vocabulary, кодирую фразу в ID и восстанавливаю её обратно.', en: 'I can create a small vocabulary, encode a phrase into IDs, and decode it.'},
    artifact: '13_tokenizer.py',
    artifactPurpose: {ru: 'Первый tokenizer MyAI с encode/decode.', en: 'MyAI’s first tokenizer with encode/decode.'},
    concept: {ru: 'Модель работает с числами. Tokenizer определяет, на какие единицы разбить текст и каким целым ID сопоставить каждую единицу.', en: 'A model operates on numbers. A tokenizer defines text units and maps each unit to an integer ID.'},
    checkpoint: {ru: 'Почему разные tokenizers могут превратить одно предложение в разное число токенов?', en: 'Why can different tokenizers turn the same sentence into different numbers of tokens?'},
    deepDive: {ru: 'Сравни символы, слова, bytes и BPE как варианты единиц токенизации.', en: 'Compare characters, words, bytes, and BPE as tokenization units.'},
    engineer: {ru: 'Напиши encode(text) и decode(ids) для мини-словаря.', en: 'Write encode(text) and decode(ids) for a tiny vocabulary.'},
    researcher: {ru: 'Сравни эффективность словарей для русского и английского текста.', en: 'Compare vocabulary efficiency for Russian and English text.'},
    nextId: 'next-token',
  },
  {
    id: 'next-token',
    index: 13,
    slug: 'next-token',
    stage: 'language-modeling',
    title: {ru: 'Что будет следующим?', en: 'What comes next?'},
    question: {ru: 'Можно ли превратить язык в задачу предсказания?', en: 'Can language be turned into a prediction problem?'},
    before: {ru: 'Чтобы генерировать текст, модель будто должна «знать весь язык».', en: 'Text generation can seem to require “knowing the entire language” at once.'},
    after: {ru: 'Понимаю language modeling как предсказание распределения следующего токена.', en: 'I understand language modeling as predicting a probability distribution for the next token.'},
    canDo: {ru: 'Считаю частоты продолжений контекста и превращаю их в вероятности.', en: 'I can count continuations of a context and turn counts into probabilities.'},
    artifact: '14_next_token.py',
    artifactPurpose: {ru: 'Первый next-token predictor MyAI.', en: 'MyAI’s first next-token predictor.'},
    concept: {ru: 'Языковая модель получает контекст и оценивает, какой токен может идти следующим. Повторение этого шага позволяет генерировать последовательность.', en: 'A language model receives context and estimates which token may come next. Repeating this step generates a sequence.'},
    checkpoint: {ru: 'Если два продолжения имеют вероятности 0.7 и 0.3, обязана ли модель всегда выбирать 0.7?', en: 'If two continuations have probabilities 0.7 and 0.3, must the model always choose 0.7?'},
    deepDive: {ru: 'Перейди от counts к probability distribution и проверь, что вероятности суммируются до 1.', en: 'Move from counts to a probability distribution and verify probabilities sum to 1.'},
    engineer: {ru: 'Реализуй next_token_probs(context) для игрушечного корпуса.', en: 'Implement next_token_probs(context) for a toy corpus.'},
    researcher: {ru: 'Исследуй temperature и то, как она меняет разнообразие выборки.', en: 'Explore temperature and how it changes sampling diversity.'},
    nextId: 'first-language-model',
  },
  {
    id: 'first-language-model',
    index: 14,
    slug: 'first-language-model',
    stage: 'language-modeling',
    title: {ru: 'Первая языковая модель', en: 'Your first language model'},
    question: {ru: 'Можно ли построить модель, которая учится переходам между токенами и сама генерирует новую последовательность?', en: 'Can we build a model that learns token transitions and generates a new sequence?'},
    before: {ru: 'Умею предсказывать один следующий токен по одному контексту.', en: 'I can predict one next token for one context.'},
    after: {ru: 'Понимаю bigram language model как таблицу обученных переходов между токенами.', en: 'I understand a bigram language model as learned transitions between tokens.'},
    canDo: {ru: 'Строю таблицу переходов, нормирую вероятности и генерирую несколько токенов подряд.', en: 'I can build a transition table, normalize probabilities, and generate several tokens.'},
    artifact: '15_bigram_lm.py',
    artifactPurpose: {ru: 'Первая реально генерирующая языковая модель MyAI.', en: 'MyAI’s first genuinely generative language model.'},
    concept: {ru: 'Bigram-модель смотрит только на один предыдущий токен. Она уже учится статистике языка и генерирует текст, но быстро упирается в слишком короткий контекст — это и приведёт нас к embeddings, контексту и attention.', en: 'A bigram model looks at only one previous token. It already learns language statistics and generates text, but its context is too short—leading naturally to embeddings, longer context, and attention.'},
    checkpoint: {ru: 'Почему bigram-модель не сможет согласовать слово с тем, что было пять токенов назад?', en: 'Why can a bigram model not coordinate with something five tokens earlier?'},
    deepDive: {ru: 'Посчитай negative log-likelihood нескольких переходов и свяжи её с качеством вероятностей.', en: 'Calculate negative log-likelihood for several transitions and connect it to probability quality.'},
    engineer: {ru: 'Реализуй BigramLM: fit(tokens), probabilities(token), sample(start, n).', en: 'Implement BigramLM: fit(tokens), probabilities(token), sample(start, n).'},
    researcher: {ru: 'Сравни unigram, bigram и trigram по качеству и объёму таблицы переходов.', en: 'Compare unigram, bigram, and trigram models by quality and transition-table size.'},
    nextId: null,
  },
] as const;

export function localize(value: LocalizedText, locale: string) {
  return locale === 'en' ? value.en : value.ru;
}

export function getStarterLesson(slugOrId: string) {
  return starterLessons.find((lesson) => lesson.slug === slugOrId || lesson.id === slugOrId);
}

export function starterLessonHref(locale: string, lessonId: StarterLessonId) {
  const lesson = getStarterLesson(lessonId);
  if (!lesson) throw new Error(`Unknown starter lesson: ${lessonId}`);
  return `/${locale}/journey/${lesson.slug}`;
}
